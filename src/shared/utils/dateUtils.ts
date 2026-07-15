import type { ISODateString, YearMonth } from '../types/common';

export function todayISO(): ISODateString {
  return toISODate(new Date());
}

export function toISODate(date: Date): ISODateString {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function currentPeriod(): YearMonth {
  return periodOf(todayISO());
}

export function periodOf(date: ISODateString): YearMonth {
  return date.slice(0, 7);
}

export function formatDateDisplay(date: ISODateString): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatPeriodDisplay(period: YearMonth): string {
  const [y, m] = period.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, 1).toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  });
}

/** Clamps a day-of-month to the last valid day of the given period (handles Feb, 30-day months). */
export function clampDayToPeriod(period: YearMonth, dayOfMonth: number): ISODateString {
  const [y, m] = period.split('-').map(Number);
  const lastDay = new Date(y ?? 1970, m ?? 1, 0).getDate();
  const day = Math.min(dayOfMonth, lastDay);
  return `${period}-${String(day).padStart(2, '0')}`;
}

/** Adds whole months to a date, clamping the day to the target month's length (e.g. Jan 31 + 1 month -> Feb 28/29). */
export function addMonths(date: ISODateString, months: number): ISODateString {
  const [y, m, d] = date.split('-').map(Number);
  const targetMonthIndex = (m ?? 1) - 1 + months;
  const lastDay = new Date(y ?? 1970, targetMonthIndex + 1, 0).getDate();
  const day = Math.min(d ?? 1, lastDay);
  return toISODate(new Date(y ?? 1970, targetMonthIndex, day));
}
