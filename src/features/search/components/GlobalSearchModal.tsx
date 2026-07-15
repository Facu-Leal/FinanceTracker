import { useState } from 'react';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { useTransactions } from '../../transactions/hooks/useTransactions';
import { useCategories } from '../../categories/hooks/useCategories';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { TransactionListItem } from '../../transactions/components/TransactionListItem';
import { searchTransactions } from '../logic/search';

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ open, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const transactions = useTransactions();
  const categories = useCategories();
  const accounts = useAccounts(true);

  const results = query.trim() ? searchTransactions(transactions, categories, accounts, query) : [];

  return (
    <BottomSheet open={open} onClose={onClose} title="Buscar">
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Descripción, categoría, cuenta, monto, fecha, etiqueta..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      {query.trim() === '' ? (
        <p className="small text-secondary text-center">Escribí para buscar en todos tus movimientos.</p>
      ) : results.length === 0 ? (
        <EmptyState icon="bi-search" title="Sin resultados" />
      ) : (
        <div className="list-group list-group-flush">
          {results.map((txn) => (
            <TransactionListItem key={txn.id} transaction={txn} />
          ))}
        </div>
      )}
    </BottomSheet>
  );
}
