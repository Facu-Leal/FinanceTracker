import { useState } from 'react';
import { updateCategory } from '../../../db/repositories/categories.repo';
import { useCategories } from '../../categories/hooks/useCategories';
import { AmountInput } from '../../../shared/ui/AmountInput';
import { centsToEditableString, parseAmountToCents, formatCurrency } from '../../../shared/utils/currency';
import type { Category } from '../../../db/types';

interface BudgetFormProps {
  /** When set, edits this category's budget instead of picking a new one. */
  category?: Category;
  onDone: () => void;
}

export function BudgetForm({ category, onDone }: BudgetFormProps) {
  const expenseCategories = useCategories('expense');
  const candidates = expenseCategories.filter((c) => c.monthlyBudget == null || c.id === category?.id);

  const [categoryId, setCategoryId] = useState(category?.id ?? candidates[0]?.id ?? '');
  const [amount, setAmount] = useState(
    category?.monthlyBudget != null ? centsToEditableString(category.monthlyBudget) : '',
  );
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = categoryId && parseAmountToCents(amount || '0') > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    await updateCategory(categoryId, { monthlyBudget: parseAmountToCents(amount), warningThresholdPercent: 80 });
    setSubmitting(false);
    onDone();
  }

  if (!category && candidates.length === 0) {
    return <p className="text-secondary text-center py-3">Todas tus categorías de gasto ya tienen un presupuesto.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {!category && (
        <div className="mb-2">
          <label className="form-label small text-secondary mb-1">Categoría</label>
          <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="text-center small text-secondary mt-2">Presupuesto mensual</div>
      <AmountInput value={amount} onChange={setAmount} autoFocus />
      {amount && parseAmountToCents(amount) > 0 && (
        <p className="text-center small text-secondary">{formatCurrency(parseAmountToCents(amount))} por mes</p>
      )}

      <button type="submit" className="btn btn-primary w-100 mt-2" disabled={!canSubmit || submitting}>
        Guardar
      </button>
    </form>
  );
}
