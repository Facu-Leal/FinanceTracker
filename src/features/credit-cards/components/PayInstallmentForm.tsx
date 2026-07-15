import { useState } from 'react';
import { AmountInput } from '../../../shared/ui/AmountInput';
import { markInstallmentPaid } from '../../../db/repositories/installments.repo';
import { parseAmountToCents } from '../../../shared/utils/currency';
import type { Installment } from '../../../db/types';

interface PayInstallmentFormProps {
  installment: Installment;
  installmentsCount: number;
  onDone: () => void;
}

export function PayInstallmentForm({ installment, installmentsCount, onDone }: PayInstallmentFormProps) {
  const [amount, setAmount] = useState(String(installment.amount / 100));
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = parseAmountToCents(amount || '0') > 0;

  async function handleConfirm() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    await markInstallmentPaid(installment.id, parseAmountToCents(amount));
    setSubmitting(false);
    onDone();
  }

  return (
    <div>
      <p className="text-secondary text-center mb-0">
        Cuota {installment.installmentNumber} de {installmentsCount}
      </p>
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
