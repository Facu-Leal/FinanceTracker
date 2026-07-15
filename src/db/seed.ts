import { db } from './schema';
import { createAccount } from './repositories/accounts.repo';
import { createCategory } from './repositories/categories.repo';

const DEFAULT_CATEGORIES: Array<{ name: string; icon: string; color: string; kind: 'income' | 'expense' | 'both' }> = [
  { name: 'Supermercado', icon: 'bi-cart', color: '#0d6efd', kind: 'expense' },
  { name: 'Transporte', icon: 'bi-bus-front', color: '#fd7e14', kind: 'expense' },
  { name: 'Repostaje', icon: 'bi-fuel-pump', color: '#d63384', kind: 'expense' },
  { name: 'Servicios', icon: 'bi-lightning-charge', color: '#ffc107', kind: 'expense' },
  { name: 'Salud', icon: 'bi-heart-pulse', color: '#dc3545', kind: 'expense' },
  { name: 'Entretenimiento', icon: 'bi-controller', color: '#6f42c1', kind: 'expense' },
  { name: 'Tecnología', icon: 'bi-laptop', color: '#20c997', kind: 'expense' },
  { name: 'Transferencia a terceros', icon: 'bi-send', color: '#0dcaf0', kind: 'expense' },
  { name: 'Sueldo', icon: 'bi-cash-stack', color: '#198754', kind: 'income' },
  { name: 'Otros', icon: 'bi-three-dots', color: '#6c757d', kind: 'both' },
];

/**
 * Seeds a first account and a starter category set on first run, so the app isn't empty on first open.
 * Runs the check-then-insert inside a single readwrite transaction so two concurrent callers
 * (e.g. React StrictMode's intentional double-invoke of effects in dev) can't both see count===0
 * and double-seed — IndexedDB serializes readwrite transactions touching the same stores.
 */
export async function seedIfEmpty(): Promise<void> {
  await db.transaction('rw', db.accounts, db.categories, async () => {
    const [accountCount, categoryCount] = await Promise.all([db.accounts.count(), db.categories.count()]);

    if (accountCount === 0) {
      await createAccount({ name: 'Efectivo', type: 'cash', initialBalance: 0, icon: 'bi-cash', color: '#198754' });
    }

    if (categoryCount === 0) {
      for (const category of DEFAULT_CATEGORIES) {
        await createCategory(category);
      }
    }
  });
}

/**
 * One-time repair for installs affected by an earlier seeding race that could create duplicate
 * default categories. Groups categories by name, keeps one survivor per group (preferring one
 * that already has a budget configured, so nothing gets silently unset), re-points any
 * transactions that referenced a removed duplicate to the survivor, then deletes the duplicates.
 * Safe to run on every app start: a no-op once there are no duplicates left.
 */
export async function dedupeCategories(): Promise<void> {
  await db.transaction('rw', db.categories, db.transactions, async () => {
    const categories = await db.categories.toArray();
    const groups = new Map<string, typeof categories>();
    for (const category of categories) {
      const key = category.name.trim().toLowerCase();
      const list = groups.get(key) ?? [];
      list.push(category);
      groups.set(key, list);
    }

    for (const group of groups.values()) {
      if (group.length <= 1) continue;
      const keeper = group.find((c) => c.monthlyBudget != null) ?? group[0]!;
      for (const duplicate of group) {
        if (duplicate.id === keeper.id) continue;
        await db.transactions.where('categoryId').equals(duplicate.id).modify({ categoryId: keeper.id });
        await db.categories.delete(duplicate.id);
      }
    }
  });
}
