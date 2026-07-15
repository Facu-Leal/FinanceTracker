import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db';
import type { Transaction } from '../../../db/types';

/** All transactions, newest first. Fine to load in full at personal-data scale; filtering happens client-side. */
export function useTransactions(): Transaction[] {
  return (
    useLiveQuery(
      () => db.transactions.orderBy('date').reverse().toArray(),
      [],
    ) ?? []
  );
}

export function useRecentTransactions(limit: number): Transaction[] {
  return (
    useLiveQuery(
      () => db.transactions.orderBy('date').reverse().limit(limit).toArray(),
      [limit],
    ) ?? []
  );
}
