import { db } from './schema';
import { seedIfEmpty } from './seed';
import { downloadBackup } from '../features/backups/logic/exportData';

/**
 * Wipes every table back to a fresh-install state and re-seeds the default account/categories,
 * so the app looks the same as the very first time it was opened. Downloads an automatic
 * safety-net backup first — same pattern as restoring an import — so this is always reversible.
 */
export async function resetAllData(): Promise<void> {
  await downloadBackup();

  await db.transaction(
    'rw',
    [
      db.accounts,
      db.categories,
      db.transactions,
      db.fixedExpenses,
      db.fixedExpenseOccurrences,
      db.installmentPurchases,
      db.installments,
      db.budgets,
    ],
    async () => {
      await Promise.all([
        db.accounts.clear(),
        db.categories.clear(),
        db.transactions.clear(),
        db.fixedExpenses.clear(),
        db.fixedExpenseOccurrences.clear(),
        db.installmentPurchases.clear(),
        db.installments.clear(),
        db.budgets.clear(),
      ]);
    },
  );

  await seedIfEmpty();
}
