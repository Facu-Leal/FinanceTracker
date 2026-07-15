import { z } from 'zod';

const paymentMethodSchema = z.enum(['cash', 'debit', 'credit', 'transfer', 'mercado_pago', 'other']);

const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['cash', 'bank', 'wallet']),
  initialBalance: z.number(),
  currentBalance: z.number(),
  color: z.string().optional(),
  icon: z.string().optional(),
  archived: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  kind: z.enum(['income', 'expense', 'both']),
  monthlyBudget: z.number().optional(),
  warningThresholdPercent: z.number().optional(),
  archived: z.boolean(),
});

const transactionSchema = z.object({
  id: z.string(),
  type: z.enum(['income', 'expense', 'transfer']),
  date: z.string(),
  amount: z.number(),
  description: z.string(),
  categoryId: z.string().optional(),
  accountId: z.string(),
  toAccountId: z.string().optional(),
  paymentMethod: paymentMethodSchema.optional(),
  paymentMethodOtherLabel: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()),
  installmentId: z.string().optional(),
  fixedExpenseOccurrenceId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const fixedExpenseSchema = z.object({
  id: z.string(),
  name: z.string(),
  categoryId: z.string(),
  expectedAmount: z.number(),
  dayOfMonth: z.number(),
  accountId: z.string().optional(),
  paymentMethod: paymentMethodSchema.optional(),
  reminderDaysBefore: z.number(),
  active: z.boolean(),
});

const fixedExpenseOccurrenceSchema = z.object({
  id: z.string(),
  fixedExpenseId: z.string(),
  period: z.string(),
  dueDate: z.string(),
  status: z.enum(['pending', 'paid', 'skipped']),
  actualAmount: z.number().optional(),
  paidDate: z.string().optional(),
  transactionId: z.string().optional(),
});

const installmentPurchaseSchema = z.object({
  id: z.string(),
  description: z.string(),
  categoryId: z.string(),
  accountId: z.string(),
  totalAmount: z.number(),
  installmentsCount: z.number(),
  firstDueDate: z.string(),
  remainingInstallments: z.number(),
  pendingBalance: z.number(),
  nextDueDate: z.string().optional(),
  status: z.enum(['active', 'completed']),
});

const installmentSchema = z.object({
  id: z.string(),
  purchaseId: z.string(),
  installmentNumber: z.number(),
  amount: z.number(),
  dueDate: z.string(),
  period: z.string(),
  status: z.enum(['pending', 'paid']),
  paidDate: z.string().optional(),
  transactionId: z.string().optional(),
});

const budgetSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  period: z.string(),
  limit: z.number(),
  warningThresholdPercent: z.number(),
});

export const backupDataSchema = z.object({
  accounts: z.array(accountSchema),
  categories: z.array(categorySchema),
  transactions: z.array(transactionSchema),
  fixedExpenses: z.array(fixedExpenseSchema),
  fixedExpenseOccurrences: z.array(fixedExpenseOccurrenceSchema),
  installmentPurchases: z.array(installmentPurchaseSchema),
  installments: z.array(installmentSchema),
  budgets: z.array(budgetSchema),
});

export const backupFileSchema = z.object({
  schemaVersion: z.number(),
  exportedAt: z.string(),
  appVersion: z.string(),
  data: backupDataSchema,
});

export type BackupData = z.infer<typeof backupDataSchema>;
export type BackupFile = z.infer<typeof backupFileSchema>;
