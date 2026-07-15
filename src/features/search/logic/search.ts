import type { Account, Category, Transaction } from '../../../db/types';
import { formatDateDisplay } from '../../../shared/utils/dateUtils';

/**
 * Free-text search across a transaction's description, notes, tags, category name,
 * account name, amount, and date — a single query box, unlike the structured filters
 * in Consultas. Matches if every whitespace-separated term in the query is found
 * somewhere in the combined haystack (an implicit AND across terms).
 */
export function searchTransactions(
  transactions: Transaction[],
  categories: Category[],
  accounts: Account[],
  query: string,
): Transaction[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return transactions.filter((t) => {
    const category = categories.find((c) => c.id === t.categoryId);
    const account = accounts.find((a) => a.id === t.accountId);
    const toAccount = t.toAccountId ? accounts.find((a) => a.id === t.toAccountId) : undefined;

    const haystack = [
      t.description,
      t.notes ?? '',
      ...t.tags,
      category?.name ?? '',
      account?.name ?? '',
      toAccount?.name ?? '',
      String(t.amount / 100),
      t.date,
      formatDateDisplay(t.date),
    ]
      .join(' ')
      .toLowerCase();

    return terms.every((term) => haystack.includes(term));
  });
}
