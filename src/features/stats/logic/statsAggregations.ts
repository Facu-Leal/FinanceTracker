import type { Account, Category, PaymentMethod, Transaction } from '../../../db/types';
import type { Id, Money, YearMonth } from '../../../shared/types/common';
import { addMonths, currentPeriod, periodOf, todayISO } from '../../../shared/utils/dateUtils';

export interface NamedTotal {
  id: Id;
  name: string;
  color?: string;
  icon?: string;
  total: Money;
}

const OTHER_ID = '__other__';

/** Groups expense totals by categoryId, ranked descending, folding anything past `limit` into "Otros". */
export function categoryTotals(transactions: Transaction[], categories: Category[], limit = 7): NamedTotal[] {
  const totals = new Map<Id, Money>();
  for (const t of transactions) {
    if (t.type !== 'expense' || !t.categoryId) continue;
    totals.set(t.categoryId, (totals.get(t.categoryId) ?? 0) + t.amount);
  }
  return rankAndFold(totals, (id) => categories.find((c) => c.id === id), limit);
}

export function accountTotals(transactions: Transaction[], accounts: Account[], limit = 7): NamedTotal[] {
  const totals = new Map<Id, Money>();
  for (const t of transactions) {
    if (t.type !== 'expense') continue;
    totals.set(t.accountId, (totals.get(t.accountId) ?? 0) + t.amount);
  }
  return rankAndFold(totals, (id) => accounts.find((a) => a.id === id), limit);
}

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Efectivo',
  debit: 'Débito',
  credit: 'Crédito',
  transfer: 'Transferencia',
  mercado_pago: 'Mercado Pago',
  other: 'Otro',
};

export function paymentMethodTotals(transactions: Transaction[]): NamedTotal[] {
  const totals = new Map<string, Money>();
  for (const t of transactions) {
    if (t.type !== 'expense' || !t.paymentMethod) continue;
    totals.set(t.paymentMethod, (totals.get(t.paymentMethod) ?? 0) + t.amount);
  }
  return Array.from(totals.entries())
    .map(([id, total]) => ({ id, name: PAYMENT_METHOD_LABELS[id as PaymentMethod] ?? id, total }))
    .sort((a, b) => b.total - a.total);
}

/** How many transactions touched each category, ranked descending — "categorías más usadas". */
export function categoryUsageCounts(transactions: Transaction[], categories: Category[], limit = 7): NamedTotal[] {
  const counts = new Map<Id, number>();
  for (const t of transactions) {
    if (!t.categoryId) continue;
    counts.set(t.categoryId, (counts.get(t.categoryId) ?? 0) + 1);
  }
  return rankAndFold(counts, (id) => categories.find((c) => c.id === id), limit);
}

function rankAndFold<T extends { id: Id; name: string; color?: string; icon?: string }>(
  totals: Map<Id, number>,
  lookup: (id: Id) => T | undefined,
  limit: number,
): NamedTotal[] {
  const ranked = Array.from(totals.entries())
    .map(([id, total]) => {
      const entity = lookup(id);
      return { id, name: entity?.name ?? 'Desconocido', color: entity?.color, icon: entity?.icon, total };
    })
    .sort((a, b) => b.total - a.total);

  if (ranked.length <= limit) return ranked;
  const head = ranked.slice(0, limit);
  const otherTotal = ranked.slice(limit).reduce((sum, r) => sum + r.total, 0);
  return [...head, { id: OTHER_ID, name: 'Otros', total: otherTotal }];
}

export interface MonthlyPoint {
  period: YearMonth;
  label: string;
  income: Money;
  expense: Money;
}

/** Income/expense per month for the last `monthsBack` months (including the current one). */
export function monthlyEvolution(transactions: Transaction[], monthsBack = 6): MonthlyPoint[] {
  const today = todayISO();
  const periods: YearMonth[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) periods.push(periodOf(addMonths(today, -i)));

  const byPeriod = new Map<YearMonth, { income: Money; expense: Money }>();
  for (const period of periods) byPeriod.set(period, { income: 0, expense: 0 });

  for (const t of transactions) {
    const period = periodOf(t.date);
    const bucket = byPeriod.get(period);
    if (!bucket) continue;
    if (t.type === 'income') bucket.income += t.amount;
    if (t.type === 'expense') bucket.expense += t.amount;
  }

  return periods.map((period) => ({
    period,
    label: formatShortMonth(period),
    income: byPeriod.get(period)!.income,
    expense: byPeriod.get(period)!.expense,
  }));
}

export interface BalancePoint {
  period: YearMonth;
  label: string;
  balance: Money;
}

/**
 * Total balance across all accounts at each month-end, for the last `monthsBack` months.
 * Transfers move money between the user's own accounts, so they net to zero on the TOTAL —
 * only initial balances plus cumulative income/expense matter here.
 */
export function balanceHistory(accounts: Account[], transactions: Transaction[], monthsBack = 6): BalancePoint[] {
  const startingBalance = accounts.reduce((sum, a) => sum + a.initialBalance, 0);
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  const today = todayISO();
  const periods: YearMonth[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) periods.push(periodOf(addMonths(today, -i)));

  let runningBalance = startingBalance;
  let txnIndex = 0;
  const points: BalancePoint[] = [];

  for (const period of periods) {
    const periodEnd = `${period}-31`;
    while (txnIndex < sorted.length && sorted[txnIndex]!.date <= periodEnd && periodOf(sorted[txnIndex]!.date) <= period) {
      const t = sorted[txnIndex]!;
      if (t.type === 'income') runningBalance += t.amount;
      if (t.type === 'expense') runningBalance -= t.amount;
      txnIndex++;
    }
    points.push({ period, label: formatShortMonth(period), balance: runningBalance });
  }

  return points;
}

export function topExpenses(transactions: Transaction[], limit = 5): Transaction[] {
  return transactions
    .filter((t) => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

export function totalExpenseSinceStart(transactions: Transaction[]): Money {
  return transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
}

export function dailyAverageExpense(transactions: Transaction[]): Money {
  const expenses = transactions.filter((t) => t.type === 'expense');
  if (expenses.length === 0) return 0;
  const total = expenses.reduce((sum, t) => sum + t.amount, 0);
  const firstDate = expenses.reduce((min, t) => (t.date < min ? t.date : min), expenses[0]!.date);
  const days = Math.max(1, daysBetween(firstDate, todayISO()) + 1);
  return Math.round(total / days);
}

export function monthlyAverageExpense(transactions: Transaction[]): Money {
  const expenses = transactions.filter((t) => t.type === 'expense');
  if (expenses.length === 0) return 0;
  const total = expenses.reduce((sum, t) => sum + t.amount, 0);
  const periods = new Set(expenses.map((t) => periodOf(t.date)));
  periods.add(currentPeriod());
  return Math.round(total / periods.size);
}

function daysBetween(from: string, to: string): number {
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  return Math.round((b - a) / 86_400_000);
}

function formatShortMonth(period: YearMonth): string {
  const [y, m] = period.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, 1).toLocaleDateString('es-AR', { month: 'short' });
}
