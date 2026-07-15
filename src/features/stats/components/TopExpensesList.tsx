import type { Transaction } from '../../../db/types';
import { useCategories } from '../../categories/hooks/useCategories';
import { formatCurrency } from '../../../shared/utils/currency';
import { formatDateDisplay } from '../../../shared/utils/dateUtils';

interface TopExpensesListProps {
  transactions: Transaction[];
}

/** A ranked list, not a chart — transaction descriptions are free text and don't fit bar labels. */
export function TopExpensesList({ transactions }: TopExpensesListProps) {
  const categories = useCategories();
  if (transactions.length === 0) return null;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="fw-medium mb-2">
          <i className="bi bi-trophy me-1" />
          Top gastos
        </div>
        {transactions.map((txn, i) => {
          const category = categories.find((c) => c.id === txn.categoryId);
          return (
            <div key={txn.id} className="d-flex align-items-center gap-2 py-1">
              <span className="text-secondary small" style={{ width: '1.2rem' }}>
                {i + 1}
              </span>
              <i className={`bi ${category?.icon ?? 'bi-receipt'}`} style={{ color: category?.color }} />
              <div className="flex-fill overflow-hidden">
                <div className="text-truncate">{txn.description}</div>
                <div className="small text-secondary">{formatDateDisplay(txn.date)}</div>
              </div>
              <span className="fw-semibold text-danger">{formatCurrency(txn.amount)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
