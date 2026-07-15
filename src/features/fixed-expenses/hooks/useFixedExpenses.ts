import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db';
import type { FixedExpense } from '../../../db/types';

export function useFixedExpenses(includeInactive = false): FixedExpense[] {
  return (
    useLiveQuery(async () => {
      const all = await db.fixedExpenses.toArray();
      return includeInactive ? all : all.filter((f) => f.active);
    }, [includeInactive]) ?? []
  );
}
