import type { Installment, InstallmentPurchase } from '../../../db/types';
import type { ISODateString, Money, YearMonth } from '../../../shared/types/common';
import { addMonths, periodOf } from '../../../shared/utils/dateUtils';

export interface InstallmentPlanEntry {
  installmentNumber: number;
  amount: Money;
  dueDate: ISODateString;
  period: YearMonth;
}

/** Splits totalAmount into `count` equal installments (in cents); any leftover cent goes to the last one. */
export function calculateInstallmentPlan(
  totalAmount: Money,
  count: number,
  firstDueDate: ISODateString,
): InstallmentPlanEntry[] {
  const base = Math.floor(totalAmount / count);
  const remainder = totalAmount - base * count;

  return Array.from({ length: count }, (_, i) => {
    const dueDate = addMonths(firstDueDate, i);
    return {
      installmentNumber: i + 1,
      amount: i === count - 1 ? base + remainder : base,
      dueDate,
      period: periodOf(dueDate),
    };
  });
}

export type InstallmentPurchaseDerived = Pick<
  InstallmentPurchase,
  'remainingInstallments' | 'pendingBalance' | 'nextDueDate' | 'status'
>;

export function recomputeInstallmentPurchase(installments: Installment[]): InstallmentPurchaseDerived {
  const pending = installments.filter((i) => i.status === 'pending').sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  return {
    remainingInstallments: pending.length,
    pendingBalance: pending.reduce((sum, i) => sum + i.amount, 0),
    nextDueDate: pending[0]?.dueDate,
    status: pending.length === 0 ? 'completed' : 'active',
  };
}
