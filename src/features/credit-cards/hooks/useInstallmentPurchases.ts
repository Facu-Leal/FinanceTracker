import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db';
import type { InstallmentPurchase } from '../../../db/types';

export function useInstallmentPurchases(): InstallmentPurchase[] {
  return (
    useLiveQuery(async () => {
      const all = await db.installmentPurchases.toArray();
      return all.sort((a, b) => {
        if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
        return (a.nextDueDate ?? '').localeCompare(b.nextDueDate ?? '');
      });
    }, []) ?? []
  );
}

export function useInstallmentsForPurchase(purchaseId: string) {
  return (
    useLiveQuery(
      () => db.installments.where('purchaseId').equals(purchaseId).sortBy('installmentNumber'),
      [purchaseId],
    ) ?? []
  );
}

/** Installments due this period (any purchase), used for the dashboard summary. */
export function usePendingInstallmentsForPeriod(period: string) {
  return (
    useLiveQuery(
      () => db.installments.where('period').equals(period).and((i) => i.status === 'pending').toArray(),
      [period],
    ) ?? []
  );
}
