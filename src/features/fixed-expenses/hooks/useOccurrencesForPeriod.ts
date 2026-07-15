import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db';
import { ensureOccurrencesForPeriod } from '../../../db/repositories/fixedExpenses.repo';
import type { FixedExpense, FixedExpenseOccurrence } from '../../../db/types';
import type { YearMonth } from '../../../shared/types/common';
import { useFixedExpenses } from './useFixedExpenses';

export interface FixedExpenseDue {
  occurrence: FixedExpenseOccurrence;
  fixedExpense: FixedExpense;
}

/** Lazily creates this period's occurrence for every active fixed expense, then reads them reactively. */
export function useOccurrencesForPeriod(period: YearMonth): FixedExpenseDue[] {
  const activeFixedExpenses = useFixedExpenses();

  useEffect(() => {
    if (activeFixedExpenses.length === 0) return;
    void ensureOccurrencesForPeriod(activeFixedExpenses, period);
  }, [period, activeFixedExpenses]);

  return (
    useLiveQuery(async () => {
      const occurrences = await db.fixedExpenseOccurrences.where('period').equals(period).toArray();
      const fixedExpenses = await db.fixedExpenses.toArray();
      const byId = new Map(fixedExpenses.map((f) => [f.id, f]));
      return occurrences
        .map((occurrence) => {
          const fixedExpense = byId.get(occurrence.fixedExpenseId);
          return fixedExpense ? { occurrence, fixedExpense } : undefined;
        })
        .filter((x): x is FixedExpenseDue => Boolean(x))
        .sort((a, b) => a.occurrence.dueDate.localeCompare(b.occurrence.dueDate));
    }, [period]) ?? []
  );
}
