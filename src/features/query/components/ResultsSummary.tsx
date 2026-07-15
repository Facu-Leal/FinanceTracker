import type { QuerySummary } from '../logic/queryEngine';
import { useCategories } from '../../categories/hooks/useCategories';
import { formatCurrency } from '../../../shared/utils/currency';

interface ResultsSummaryProps {
  summary: QuerySummary;
}

export function ResultsSummary({ summary }: ResultsSummaryProps) {
  const categories = useCategories();
  const topCategory = summary.totalsByCategory[0];
  const topCategoryInfo = topCategory ? categories.find((c) => c.id === topCategory.categoryId) : undefined;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-baseline mb-1">
          <span className="fs-4 fw-semibold">{formatCurrency(summary.total)}</span>
          <span className="small text-secondary">
            {summary.count} movimiento{summary.count === 1 ? '' : 's'}
          </span>
        </div>
        {summary.maxTransaction && (
          <div className="small text-secondary">
            Mayor movimiento: {summary.maxTransaction.description} ({formatCurrency(summary.maxTransaction.amount)})
          </div>
        )}
        {topCategoryInfo && (
          <div className="small text-secondary">
            Categoría que más consume: {topCategoryInfo.name} ({formatCurrency(topCategory!.total)})
          </div>
        )}
      </div>
    </div>
  );
}
