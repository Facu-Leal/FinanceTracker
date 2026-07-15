import { useState } from 'react';
import { createFixedExpense, updateFixedExpense } from '../../../db/repositories/fixedExpenses.repo';
import { AmountInput } from '../../../shared/ui/AmountInput';
import { CategoryPicker } from '../../categories/components/CategoryPicker';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { centsToEditableString, parseAmountToCents } from '../../../shared/utils/currency';
import { PaymentMethod } from '../../../db/types';
import type { FixedExpense } from '../../../db/types';

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.Cash]: 'Efectivo',
  [PaymentMethod.Debit]: 'Débito',
  [PaymentMethod.Credit]: 'Crédito',
  [PaymentMethod.Transfer]: 'Transferencia',
  [PaymentMethod.MercadoPago]: 'Mercado Pago',
  [PaymentMethod.Other]: 'Otro',
};

interface FixedExpenseFormProps {
  fixedExpense?: FixedExpense;
  onDone: () => void;
}

export function FixedExpenseForm({ fixedExpense, onDone }: FixedExpenseFormProps) {
  const accounts = useAccounts();
  const [name, setName] = useState(fixedExpense?.name ?? '');
  const [categoryId, setCategoryId] = useState<string | undefined>(fixedExpense?.categoryId);
  const [amount, setAmount] = useState(fixedExpense ? centsToEditableString(fixedExpense.expectedAmount) : '');
  const [dayOfMonth, setDayOfMonth] = useState(fixedExpense?.dayOfMonth ?? 10);
  const [accountId, setAccountId] = useState(fixedExpense?.accountId ?? '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(fixedExpense?.paymentMethod ?? PaymentMethod.Debit);
  const [reminderDaysBefore, setReminderDaysBefore] = useState(fixedExpense?.reminderDaysBefore ?? 3);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    name.trim().length > 0 && categoryId && parseAmountToCents(amount || '0') > 0 && dayOfMonth >= 1 && dayOfMonth <= 31;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const input = {
      name: name.trim(),
      categoryId: categoryId!,
      expectedAmount: parseAmountToCents(amount),
      dayOfMonth,
      accountId: accountId || undefined,
      paymentMethod,
      reminderDaysBefore,
    };

    if (fixedExpense) {
      await updateFixedExpense(fixedExpense.id, input);
    } else {
      await createFixedExpense(input);
    }

    setSubmitting(false);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <input
          className="form-control"
          placeholder="Nombre (ej. Luz, Internet, Patente)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>

      <div className="text-center small text-secondary mt-2">Monto esperado</div>
      <AmountInput value={amount} onChange={setAmount} />

      <div className="mb-2">
        <CategoryPicker kind="expense" value={categoryId} onChange={setCategoryId} />
      </div>

      <div className="row g-2 mb-2">
        <div className="col-6">
          <label className="form-label small text-secondary mb-1">Día del mes</label>
          <input
            type="number"
            min={1}
            max={31}
            className="form-control"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(Number(e.target.value))}
          />
        </div>
        <div className="col-6">
          <label className="form-label small text-secondary mb-1">Recordar (días antes)</label>
          <input
            type="number"
            min={0}
            max={30}
            className="form-control"
            value={reminderDaysBefore}
            onChange={(e) => setReminderDaysBefore(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="mb-2">
        <label className="form-label small text-secondary mb-1">Cuenta por defecto</label>
        <select className="form-select" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
          <option value="">Elegir al pagar</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="form-label small text-secondary mb-1">Método de pago</label>
        <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}>
          {Object.values(PaymentMethod).map((pm) => (
            <option key={pm} value={pm}>
              {PAYMENT_METHOD_LABELS[pm]}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-100 mt-2" disabled={!canSubmit || submitting}>
        Guardar
      </button>
    </form>
  );
}
