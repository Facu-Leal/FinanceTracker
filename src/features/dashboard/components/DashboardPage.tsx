import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { useCategories } from '../../categories/hooks/useCategories';
import { useRecentTransactions, useTransactions } from '../../transactions/hooks/useTransactions';
import { TransactionListItem } from '../../transactions/components/TransactionListItem';
import { MaskedAmount } from '../../../shared/ui/MaskedAmount';
import { usePrivacyMode } from '../../../shared/privacyMode';
import { getStoredDefaultAccountId, setStoredDefaultAccountId } from '../../../shared/defaultAccount';
import { currentPeriod, formatPeriodDisplay } from '../../../shared/utils/dateUtils';
import { computeMonthSummary, computeTopCategories, computeTotalBalance } from '../logic/aggregations';
import { computeBudgetSummaries } from '../../budgets/logic/thresholds';
import { BudgetProgressBar } from '../../../shared/ui/BudgetProgressBar';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { useOccurrencesForPeriod } from '../../fixed-expenses/hooks/useOccurrencesForPeriod';
import { usePendingInstallmentsForPeriod } from '../../credit-cards/hooks/useInstallmentPurchases';

export function DashboardPage() {
  const accounts = useAccounts();
  const categories = useCategories();
  const transactions = useTransactions();
  const recent = useRecentTransactions(5);
  const { hidden, toggle } = usePrivacyMode();

  const [accountSheetOpen, setAccountSheetOpen] = useState(false);
  const [lastTxnKind, setLastTxnKind] = useState<'income' | 'expense' | null>(null);
  const [defaultAccountId, setDefaultAccountId] = useState<string | null>(() => getStoredDefaultAccountId());

  const period = currentPeriod();
  const totalBalance = computeTotalBalance(accounts);
  const monthSummary = computeMonthSummary(transactions, period);
  const topCategories = computeTopCategories(transactions, categories, period, 3);
  const budgetAlerts = computeBudgetSummaries(categories, transactions, period).filter((s) => s.status !== 'ok');
  const dueThisPeriod = useOccurrencesForPeriod(period).filter((d) => d.occurrence.status === 'pending');
  const dueInstallments = usePendingInstallmentsForPeriod(period);

  const effectiveDefaultAccountId = accounts.some((a) => a.id === defaultAccountId)
    ? defaultAccountId
    : accounts[0]?.id;
  const lastTransaction = lastTxnKind ? transactions.find((t) => t.type === lastTxnKind) : undefined;

  function selectDefaultAccount(accountId: string) {
    setStoredDefaultAccountId(accountId);
    setDefaultAccountId(accountId);
    setAccountSheetOpen(false);
  }

  return (
    <div>
      <h1 className="h4 mb-3">Finance Tracker</h1>

      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <button
              type="button"
              className="btn border-0 bg-transparent p-0 small text-secondary d-flex align-items-center gap-1"
              onClick={() => setAccountSheetOpen(true)}
            >
              Saldo disponible
              <i className="bi bi-chevron-right" />
            </button>
            <button
              type="button"
              className="btn btn-sm btn-link text-secondary p-0"
              aria-label={hidden ? 'Mostrar saldo' : 'Ocultar saldo'}
              onClick={toggle}
            >
              <i className={`bi ${hidden ? 'bi-eye-slash' : 'bi-eye'}`} />
            </button>
          </div>
          <button
            type="button"
            className="btn border-0 bg-transparent p-0 w-100 text-start display-6 fw-semibold"
            onClick={() => setAccountSheetOpen(true)}
          >
            <MaskedAmount value={totalBalance} />
          </button>
        </div>
      </div>

      <div className="row row-cols-2 g-2 mb-3">
        <div className="col">
          <div className="card h-100">
            <button
              type="button"
              className="btn border-0 bg-transparent w-100 h-100 text-start p-0"
              onClick={() => setLastTxnKind('income')}
            >
              <div className="card-body">
                <div className="small text-secondary">Ingresos</div>
                <div className="fs-5 fw-semibold text-success">
                  <MaskedAmount value={monthSummary.income} />
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <button
              type="button"
              className="btn border-0 bg-transparent w-100 h-100 text-start p-0"
              onClick={() => setLastTxnKind('expense')}
            >
              <div className="card-body">
                <div className="small text-secondary">Gastos</div>
                <div className="fs-5 fw-semibold text-danger">
                  <MaskedAmount value={monthSummary.expense} />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <BottomSheet open={accountSheetOpen} onClose={() => setAccountSheetOpen(false)} title="Cuenta predeterminada">
        <p className="text-secondary small">
          Elegí la cuenta que se preselecciona al registrar un movimiento nuevo.
        </p>
        {accounts.length === 0 ? (
          <EmptyState icon="bi-wallet2" title="Todavía no tenés cuentas" />
        ) : (
          <div className="list-group list-group-flush">
            {accounts.map((account) => (
              <button
                key={account.id}
                type="button"
                className="list-group-item list-group-item-action d-flex align-items-center gap-3"
                onClick={() => selectDefaultAccount(account.id)}
              >
                <i className={`bi ${account.icon ?? 'bi-wallet2'} fs-5 text-primary`} />
                <div className="flex-fill text-start">
                  <div className="fw-medium">{account.name}</div>
                  <div className="small text-secondary">
                    <MaskedAmount value={account.currentBalance} />
                  </div>
                </div>
                {account.id === effectiveDefaultAccountId && <i className="bi bi-check-circle-fill text-primary" />}
              </button>
            ))}
          </div>
        )}
      </BottomSheet>

      <BottomSheet
        open={lastTxnKind !== null}
        onClose={() => setLastTxnKind(null)}
        title={lastTxnKind === 'income' ? 'Último ingreso' : 'Último gasto'}
      >
        {lastTransaction ? (
          <div className="list-group list-group-flush">
            <TransactionListItem transaction={lastTransaction} />
          </div>
        ) : (
          <EmptyState
            icon="bi-receipt"
            title={lastTxnKind === 'income' ? 'Sin ingresos registrados' : 'Sin gastos registrados'}
          />
        )}
      </BottomSheet>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="small text-secondary text-capitalize">{formatPeriodDisplay(period)}</span>
        <span className={`small fw-medium ${monthSummary.balance >= 0 ? 'text-success' : 'text-danger'}`}>
          Balance del mes: <MaskedAmount value={monthSummary.balance} />
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
                <MaskedAmount
                  value={dueThisPeriod.reduce((sum, d) => sum + (d.occurrence.actualAmount ?? d.fixedExpense.expectedAmount), 0)}
                />
              </div>
            </div>
            <i className="bi bi-chevron-right text-secondary" />
          </div>
        </Link>
      )}

      {dueInstallments.length > 0 && (
        <Link to="/mas/tarjetas" className="card mb-3 text-decoration-none text-body">
          <div className="card-body d-flex align-items-center gap-3">
            <i className="bi bi-credit-card text-primary fs-4" />
            <div className="flex-fill">
              <div className="fw-medium">Cuotas por vencer</div>
              <div className="small text-secondary">
                {dueInstallments.length} pendiente{dueInstallments.length > 1 ? 's' : ''} ·{' '}
                <MaskedAmount value={dueInstallments.reduce((sum, i) => sum + i.amount, 0)} />
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
                <span className="fw-medium">
                  <MaskedAmount value={total} />
                </span>
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
