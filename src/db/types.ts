import type { Id, ISODateString, Money, YearMonth } from '../shared/types/common';

export const PaymentMethod = {
  Cash: 'cash',
  Debit: 'debit',
  Credit: 'credit',
  Transfer: 'transfer',
  MercadoPago: 'mercado_pago',
  Other: 'other',
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export interface Account {
  id: Id;
  name: string;
  type: 'cash' | 'bank' | 'wallet';
  initialBalance: Money;
  currentBalance: Money;
  color?: string;
  icon?: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: Id;
  name: string;
  icon: string;
  color: string;
  kind: 'income' | 'expense' | 'both';
  monthlyBudget?: Money;
  warningThresholdPercent?: number;
  archived: boolean;
}

export interface Transaction {
  id: Id;
  type: 'income' | 'expense' | 'transfer';
  date: ISODateString;
  amount: Money;
  description: string;
  categoryId?: Id;
  accountId: Id;
  toAccountId?: Id;
  paymentMethod?: PaymentMethod;
  paymentMethodOtherLabel?: string;
  notes?: string;
  tags: string[];
  installmentId?: Id;
  fixedExpenseOccurrenceId?: Id;
  createdAt: string;
  updatedAt: string;
}

export interface FixedExpense {
  id: Id;
  name: string;
  categoryId: Id;
  expectedAmount: Money;
  dayOfMonth: number;
  accountId?: Id;
  paymentMethod?: PaymentMethod;
  reminderDaysBefore: number;
  active: boolean;
}

export interface FixedExpenseOccurrence {
  id: Id;
  fixedExpenseId: Id;
  period: YearMonth;
  dueDate: ISODateString;
  status: 'pending' | 'paid' | 'skipped';
  actualAmount?: Money;
  paidDate?: ISODateString;
  transactionId?: Id;
}

export interface InstallmentPurchase {
  id: Id;
  description: string;
  categoryId: Id;
  accountId: Id;
  totalAmount: Money;
  installmentsCount: number;
  firstDueDate: ISODateString;
  remainingInstallments: number;
  pendingBalance: Money;
  nextDueDate?: ISODateString;
  status: 'active' | 'completed';
}

export interface Installment {
  id: Id;
  purchaseId: Id;
  installmentNumber: number;
  amount: Money;
  dueDate: ISODateString;
  period: YearMonth;
  status: 'pending' | 'paid';
  paidDate?: ISODateString;
  transactionId?: Id;
}

export interface Budget {
  id: Id;
  categoryId: Id;
  period: YearMonth;
  limit: Money;
  warningThresholdPercent: number;
}
