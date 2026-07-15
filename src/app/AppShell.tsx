import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { BottomSheet } from '../shared/ui/BottomSheet';
import { IosInstallPrompt } from '../shared/ui/IosInstallPrompt';
import { TransactionForm } from '../features/transactions/components/TransactionForm';

export function AppShell() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="app-content">
        <div className="app-content-inner">
          <Outlet />
        </div>
      </div>

      <BottomNav onAddClick={() => setAddOpen(true)} />
      <IosInstallPrompt />

      <BottomSheet open={addOpen} onClose={() => setAddOpen(false)} title="Nuevo movimiento">
        <TransactionForm onDone={() => setAddOpen(false)} />
      </BottomSheet>
    </div>
  );
}
