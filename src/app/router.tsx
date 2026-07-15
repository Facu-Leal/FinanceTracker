import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { DashboardPage } from '../features/dashboard/components/DashboardPage';
import { TransactionsListPage } from '../features/transactions/components/TransactionsListPage';
import { AccountsPage } from '../features/accounts/components/AccountsPage';
import { CategoriesPage } from '../features/categories/components/CategoriesPage';
import { BudgetsPage } from '../features/budgets/components/BudgetsPage';
import { FixedExpensesPage } from '../features/fixed-expenses/components/FixedExpensesPage';
import { InstallmentPurchasesPage } from '../features/credit-cards/components/InstallmentPurchasesPage';
import { StatsPage } from '../features/stats/components/StatsPage';
import { MorePage } from '../features/more/components/MorePage';
import { PlaceholderPage } from '../shared/ui/PlaceholderPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'movimientos', element: <TransactionsListPage /> },
      { path: 'estadisticas', element: <StatsPage /> },
      { path: 'mas', element: <MorePage /> },
      { path: 'mas/cuentas', element: <AccountsPage /> },
      { path: 'mas/categorias', element: <CategoriesPage /> },
      { path: 'mas/presupuestos', element: <BudgetsPage /> },
      { path: 'mas/tarjetas', element: <InstallmentPurchasesPage /> },
      { path: 'mas/gastos-fijos', element: <FixedExpensesPage /> },
      { path: 'mas/respaldos', element: <PlaceholderPage title="Respaldos" icon="bi-cloud-arrow-down" /> },
      { path: 'mas/configuracion', element: <PlaceholderPage title="Configuración" icon="bi-gear" /> },
    ],
  },
]);
