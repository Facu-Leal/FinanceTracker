import type { Account, Category, Transaction } from '../../../db/types';
import type { Money, YearMonth } from '../../../shared/types/common';
import { periodOf } from '../../../shared/utils/dateUtils';

export interface MonthSummary {
  income: Money;
  expense: Money;
  balance: Money;
}

export function computeMonthSummary(transactions: Transaction[], period: YearMonth): MonthSummary {
  let income = 0;
  let expense = 0;
  for (const txn of transactions) {
    if (periodOf(txn.date) !== period) continue;
    if (txn.type === 'income') income += txn.amount;
    if (txn.type === 'expense') expense += txn.amount;
  }
  return { income, expense, balance: income - expense };
}

export function computeTotalBalance(accounts: Account[]): Money {
  return accounts.reduce((sum, a) => sum + a.currentBalance, 0);
}

export interface CategoryTotal {
  category: Category;
  total: Money;
}

export function computeTopCategories(
  transactions: Transaction[],
  categories: Category[],
  period: YearMonth,
  limit: number,
): CategoryTotal[] {
  const totals = new Map<string, Money>();
  for (const txn of transactions) {
    if (txn.type !== 'expense' || !txn.categoryId || periodOf(txn.date) !== period) continue;
    totals.set(txn.categoryId, (totals.get(txn.categoryId) ?? 0) + txn.amount);
  }
  return Array.from(totals.entries())
    .map(([categoryId, total]) => ({ category: categories.find((c) => c.id === categoryId), total }))
    .filter((entry): entry is CategoryTotal => Boolean(entry.category))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}
