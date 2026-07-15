import { useState } from 'react';
import type { Account } from '../../../db/types';
import { formatCurrency } from '../../../shared/utils/currency';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';
import { removeAccount } from '../../../db/repositories/accounts.repo';

interface AccountListItemProps {
  account: Account;
}

export function AccountListItem({ account }: AccountListItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <div className="card">
        <div className="card-body d-flex align-items-center gap-3">
          <i className={`bi ${account.icon ?? 'bi-wallet2'} fs-4 text-primary`} />
          <div className="flex-fill">
            <div className="fw-medium">{account.name}</div>
            <div className="small text-secondary text-capitalize">{account.type}</div>
          </div>
          <div className="fw-semibold">{formatCurrency(account.currentBalance)}</div>
          <button
            type="button"
            className="btn btn-sm btn-link text-secondary p-0 ms-2"
            aria-label={`Eliminar ${account.name}`}
            onClick={() => setConfirmOpen(true)}
          >
            <i className="bi bi-trash" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar cuenta"
        description={`"${account.name}" — si tiene movimientos asociados, se archivará en vez de borrarse para no perder el historial.`}
        confirmLabel="Eliminar"
        danger
        onConfirm={async () => {
          await removeAccount(account.id);
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
