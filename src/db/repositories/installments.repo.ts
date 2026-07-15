import { v4 as uuid } from 'uuid';
import { db } from '../schema';
import type { Installment, InstallmentPurchase, PaymentMethod } from '../types';
import type { ISODateString } from '../../shared/types/common';
import { calculateInstallmentPlan, recomputeInstallmentPurchase } from '../../features/credit-cards/logic/installments';
import { createTransaction, deleteTransaction } from './transactions.repo';
import { todayISO } from '../../shared/utils/dateUtils';

export interface CreateInstallmentPurchaseInput {
  description: string;
  categoryId: string;
  accountId: string;
  totalAmount: number;
  installmentsCount: number;
  firstDueDate: ISODateString;
  paymentMethod?: PaymentMethod;
}

export async function createInstallmentPurchase(input: CreateInstallmentPurchaseInput): Promise<InstallmentPurchase> {
  const plan = calculateInstallmentPlan(input.totalAmount, input.installmentsCount, input.firstDueDate);

  const purchase: InstallmentPurchase = {
    id: uuid(),
    description: input.description,
    categoryId: input.categoryId,
    accountId: input.accountId,
    totalAmount: input.totalAmount,
    installmentsCount: input.installmentsCount,
    firstDueDate: input.firstDueDate,
    remainingInstallments: input.installmentsCount,
    pendingBalance: input.totalAmount,
    nextDueDate: input.firstDueDate,
    status: 'active',
  };

  await db.transaction('rw', db.installmentPurchases, db.installments, async () => {
    await db.installmentPurchases.add(purchase);
    const installments: Installment[] = plan.map((entry) => ({
      id: uuid(),
      purchaseId: purchase.id,
      installmentNumber: entry.installmentNumber,
      amount: entry.amount,
      dueDate: entry.dueDate,
      period: entry.period,
      status: 'pending',
    }));
    await db.installments.bulkAdd(installments);
  });

  return purchase;
}

/** Only removable while untouched (no installment ever paid) — otherwise real transaction history depends on it. */
export async function removeInstallmentPurchase(id: string): Promise<boolean> {
  const paidCount = await db.installments
    .where('purchaseId')
    .equals(id)
    .filter((i) => i.status === 'paid')
    .count();
  if (paidCount > 0) return false;

  await db.transaction('rw', db.installmentPurchases, db.installments, async () => {
    await db.installments.where('purchaseId').equals(id).delete();
    await db.installmentPurchases.delete(id);
  });
  return true;
}

async function syncPurchase(purchaseId: string): Promise<void> {
  const installments = await db.installments.where('purchaseId').equals(purchaseId).toArray();
  await db.installmentPurchases.update(purchaseId, recomputeInstallmentPurchase(installments));
}

export async function markInstallmentPaid(installmentId: string, actualAmount?: number): Promise<void> {
  await db.transaction(
    'rw',
    db.installments,
    db.installmentPurchases,
    db.transactions,
    db.accounts,
    async () => {
      const installment = await db.installments.get(installmentId);
      if (!installment || installment.status === 'paid') return;
      const purchase = await db.installmentPurchases.get(installment.purchaseId);
      if (!purchase) return;

      const amount = actualAmount ?? installment.amount;
      const txn = await createTransaction({
        type: 'expense',
        date: todayISO(),
        amount,
        description: `${purchase.description} (cuota ${installment.installmentNumber}/${purchase.installmentsCount})`,
        categoryId: purchase.categoryId,
        accountId: purchase.accountId,
      });

      await db.installments.update(installmentId, {
        status: 'paid',
        paidDate: todayISO(),
        transactionId: txn.id,
      });

      await syncPurchase(purchase.id);
    },
  );
}

export async function markInstallmentUnpaid(installmentId: string): Promise<void> {
  await db.transaction('rw', db.installments, db.installmentPurchases, db.transactions, db.accounts, async () => {
    const installment = await db.installments.get(installmentId);
    if (!installment || installment.status !== 'paid') return;
    if (installment.transactionId) await deleteTransaction(installment.transactionId);

    await db.installments.update(installmentId, {
      status: 'pending',
      paidDate: undefined,
      transactionId: undefined,
    });

    await syncPurchase(installment.purchaseId);
  });
}
