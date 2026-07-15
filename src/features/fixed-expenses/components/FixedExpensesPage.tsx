import { useState } from 'react';
import { useOccurrencesForPeriod } from '../hooks/useOccurrencesForPeriod';
import { currentPeriod, formatPeriodDisplay } from '../../../shared/utils/dateUtils';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { FixedExpenseForm } from './FixedExpenseForm';
import { FixedExpenseListItem } from './FixedExpenseListItem';

export function FixedExpensesPage() {
  const period = currentPeriod();
  const dues = useOccurrencesForPeriod(period);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-1">
        <h1 className="h4 mb-0">Gastos Fijos</h1>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setFormOpen(true)}>
          <i className="bi bi-plus-lg" /> Nuevo
        </button>
      </div>
      <div className="small text-secondary mb-3 text-capitalize">{formatPeriodDisplay(period)}</div>

      {dues.length === 0 ? (
        <EmptyState
          icon="bi-calendar-check"
          title="Todavía no tenés gastos fijos"
          description="Agregá cuentas recurrentes como luz, agua, internet o patente para no olvidarte de pagarlas."
        />
      ) : (
        <div>
          {dues.map((due) => (
            <FixedExpenseListItem key={due.occurrence.id} due={due} />
          ))}
        </div>
      )}

      <BottomSheet open={formOpen} onClose={() => setFormOpen(false)} title="Nuevo gasto fijo">
        <FixedExpenseForm onDone={() => setFormOpen(false)} />
      </BottomSheet>
    </div>
  );
}
