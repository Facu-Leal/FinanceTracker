import { v4 as uuid } from 'uuid';
import { db } from '../schema';
import type { PaymentMethod, Transaction } from '../types';
import { applyTransactionDelta, revertTransactionDelta } from '../../features/accounts/logic/balance';

export interface CreateTransactionInput {
  type: Transaction['type'];
  date: string;
  amount: number;
  description: string;
  categoryId?: string;
  accountId: string;
  toAccountId?: string;
  paymentMethod?: PaymentMethod;
  paymentMethodOtherLabel?: string;
  notes?: string;
  tags?: string[];
}

export async function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  const now = new Date().toISOString();
  const txn: Transaction = {
    id: uuid(),
    type: input.type,
    date: input.date,
    amount: input.amount,
    description: input.description,
    categoryId: input.categoryId,
    accountId: input.accountId,
    toAccountId: input.toAccountId,
    paymentMethod: input.paymentMethod,
    paymentMethodOtherLabel: input.paymentMethodOtherLabel,
    notes: input.notes,
    tags: input.tags ?? [],
    createdAt: now,
    updatedAt: now,
  };

  await db.transaction('rw', db.transactions, db.accounts, async () => {
    await db.transactions.add(txn);
    const account = await db.accounts.get(txn.accountId);
    if (account) await db.accounts.put(applyTransactionDelta(account, txn));
    if (txn.toAccountId) {
      const toAccount = await db.accounts.get(txn.toAccountId);
      if (toAccount) await db.accounts.put(applyTransactionDelta(toAccount, txn));
    }
  });

  return txn;
}

export async function deleteTransaction(id: string): Promise<void> {
  await db.transaction('rw', db.transactions, db.accounts, async () => {
    const txn = await db.transactions.get(id);
    if (!txn) return;

    const account = await db.accounts.get(txn.accountId);
    if (account) await db.accounts.put(revertTransactionDelta(account, txn));
    if (txn.toAccountId) {
      const toAccount = await db.accounts.get(txn.toAccountId);
      if (toAccount) await db.accounts.put(revertTransactionDelta(toAccount, txn));
    }

    await db.transactions.delete(id);
  });
}
