import { useState } from 'react';
import type { CategoryBudgetSummary } from '../logic/thresholds';
import { BudgetProgressBar } from '../../../shared/ui/BudgetProgressBar';
import { formatCurrency } from '../../../shared/utils/currency';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { BudgetForm } from './BudgetForm';
import { updateCategory } from '../../../db/repositories/categories.repo';

interface BudgetListItemProps {
  summary: CategoryBudgetSummary;
}

const STATUS_TEXT_CLASS: Record<CategoryBudgetSummary['status'], string> = {
  ok: 'text-secondary',
  warning: 'text-warning-emphasis',
  over: 'text-danger',
};

export function BudgetListItem({ summary }: BudgetListItemProps) {
  const { category, spent, limit, status } = summary;
  const [editOpen, setEditOpen] = useState(false);
  const pct = Math.round((spent / limit) * 100);

  return (
    <>
      <button type="button" className="card w-100 border-0 bg-transparent p-0 mb-2 text-start" onClick={() => setEditOpen(true)}>
        <div className="card-body">
          <div className="d-flex align-items-center gap-2 mb-1">
            <i className={`bi ${category.icon}`} style={{ color: category.color }} />
            <span className="fw-medium flex-fill">{category.name}</span>
            <span className="small">
              {formatCurrency(spent)}/{formatCurrency(limit)}
            </span>
          </div>
          <BudgetProgressBar spent={spent} limit={limit} status={status} />
          {status === 'over' && <div className="small text-danger mt-1">¡Superaste el presupuesto! ({pct}%)</div>}
          {status === 'warning' && <div className={`small mt-1 ${STATUS_TEXT_CLASS.warning}`}>Cerca del límite ({pct}%)</div>}
        </div>
      </button>

      <BottomSheet open={editOpen} onClose={() => setEditOpen(false)} title="Editar presupuesto">
        <BudgetForm category={category} onDone={() => setEditOpen(false)} />
        <button
          type="button"
          className="btn btn-outline-danger w-100 mt-2"
          onClick={async () => {
            await updateCategory(category.id, { monthlyBudget: undefined });
            setEditOpen(false);
          }}
        >
          Quitar presupuesto
        </button>
      </BottomSheet>
    </>
  );
}
