import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { DashboardPage } from '../features/dashboard/components/DashboardPage';
import { TransactionsListPage } from '../features/transactions/components/TransactionsListPage';
import { AccountsPage } from '../features/accounts/components/AccountsPage';
import { CategoriesPage } from '../features/categories/components/CategoriesPage';
import { MorePage } from '../features/more/components/MorePage';
import { PlaceholderPage } from '../shared/ui/PlaceholderPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'movimientos', element: <TransactionsListPage /> },
      { path: 'estadisticas', element: <PlaceholderPage title="Estadísticas" icon="bi-bar-chart" /> },
      { path: 'mas', element: <MorePage /> },
      { path: 'mas/cuentas', element: <AccountsPage /> },
      { path: 'mas/categorias', element: <CategoriesPage /> },
      { path: 'mas/presupuestos', element: <PlaceholderPage title="Presupuestos" icon="bi-piggy-bank" /> },
      { path: 'mas/tarjetas', element: <PlaceholderPage title="Tarjetas y Cuotas" icon="bi-credit-card" /> },
      { path: 'mas/gastos-fijos', element: <PlaceholderPage title="Gastos Fijos" icon="bi-calendar-check" /> },
      { path: 'mas/respaldos', element: <PlaceholderPage title="Respaldos" icon="bi-cloud-arrow-down" /> },
      { path: 'mas/configuracion', element: <PlaceholderPage title="Configuración" icon="bi-gear" /> },
    ],
  },
]);
