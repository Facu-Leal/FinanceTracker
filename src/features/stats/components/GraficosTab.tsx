import { useAccounts } from '../../accounts/hooks/useAccounts';
import { useCategories } from '../../categories/hooks/useCategories';
import { useTransactions } from '../../transactions/hooks/useTransactions';
import {
  accountTotals,
  balanceHistory,
  categoryTotals,
  categoryUsageCounts,
  dailyAverageExpense,
  monthlyAverageExpense,
  monthlyEvolution,
  paymentMethodTotals,
  topExpenses,
  totalExpenseSinceStart,
} from '../logic/statsAggregations';
import { StatsSummaryTiles } from './StatsSummaryTiles';
import { IncomeVsExpenseTrendChart } from './IncomeVsExpenseTrendChart';
import { BalanceHistoryChart } from './BalanceHistoryChart';
import { RankedBarChart } from './RankedBarChart';
import { TopExpensesList } from './TopExpensesList';
import { EmptyState } from '../../../shared/ui/EmptyState';

export function GraficosTab() {
  const accounts = useAccounts(true);
  const categories = useCategories();
  const transactions = useTransactions();

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon="bi-bar-chart"
        title="Todavía no hay datos"
        description="Registrá algunos movimientos para ver tus estadísticas."
      />
    );
  }

  return (
    <div>
      <StatsSummaryTiles
        totalExpense={totalExpenseSinceStart(transactions)}
        dailyAverage={dailyAverageExpense(transactions)}
        monthlyAverage={monthlyAverageExpense(transactions)}
      />
      <IncomeVsExpenseTrendChart data={monthlyEvolution(transactions)} />
      <BalanceHistoryChart data={balanceHistory(accounts, transactions)} />
      <RankedBarChart title="Gastos por categoría" icon="bi-tags" data={categoryTotals(transactions, categories)} />
      <RankedBarChart title="Gastos por cuenta" icon="bi-wallet2" data={accountTotals(transactions, accounts)} />
      <RankedBarChart
        title="Gastos por método de pago"
        icon="bi-credit-card-2-front"
        data={paymentMethodTotals(transactions)}
      />
      <RankedBarChart
        title="Categorías más usadas"
        icon="bi-star"
        data={categoryUsageCounts(transactions, categories)}
        valueLabel={(v) => `${v}`}
      />
      <TopExpensesList transactions={topExpenses(transactions)} />
    </div>
  );
}
