import { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { AccountForm } from './AccountForm';
import { formatCurrency } from '../../../shared/utils/currency';

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
            <div className="card" key={account.id}>
              <div className="card-body d-flex align-items-center gap-3">
                <i className={`bi ${account.icon ?? 'bi-wallet2'} fs-4 text-primary`} />
                <div className="flex-fill">
                  <div className="fw-medium">{account.name}</div>
                  <div className="small text-secondary text-capitalize">{account.type}</div>
                </div>
                <div className="fw-semibold">{formatCurrency(account.currentBalance)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomSheet open={formOpen} onClose={() => setFormOpen(false)} title="Nueva cuenta">
        <AccountForm onDone={() => setFormOpen(false)} />
      </BottomSheet>
    </div>
  );
}
