import { useState } from 'react';
import { createInstallmentPurchase } from '../../../db/repositories/installments.repo';
import { AmountInput } from '../../../shared/ui/AmountInput';
import { CategoryPicker } from '../../categories/components/CategoryPicker';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { formatCurrency, parseAmountToCents } from '../../../shared/utils/currency';
import { todayISO } from '../../../shared/utils/dateUtils';

interface NewPurchaseFormProps {
  onDone: () => void;
}

export function NewPurchaseForm({ onDone }: NewPurchaseFormProps) {
  const accounts = useAccounts();
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>();
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? '');
  const [amount, setAmount] = useState('');
  const [installmentsCount, setInstallmentsCount] = useState(12);
  const [firstDueDate, setFirstDueDate] = useState(todayISO());
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    description.trim().length > 0 &&
    categoryId &&
    (accountId || accounts[0]?.id) &&
    parseAmountToCents(amount || '0') > 0 &&
    installmentsCount >= 2;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    await createInstallmentPurchase({
      description: description.trim(),
      categoryId: categoryId!,
      accountId: accountId || accounts[0]!.id,
      totalAmount: parseAmountToCents(amount),
      installmentsCount,
      firstDueDate,
    });
    setSubmitting(false);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <input
          className="form-control"
          placeholder="Descripción (ej. TV, Heladera)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          autoFocus
        />
      </div>

      <div className="text-center small text-secondary mt-2">Monto total de la compra</div>
      <AmountInput value={amount} onChange={setAmount} />

      <div className="mb-2">
        <CategoryPicker kind="expense" value={categoryId} onChange={setCategoryId} />
      </div>

      <div className="row g-2 mb-2">
        <div className="col-6">
          <label className="form-label small text-secondary mb-1">Cantidad de cuotas</label>
          <input
            type="number"
            min={2}
            max={60}
            className="form-control"
            value={installmentsCount}
            onChange={(e) => setInstallmentsCount(Number(e.target.value))}
          />
        </div>
        <div className="col-6">
          <label className="form-label small text-secondary mb-1">Primer vencimiento</label>
          <input
            type="date"
            className="form-control"
            value={firstDueDate}
            onChange={(e) => setFirstDueDate(e.target.value)}
          />
        </div>
      </div>

      {amount && parseAmountToCents(amount) > 0 && installmentsCount >= 2 && (
        <p className="small text-secondary text-center">
          {installmentsCount} cuotas de aproximadamente{' '}
          {formatCurrency(Math.round(parseAmountToCents(amount) / installmentsCount))}
        </p>
      )}

      <div className="mb-2">
        <label className="form-label small text-secondary mb-1">Cuenta / tarjeta</label>
        <select className="form-select" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
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
