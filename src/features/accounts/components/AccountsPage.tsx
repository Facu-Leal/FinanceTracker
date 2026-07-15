import { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { AccountForm } from './AccountForm';
import { AccountListItem } from './AccountListItem';

export function AccountsPage() {
  const accounts = useAccounts();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Cuentas</h1>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setFormOpen(true)}>
          <i className="bi bi-plus-lg" /> Nueva
        </button>
      </div>

      {accounts.length === 0 ? (
        <EmptyState icon="bi-wallet2" title="Todavía no tenés cuentas" description="Agregá tu primera cuenta para empezar a registrar movimientos." />
      ) : (
        <div className="d-flex flex-column gap-2">
          {accounts.map((account) => (
            <AccountListItem key={account.id} account={account} />
          ))}
        </div>
      )}

      <BottomSheet open={formOpen} onClose={() => setFormOpen(false)} title="Nueva cuenta">
        <AccountForm onDone={() => setFormOpen(false)} />
      </BottomSheet>
    </div>
  );
}
