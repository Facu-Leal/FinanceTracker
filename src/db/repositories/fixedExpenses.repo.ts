import { v4 as uuid } from 'uuid';
import { db } from '../schema';
import type { FixedExpense, FixedExpenseOccurrence, PaymentMethod } from '../types';
import type { YearMonth } from '../../shared/types/common';
import { computeDueDate } from '../../features/fixed-expenses/logic/recurrence';
import { createTransaction, deleteTransaction } from './transactions.repo';
import { todayISO } from '../../shared/utils/dateUtils';

export interface CreateFixedExpenseInput {
  name: string;
  categoryId: string;
  expectedAmount: number;
  dayOfMonth: number;
  accountId?: string;
  paymentMethod?: PaymentMethod;
  reminderDaysBefore: number;
}

export async function createFixedExpense(input: CreateFixedExpenseInput): Promise<FixedExpense> {
  const fixedExpense: FixedExpense = { id: uuid(), active: true, ...input };
  await db.fixedExpenses.add(fixedExpense);
  return fixedExpense;
}

export async function updateFixedExpense(id: string, changes: Partial<CreateFixedExpenseInput>): Promise<void> {
  await db.fixedExpenses.update(id, changes);
}

/**
 * Removes a fixed expense. If it never generated an occurrence, it's hard-deleted;
 * otherwise it's deactivated instead, so past occurrences/transactions stay valid.
 */
export async function removeFixedExpense(id: string): Promise<void> {
  const referenced = await db.fixedExpenseOccurrences.where('fixedExpenseId').equals(id).count();
  if (referenced === 0) {
    await db.fixedExpenses.delete(id);
  } else {
    await db.fixedExpenses.update(id, { active: false });
  }
}

/** Idempotent: returns the existing occurrence for this (fixedExpense, period) or creates one. */
export async function ensureOccurrenceExists(
  fixedExpense: FixedExpense,
  period: YearMonth,
): Promise<FixedExpenseOccurrence> {
  const existing = await db.fixedExpenseOccurrences
    .where('[fixedExpenseId+period]')
    .equals([fixedExpense.id, period])
    .first();
  if (existing) return existing;

  const occurrence: FixedExpenseOccurrence = {
    id: uuid(),
    fixedExpenseId: fixedExpense.id,
    period,
    dueDate: computeDueDate(fixedExpense, period),
    status: 'pending',
  };

  try {
    await db.fixedExpenseOccurrences.add(occurrence);
    return occurrence;
  } catch {
    // Unique index rejected a concurrent duplicate insert — another call already created it.
    const existingAfterRace = await db.fixedExpenseOccurrences
      .where('[fixedExpenseId+period]')
      .equals([fixedExpense.id, period])
      .first();
    if (existingAfterRace) return existingAfterRace;
    throw new Error(`Could not create or find occurrence for ${fixedExpense.id}/${period}`);
  }
}

export async function ensureOccurrencesForPeriod(fixedExpenses: FixedExpense[], period: YearMonth): Promise<void> {
  await Promise.all(fixedExpenses.filter((f) => f.active).map((fe) => ensureOccurrenceExists(fe, period)));
}

export async function markOccurrencePaid(occurrenceId: string, actualAmount?: number): Promise<void> {
  await db.transaction('rw', db.fixedExpenseOccurrences, db.fixedExpenses, db.transactions, db.accounts, async () => {
    const occurrence = await db.fixedExpenseOccurrences.get(occurrenceId);
    if (!occurrence || occurrence.status === 'paid') return;
    const fixedExpense = await db.fixedExpenses.get(occurrence.fixedExpenseId);
    if (!fixedExpense) return;

    const amount = actualAmount ?? fixedExpense.expectedAmount;
    const accountId = fixedExpense.accountId ?? (await db.accounts.toCollection().first())?.id;
    if (!accountId) return;

    const txn = await createTransaction({
      type: 'expense',
      date: todayISO(),
      amount,
      description: fixedExpense.name,
      categoryId: fixedExpense.categoryId,
      accountId,
      paymentMethod: fixedExpense.paymentMethod,
    });

    await db.fixedExpenseOccurrences.update(occurrenceId, {
      status: 'paid',
      actualAmount: amount,
      paidDate: todayISO(),
      transactionId: txn.id,
    });
  });
}

export async function markOccurrenceUnpaid(occurrenceId: string): Promise<void> {
  await db.transaction('rw', db.fixedExpenseOccurrences, db.transactions, db.accounts, async () => {
    const occurrence = await db.fixedExpenseOccurrences.get(occurrenceId);
    if (!occurrence || occurrence.status !== 'paid') return;
    if (occurrence.transactionId) await deleteTransaction(occurrence.transactionId);
    await db.fixedExpenseOccurrences.update(occurrenceId, {
      status: 'pending',
      actualAmount: undefined,
      paidDate: undefined,
      transactionId: undefined,
    });
  });
}
