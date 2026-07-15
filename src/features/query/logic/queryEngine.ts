import type { Id, ISODateString, Money } from '../../../shared/types/common';
import type { PaymentMethod, Transaction } from '../../../db/types';

export interface QueryFilters {
  dateFrom?: ISODateString;
  dateTo?: ISODateString;
  type?: Transaction['type'];
  categoryId?: Id;
  accountId?: Id;
  paymentMethod?: PaymentMethod;
  text?: string;
}

export function applyFilters(transactions: Transaction[], filters: QueryFilters): Transaction[] {
  return transactions.filter((t) => {
    if (filters.dateFrom && t.date < filters.dateFrom) return false;
    if (filters.dateTo && t.date > filters.dateTo) return false;
    if (filters.type && t.type !== filters.type) return false;
    if (filters.categoryId && t.categoryId !== filters.categoryId) return false;
    if (filters.accountId && t.accountId !== filters.accountId && t.toAccountId !== filters.accountId) return false;
    if (filters.paymentMethod && t.paymentMethod !== filters.paymentMethod) return false;
    if (filters.text) {
      const needle = filters.text.trim().toLowerCase();
      if (needle) {
        const haystack = `${t.description} ${t.notes ?? ''}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
    }
    return true;
  });
}

export interface CategoryTotal {
  categoryId: Id;
  total: Money;
}

export interface QuerySummary {
  count: number;
  total: Money;
  maxTransaction?: Transaction;
  totalsByCategory: CategoryTotal[];
}

export function summarize(transactions: Transaction[]): QuerySummary {
  let total = 0;
  let maxTransaction: Transaction | undefined;
  const byCategory = new Map<Id, Money>();

  for (const t of transactions) {
    total += t.amount;
    if (!maxTransaction || t.amount > maxTransaction.amount) maxTransaction = t;
    if (t.categoryId) byCategory.set(t.categoryId, (byCategory.get(t.categoryId) ?? 0) + t.amount);
  }

  const totalsByCategory = Array.from(byCategory.entries())
    .map(([categoryId, catTotal]) => ({ categoryId, total: catTotal }))
    .sort((a, b) => b.total - a.total);

  return { count: transactions.length, total, maxTransaction, totalsByCategory };
}
