import { useState } from 'react';
import type { FixedExpenseDue } from '../hooks/useOccurrencesForPeriod';
import { useCategories } from '../../categories/hooks/useCategories';
import { formatCurrency } from '../../../shared/utils/currency';
import { formatDateDisplay } from '../../../shared/utils/dateUtils';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { FixedExpenseForm } from './FixedExpenseForm';
import { PayOccurrenceForm } from './PayOccurrenceForm';
import { markOccurrenceUnpaid, removeFixedExpense } from '../../../db/repositories/fixedExpenses.repo';

interface FixedExpenseListItemProps {
  due: FixedExpenseDue;
}

export function FixedExpenseListItem({ due }: FixedExpenseListItemProps) {
  const { occurrence, fixedExpense } = due;
  const categories = useCategories();
  const category = categories.find((c) => c.id === fixedExpense.categoryId);
  const [editOpen, setEditOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  const amount = occurrence.actualAmount ?? fixedExpense.expectedAmount;
  const isPaid = occurrence.status === 'paid';

  return (
    <>
      <div className="card mb-2">
        <div className="card-body d-flex align-items-center gap-3">
          <i className={`bi ${category?.icon ?? 'bi-calendar-check'} fs-4`} style={{ color: category?.color }} />
          <button
            type="button"
            className="btn border-0 bg-transparent p-0 flex-fill text-start"
            onClick={() => setEditOpen(true)}
          >
            <div className="fw-medium">{fixedExpense.name}</div>
            <div className="small text-secondary">
              {isPaid ? 'Pagado' : 'Vence'} {formatDateDisplay(isPaid ? occurrence.paidDate! : occurrence.dueDate)}
            </div>
          </button>
          <div className="fw-semibold">{formatCurrency(amount)}</div>
          {isPaid ? (
            <button
              type="button"
              className="btn btn-sm btn-success"
              aria-label="Marcar como pendiente"
              onClick={() => markOccurrenceUnpaid(occurrence.id)}
            >
              <i className="bi bi-check-lg" />
            </button>
          ) : (
            <button type="button" className="btn btn-sm btn-primary" onClick={() => setPayOpen(true)}>
              Pagar
            </button>
          )}
        </div>
      </div>

      <BottomSheet open={payOpen} onClose={() => setPayOpen(false)} title="Confirmar pago">
        <PayOccurrenceForm occurrence={occurrence} fixedExpense={fixedExpense} onDone={() => setPayOpen(false)} />
      </BottomSheet>

      <BottomSheet open={editOpen} onClose={() => setEditOpen(false)} title="Editar gasto fijo">
        <FixedExpenseForm fixedExpense={fixedExpense} onDone={() => setEditOpen(false)} />
        <button
          type="button"
          className="btn btn-outline-danger w-100 mt-2"
          onClick={async () => {
            await removeFixedExpense(fixedExpense.id);
            setEditOpen(false);
          }}
        >
          Eliminar gasto fijo
        </button>
      </BottomSheet>
    </>
  );
}
