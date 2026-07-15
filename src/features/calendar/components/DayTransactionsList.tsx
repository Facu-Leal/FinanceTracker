import type { Transaction } from '../../../db/types';
import { TransactionListItem } from '../../transactions/components/TransactionListItem';

interface DayTransactionsListProps {
  transactions: Transaction[];
}

export function DayTransactionsList({ transactions }: DayTransactionsListProps) {
  return (
    <div className="list-group list-group-flush">
      {transactions.map((txn) => (
        <TransactionListItem key={txn.id} transaction={txn} />
      ))}
    </div>
  );
}
