import type { Category, Transaction } from '../../../db/types';
import type { Money, YearMonth } from '../../../shared/types/common';
import { periodOf } from '../../../shared/utils/dateUtils';

export type BudgetStatus = 'ok' | 'warning' | 'over';

export function computeCategorySpent(transactions: Transaction[], categoryId: string, period: YearMonth): Money {
  let spent = 0;
  for (const txn of transactions) {
    if (txn.type !== 'expense' || txn.categoryId !== categoryId || periodOf(txn.date) !== period) continue;
    spent += txn.amount;
  }
  return spent;
}

export function evaluateBudgetStatus(spent: Money, limit: Money, warningThresholdPercent: number): BudgetStatus {
  if (limit <= 0) return 'ok';
  const pct = (spent / limit) * 100;
  if (pct >= 100) return 'over';
  if (pct >= warningThresholdPercent) return 'warning';
  return 'ok';
}

export interface CategoryBudgetSummary {
  category: Category;
  spent: Money;
  limit: Money;
  warningThresholdPercent: number;
  status: BudgetStatus;
}

/** Categories with a monthly budget configured, paired with this period's spend and status. */
export function computeBudgetSummaries(
  categories: Category[],
  transactions: Transaction[],
  period: YearMonth,
): CategoryBudgetSummary[] {
  return categories
    .filter((c) => c.monthlyBudget != null && c.monthlyBudget > 0)
    .map((category) => {
      const limit = category.monthlyBudget!;
      const warningThresholdPercent = category.warningThresholdPercent ?? 80;
      const spent = computeCategorySpent(transactions, category.id, period);
      return { category, spent, limit, warningThresholdPercent, status: evaluateBudgetStatus(spent, limit, warningThresholdPercent) };
    })
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit);
}
