import { useState } from 'react';
import { AmountInput } from '../../../shared/ui/AmountInput';
import { markOccurrencePaid } from '../../../db/repositories/fixedExpenses.repo';
import { centsToEditableString, parseAmountToCents, formatCurrency } from '../../../shared/utils/currency';
import type { FixedExpense, FixedExpenseOccurrence } from '../../../db/types';

interface PayOccurrenceFormProps {
  occurrence: FixedExpenseOccurrence;
  fixedExpense: FixedExpense;
  onDone: () => void;
}

/** Lets the user confirm (or adjust) the amount before marking an occurrence paid — bills like luz/agua vary month to month. */
export function PayOccurrenceForm({ occurrence, fixedExpense, onDone }: PayOccurrenceFormProps) {
  const [amount, setAmount] = useState(centsToEditableString(occurrence.actualAmount ?? fixedExpense.expectedAmount));
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = parseAmountToCents(amount || '0') > 0;

  async function handleConfirm() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    await markOccurrencePaid(occurrence.id, parseAmountToCents(amount));
    setSubmitting(false);
    onDone();
  }

  return (
    <div>
      <p className="text-secondary text-center mb-0">{fixedExpense.name}</p>
      <p className="small text-secondary text-center">Monto esperado: {formatCurrency(fixedExpense.expectedAmount)}</p>
      <AmountInput value={amount} onChange={setAmount} autoFocus />
      <button
        type="button"
        className="btn btn-primary w-100 mt-2"
        disabled={!canSubmit || submitting}
        onClick={handleConfirm}
      >
        Confirmar pago
      </button>
    </div>
  );
}
