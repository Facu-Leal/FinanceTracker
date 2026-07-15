import Dexie, { type EntityTable } from 'dexie';
import type {
  Account,
  Budget,
  Category,
  FixedExpense,
  FixedExpenseOccurrence,
  Installment,
  InstallmentPurchase,
  Transaction,
} from './types';

export class FinanceTrackerDB extends Dexie {
  accounts!: EntityTable<Account, 'id'>;
  categories!: EntityTable<Category, 'id'>;
  transactions!: EntityTable<Transaction, 'id'>;
  fixedExpenses!: EntityTable<FixedExpense, 'id'>;
  fixedExpenseOccurrences!: EntityTable<FixedExpenseOccurrence, 'id'>;
  installmentPurchases!: EntityTable<InstallmentPurchase, 'id'>;
  installments!: EntityTable<Installment, 'id'>;
  budgets!: EntityTable<Budget, 'id'>;

  constructor() {
    super('finance-tracker');
    // Note: boolean fields (archived, active) are intentionally NOT indexed —
    // IndexedDB does not support boolean as a valid key type. Filtering on
    // them happens in JS after reading, which is fine at personal-data scale.
    this.version(1).stores({
      accounts: 'id',
      categories: 'id, kind',
      transactions: 'id, date, categoryId, accountId, paymentMethod, type, *tags, [accountId+date], [categoryId+date]',
      fixedExpenses: 'id',
      fixedExpenseOccurrences: 'id, fixedExpenseId, period, status',
      installmentPurchases: 'id, status',
      installments: 'id, purchaseId, period, status',
      budgets: 'id, [categoryId+period]',
    });

    // Unique compound index so ensureOccurrenceExists() can rely on IndexedDB itself to
    // reject a second occurrence for the same (fixedExpense, period) under a race, instead
    // of only trusting a check-then-insert — the same class of bug the category seed had.
    this.version(2).stores({
      fixedExpenseOccurrences: 'id, fixedExpenseId, period, status, &[fixedExpenseId+period]',
    });
  }
}

export const db = new FinanceTrackerDB();
