import { useState } from 'react';
import type { Transaction } from '../../../db/types';
import { useCategories } from '../../categories/hooks/useCategories';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { formatCurrency } from '../../../shared/utils/currency';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';
import { deleteTransaction } from '../../../db/repositories/transactions.repo';

interface TransactionListItemProps {
  transaction: Transaction;
}

export function TransactionListItem({ transaction }: TransactionListItemProps) {
  const categories = useCategories();
  const accounts = useAccounts(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const category = categories.find((c) => c.id === transaction.categoryId);
  const toAccount = transaction.toAccountId ? accounts.find((a) => a.id === transaction.toAccountId) : undefined;

  const icon = transaction.type === 'transfer' ? 'bi-arrow-left-right' : (category?.icon ?? 'bi-receipt');
  const color = transaction.type === 'transfer' ? undefined : category?.color;
  const sign = transaction.type === 'expense' ? '-' : transaction.type === 'income' ? '+' : '';
  const amountClass =
    transaction.type === 'expense' ? 'text-danger' : transaction.type === 'income' ? 'text-success' : '';

  return (
    <>
      <button
        type="button"
        className="list-group-item list-group-item-action d-flex align-items-center gap-3 py-2 border-0 border-bottom"
        onClick={() => setConfirmOpen(true)}
      >
        <i className={`bi ${icon} fs-5`} style={{ color }} />
        <div className="flex-fill text-start overflow-hidden">
          <div className="text-truncate">{transaction.description}</div>
          <div className="small text-secondary text-truncate">
            {transaction.type === 'transfer' ? `Transferencia a ${toAccount?.name ?? '—'}` : category?.name ?? 'Sin categoría'}
          </div>
        </div>
        <div className={`fw-semibold ${amountClass}`}>
          {sign}
          {formatCurrency(transaction.amount)}
        </div>
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar movimiento"
        description={`"${transaction.description}" — ${formatCurrency(transaction.amount)}`}
        confirmLabel="Eliminar"
        danger
        onConfirm={async () => {
          await deleteTransaction(transaction.id);
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
