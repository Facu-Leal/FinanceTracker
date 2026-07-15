import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { BottomSheet } from '../shared/ui/BottomSheet';
import { IosInstallPrompt } from '../shared/ui/IosInstallPrompt';
import { UpdatePrompt } from '../shared/ui/UpdatePrompt';
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

      <div
        className="position-fixed start-0 end-0 mx-3 d-flex flex-column gap-2"
        style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))', zIndex: 1020 }}
      >
        <UpdatePrompt />
        <IosInstallPrompt />
      </div>

      <BottomSheet open={addOpen} onClose={() => setAddOpen(false)} title="Nuevo movimiento">
        <TransactionForm onDone={() => setAddOpen(false)} />
      </BottomSheet>
    </div>
  );
}
