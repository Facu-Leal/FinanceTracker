import { Link } from 'react-router-dom';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { useCategories } from '../../categories/hooks/useCategories';
import { useRecentTransactions, useTransactions } from '../../transactions/hooks/useTransactions';
import { TransactionListItem } from '../../transactions/components/TransactionListItem';
import { formatCurrency } from '../../../shared/utils/currency';
import { currentPeriod, formatPeriodDisplay } from '../../../shared/utils/dateUtils';
import { computeMonthSummary, computeTopCategories, computeTotalBalance } from '../logic/aggregations';
import { computeBudgetSummaries } from '../../budgets/logic/thresholds';
import { BudgetProgressBar } from '../../../shared/ui/BudgetProgressBar';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { useOccurrencesForPeriod } from '../../fixed-expenses/hooks/useOccurrencesForPeriod';

export function DashboardPage() {
  const accounts = useAccounts();
  const categories = useCategories();
  const transactions = useTransactions();
  const recent = useRecentTransactions(5);

  const period = currentPeriod();
  const totalBalance = computeTotalBalance(accounts);
  const monthSummary = computeMonthSummary(transactions, period);
  const topCategories = computeTopCategories(transactions, categories, period, 3);
  const budgetAlerts = computeBudgetSummaries(categories, transactions, period).filter((s) => s.status !== 'ok');
  const dueThisPeriod = useOccurrencesForPeriod(period).filter((d) => d.occurrence.status === 'pending');

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

      {dueThisPeriod.length > 0 && (
        <Link to="/mas/gastos-fijos" className="card mb-3 text-decoration-none text-body">
          <div className="card-body d-flex align-items-center gap-3">
            <i className="bi bi-calendar-check text-primary fs-4" />
            <div className="flex-fill">
              <div className="fw-medium">Próximos vencimientos</div>
              <div className="small text-secondary">
                {dueThisPeriod.length} pendiente{dueThisPeriod.length > 1 ? 's' : ''} ·{' '}
                {formatCurrency(dueThisPeriod.reduce((sum, d) => sum + (d.occurrence.actualAmount ?? d.fixedExpense.expectedAmount), 0))}
              </div>
            </div>
            <i className="bi bi-chevron-right text-secondary" />
          </div>
        </Link>
      )}

      {budgetAlerts.length > 0 && (
        <div className="card mb-3">
          <div className="card-body">
            <div className="fw-medium mb-2">
              <i className="bi bi-exclamation-triangle text-warning me-1" />
              Presupuestos
            </div>
            {budgetAlerts.map((summary) => (
              <div key={summary.category.id} className="mb-2">
                <div className="d-flex align-items-center gap-2 mb-1 small">
                  <i className={`bi ${summary.category.icon}`} style={{ color: summary.category.color }} />
                  <span className="flex-fill">{summary.category.name}</span>
                  <span className={summary.status === 'over' ? 'text-danger fw-medium' : 'text-warning-emphasis'}>
                    {Math.round((summary.spent / summary.limit) * 100)}%{summary.status === 'over' ? ' ¡Supera!' : ''}
                  </span>
                </div>
                <BudgetProgressBar spent={summary.spent} limit={summary.limit} status={summary.status} />
              </div>
            ))}
          </div>
        </div>
      )}

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
