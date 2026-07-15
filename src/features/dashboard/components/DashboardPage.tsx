import { useAccounts } from '../../accounts/hooks/useAccounts';
import { useCategories } from '../../categories/hooks/useCategories';
import { useRecentTransactions, useTransactions } from '../../transactions/hooks/useTransactions';
import { TransactionListItem } from '../../transactions/components/TransactionListItem';
import { formatCurrency } from '../../../shared/utils/currency';
import { currentPeriod, formatPeriodDisplay } from '../../../shared/utils/dateUtils';
import { computeMonthSummary, computeTopCategories, computeTotalBalance } from '../logic/aggregations';
import { EmptyState } from '../../../shared/ui/EmptyState';

export function DashboardPage() {
  const accounts = useAccounts();
  const categories = useCategories();
  const transactions = useTransactions();
  const recent = useRecentTransactions(5);

  const period = currentPeriod();
  const totalBalance = computeTotalBalance(accounts);
  const monthSummary = computeMonthSummary(transactions, period);
  const topCategories = computeTopCategories(transactions, categories, period, 3);

  return (
    <div>
      <h1 className="h4 mb-3">Hola 👋</h1>

      <div className="card mb-3">
        <div className="card-body">
          <div className="small text-secondary">Saldo disponible</div>
          <div className="display-6 fw-semibold">{formatCurrency(totalBalance)}</div>
        </div>
      </div>

      <div className="row row-cols-2 g-2 mb-3">
        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <div className="small text-secondary">Ingresos</div>
              <div className="fs-5 fw-semibold text-success">{formatCurrency(monthSummary.income)}</div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <div className="small text-secondary">Gastos</div>
              <div className="fs-5 fw-semibold text-danger">{formatCurrency(monthSummary.expense)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="small text-secondary text-capitalize">{formatPeriodDisplay(period)}</span>
        <span className={`small fw-medium ${monthSummary.balance >= 0 ? 'text-success' : 'text-danger'}`}>
          Balance del mes: {formatCurrency(monthSummary.balance)}
        </span>
      </div>

      {topCategories.length > 0 && (
        <div className="card mb-3">
          <div className="card-body">
            <div className="fw-medium mb-2">Mayor gasto por categoría</div>
            {topCategories.map(({ category, total }) => (
              <div key={category.id} className="d-flex align-items-center gap-2 py-1">
                <i className={`bi ${category.icon}`} style={{ color: category.color }} />
                <span className="flex-fill">{category.name}</span>
                <span className="fw-medium">{formatCurrency(total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fw-medium mb-2">Movimientos recientes</div>
      {recent.length === 0 ? (
        <EmptyState icon="bi-receipt" title="Sin movimientos todavía" />
      ) : (
        <div className="list-group list-group-flush card">
          {recent.map((txn) => (
            <TransactionListItem key={txn.id} transaction={txn} />
          ))}
        </div>
      )}
    </div>
  );
}
