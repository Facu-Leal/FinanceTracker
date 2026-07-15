import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionListItem } from './TransactionListItem';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { formatDateDisplay } from '../../../shared/utils/dateUtils';
import { CalendarPage } from '../../calendar/components/CalendarPage';

type View = 'list' | 'calendar';

export function TransactionsListPage() {
  const [view, setView] = useState<View>('list');
  const transactions = useTransactions();

  const groups = new Map<string, typeof transactions>();
  for (const txn of transactions) {
    const list = groups.get(txn.date) ?? [];
    list.push(txn);
    groups.set(txn.date, list);
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Movimientos</h1>
        <div className="btn-group">
          <button
            type="button"
            className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
            aria-label="Ver como lista"
            onClick={() => setView('list')}
          >
            <i className="bi bi-list-ul" />
          </button>
          <button
            type="button"
            className={`btn btn-sm ${view === 'calendar' ? 'btn-primary' : 'btn-outline-secondary'}`}
            aria-label="Ver como calendario"
            onClick={() => setView('calendar')}
          >
            <i className="bi bi-calendar3" />
          </button>
        </div>
      </div>

      {view === 'calendar' ? (
        <CalendarPage />
      ) : transactions.length === 0 ? (
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
