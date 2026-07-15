import type { Id, Money } from '../../../shared/types/common';
import type { Account, Transaction } from '../../../db/types';

/** Ground-truth recomputation from a full transaction list — used for integrity repair and import validation. */
export function computeAccountBalanceFromScratch(
  initialBalance: Money,
  transactions: Transaction[],
  accountId: Id,
): Money {
  let balance = initialBalance;
  for (const txn of transactions) {
    balance += signedDeltaForAccount(txn, accountId);
  }
  return balance;
}

/** Signed delta a single transaction applies to a given account (handles both legs of a transfer). */
export function signedDeltaForAccount(txn: Transaction, accountId: Id): Money {
  if (txn.type === 'income' && txn.accountId === accountId) return txn.amount;
  if (txn.type === 'expense' && txn.accountId === accountId) return -txn.amount;
  if (txn.type === 'transfer') {
    if (txn.accountId === accountId) return -txn.amount;
    if (txn.toAccountId === accountId) return txn.amount;
  }
  return 0;
}

/** Applies an incremental delta to an account's denormalized currentBalance. */
export function applyTransactionDelta(account: Account, txn: Transaction): Account {
  const delta = signedDeltaForAccount(txn, account.id);
  if (delta === 0) return account;
  return { ...account, currentBalance: account.currentBalance + delta, updatedAt: new Date().toISOString() };
}

/** Inverse of applyTransactionDelta — used when editing/deleting a transaction. */
export function revertTransactionDelta(account: Account, txn: Transaction): Account {
  const delta = signedDeltaForAccount(txn, account.id);
  if (delta === 0) return account;
  return { ...account, currentBalance: account.currentBalance - delta, updatedAt: new Date().toISOString() };
}
