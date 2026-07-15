import type { Transaction } from '../../../db/types';
import { TransactionListItem } from '../../transactions/components/TransactionListItem';
import { EmptyState } from '../../../shared/ui/EmptyState';

interface ResultsTableProps {
  transactions: Transaction[];
}

export function ResultsTable({ transactions }: ResultsTableProps) {
  if (transactions.length === 0) {
    return <EmptyState icon="bi-search" title="Sin resultados" description="Probá ajustar los filtros." />;
  }

  return (
    <div className="list-group list-group-flush card">
      {transactions.map((txn) => (
        <TransactionListItem key={txn.id} transaction={txn} />
      ))}
    </div>
  );
}
