import type { FixedExpense } from '../../../db/types';
import type { ISODateString, YearMonth } from '../../../shared/types/common';
import { clampDayToPeriod } from '../../../shared/utils/dateUtils';

export function computeDueDate(fixedExpense: Pick<FixedExpense, 'dayOfMonth'>, period: YearMonth): ISODateString {
  return clampDayToPeriod(period, fixedExpense.dayOfMonth);
}

/** True once today is within `reminderDaysBefore` days of the due date (or past it). */
export function isReminderDue(dueDate: ISODateString, today: ISODateString, reminderDaysBefore: number): boolean {
  const due = new Date(dueDate).getTime();
  const now = new Date(today).getTime();
  const diffDays = Math.round((due - now) / 86_400_000);
  return diffDays <= reminderDaysBefore;
}
