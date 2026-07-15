import { useState } from 'react';
import type { InstallmentPurchase } from '../../../db/types';
import { formatCurrency } from '../../../shared/utils/currency';
import { formatDateDisplay } from '../../../shared/utils/dateUtils';
import { InstallmentScheduleSheet } from './InstallmentScheduleSheet';

interface InstallmentPurchaseCardProps {
  purchase: InstallmentPurchase;
}

export function InstallmentPurchaseCard({ purchase }: InstallmentPurchaseCardProps) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const paidCount = purchase.installmentsCount - purchase.remainingInstallments;
  const currentInstallment = Math.min(paidCount + 1, purchase.installmentsCount);
  const progressPct = Math.round((paidCount / purchase.installmentsCount) * 100);

  return (
    <>
      <button type="button" className="card w-100 border-0 mb-2 text-start" onClick={() => setScheduleOpen(true)}>
        <div className="card-body">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="fw-medium flex-fill">{purchase.description}</span>
            <span className="fw-semibold">{formatCurrency(purchase.totalAmount)}</span>
          </div>
          <div className="small text-secondary mb-1">
            {purchase.status === 'completed' ? (
              'Completada'
            ) : (
              <>
                Cuota {currentInstallment} de {purchase.installmentsCount} · próx: {formatDateDisplay(purchase.nextDueDate!)}
              </>
            )}
          </div>
          <div className="progress mb-1" style={{ height: '0.5rem' }}>
            <div
              className={`progress-bar ${purchase.status === 'completed' ? 'bg-success' : 'bg-primary'}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="small text-secondary">Pendiente: {formatCurrency(purchase.pendingBalance)}</div>
        </div>
      </button>

      <InstallmentScheduleSheet purchase={purchase} open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </>
  );
}
