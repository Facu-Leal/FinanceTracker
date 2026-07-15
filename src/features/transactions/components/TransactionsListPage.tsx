import { useTransactions } from '../hooks/useTransactions';
import { TransactionListItem } from './TransactionListItem';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { formatDateDisplay } from '../../../shared/utils/dateUtils';

export function TransactionsListPage() {
  const transactions = useTransactions();

  const groups = new Map<string, typeof transactions>();
  for (const txn of transactions) {
    const list = groups.get(txn.date) ?? [];
    list.push(txn);
    groups.set(txn.date, list);
  }

  return (
    <div>
      <h1 className="h4 mb-3">Movimientos</h1>

      {transactions.length === 0 ? (
        <EmptyState
          icon="bi-receipt"
          title="Todavía no hay movimientos"
          description="Tocá el botón + para registrar tu primer ingreso o gasto."
        />
      ) : (
        Array.from(groups.entries()).map(([date, txns]) => (
          <div key={date} className="mb-3">
            <div className="small text-secondary fw-medium mb-1">{formatDateDisplay(date)}</div>
            <div className="list-group list-group-flush card">
              {txns.map((txn) => (
                <TransactionListItem key={txn.id} transaction={txn} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
