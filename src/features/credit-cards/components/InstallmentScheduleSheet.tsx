import { useState } from 'react';
import type { InstallmentPurchase } from '../../../db/types';
import { useInstallmentsForPurchase } from '../hooks/useInstallmentPurchases';
import { formatCurrency } from '../../../shared/utils/currency';
import { formatDateDisplay } from '../../../shared/utils/dateUtils';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { PayInstallmentForm } from './PayInstallmentForm';
import { markInstallmentUnpaid, removeInstallmentPurchase } from '../../../db/repositories/installments.repo';

interface InstallmentScheduleSheetProps {
  purchase: InstallmentPurchase;
  open: boolean;
  onClose: () => void;
}

export function InstallmentScheduleSheet({ purchase, open, onClose }: InstallmentScheduleSheetProps) {
  const installments = useInstallmentsForPurchase(purchase.id);
  const [payingId, setPayingId] = useState<string>();
  const payingInstallment = installments.find((i) => i.id === payingId);
  const [deleteError, setDeleteError] = useState(false);

  return (
    <BottomSheet open={open} onClose={onClose} title={purchase.description}>
      <p className="small text-secondary mb-2">
        {formatCurrency(purchase.totalAmount)} en {purchase.installmentsCount} cuotas
      </p>

      <div className="list-group list-group-flush mb-3">
        {installments.map((installment) => (
          <div key={installment.id} className="list-group-item d-flex align-items-center gap-2 px-0">
            <span className="flex-fill">
              Cuota {installment.installmentNumber}/{purchase.installmentsCount}{' '}
              <span className="small text-secondary">
                {installment.status === 'paid' ? `pagada ${formatDateDisplay(installment.paidDate!)}` : `vence ${formatDateDisplay(installment.dueDate)}`}
              </span>
            </span>
            <span className="fw-medium">{formatCurrency(installment.amount)}</span>
            {installment.status === 'paid' ? (
              <button
                type="button"
                className="btn btn-sm btn-success"
                aria-label={`Marcar cuota ${installment.installmentNumber} como pendiente`}
                onClick={() => markInstallmentUnpaid(installment.id)}
              >
                <i className="bi bi-check-lg" />
              </button>
            ) : (
              <button type="button" className="btn btn-sm btn-primary" onClick={() => setPayingId(installment.id)}>
                Pagar
              </button>
            )}
          </div>
        ))}
      </div>

      {deleteError && (
        <p className="small text-danger">No se puede eliminar: ya hay cuotas pagadas de esta compra.</p>
      )}
      <button
        type="button"
        className="btn btn-outline-danger w-100"
        onClick={async () => {
          const removed = await removeInstallmentPurchase(purchase.id);
          if (removed) onClose();
          else setDeleteError(true);
        }}
      >
        Eliminar compra
      </button>

      <BottomSheet open={Boolean(payingInstallment)} onClose={() => setPayingId(undefined)} title="Confirmar pago">
        {payingInstallment && (
          <PayInstallmentForm
            installment={payingInstallment}
            installmentsCount={purchase.installmentsCount}
            onDone={() => setPayingId(undefined)}
          />
        )}
      </BottomSheet>
    </BottomSheet>
  );
}
