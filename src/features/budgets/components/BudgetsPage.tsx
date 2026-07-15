import { useState } from 'react';
import { useCategories } from '../../categories/hooks/useCategories';
import { useTransactions } from '../../transactions/hooks/useTransactions';
import { computeBudgetSummaries } from '../logic/thresholds';
import { currentPeriod } from '../../../shared/utils/dateUtils';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { BudgetForm } from './BudgetForm';
import { BudgetListItem } from './BudgetListItem';

export function BudgetsPage() {
  const categories = useCategories();
  const transactions = useTransactions();
  const [formOpen, setFormOpen] = useState(false);

  const period = currentPeriod();
  const summaries = computeBudgetSummaries(categories, transactions, period);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Presupuestos</h1>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setFormOpen(true)}>
          <i className="bi bi-plus-lg" /> Nuevo
        </button>
      </div>

      {summaries.length === 0 ? (
        <EmptyState
          icon="bi-piggy-bank"
          title="Todavía no tenés presupuestos"
          description="Definí cuánto querés gastar por categoría cada mes."
        />
      ) : (
        <div>
          {summaries.map((summary) => (
            <BudgetListItem key={summary.category.id} summary={summary} />
          ))}
        </div>
      )}

      <BottomSheet open={formOpen} onClose={() => setFormOpen(false)} title="Nuevo presupuesto">
        <BudgetForm onDone={() => setFormOpen(false)} />
      </BottomSheet>
    </div>
  );
}
