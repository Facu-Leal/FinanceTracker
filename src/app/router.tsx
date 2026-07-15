import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { DashboardPage } from '../features/dashboard/components/DashboardPage';
import { TransactionsListPage } from '../features/transactions/components/TransactionsListPage';
import { AccountsPage } from '../features/accounts/components/AccountsPage';
import { CategoriesPage } from '../features/categories/components/CategoriesPage';
import { BudgetsPage } from '../features/budgets/components/BudgetsPage';
import { FixedExpensesPage } from '../features/fixed-expenses/components/FixedExpensesPage';
import { InstallmentPurchasesPage } from '../features/credit-cards/components/InstallmentPurchasesPage';
import { SettingsPage } from '../features/settings/components/SettingsPage';
import { MorePage } from '../features/more/components/MorePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'movimientos', element: <TransactionsListPage /> },
      {
        // Recharts is a heavy dependency only this route needs — code-split it.
        path: 'estadisticas',
        lazy: () => import('../features/stats/components/StatsPage').then((m) => ({ Component: m.StatsPage })),
      },
      { path: 'mas', element: <MorePage /> },
      { path: 'mas/cuentas', element: <AccountsPage /> },
      { path: 'mas/categorias', element: <CategoriesPage /> },
      { path: 'mas/presupuestos', element: <BudgetsPage /> },
      { path: 'mas/tarjetas', element: <InstallmentPurchasesPage /> },
      { path: 'mas/gastos-fijos', element: <FixedExpensesPage /> },
      {
        // Zod's validation schemas only matter here — code-split it.
        path: 'mas/respaldos',
        lazy: () => import('../features/backups/components/BackupsPage').then((m) => ({ Component: m.BackupsPage })),
      },
      { path: 'mas/configuracion', element: <SettingsPage /> },
    ],
  },
]);
