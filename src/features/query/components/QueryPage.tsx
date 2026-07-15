import { useMemo, useState } from 'react';
import { useTransactions } from '../../transactions/hooks/useTransactions';
import { applyFilters, summarize, type QueryFilters } from '../logic/queryEngine';
import { FilterPanel } from './FilterPanel';
import { ResultsSummary } from './ResultsSummary';
import { ResultsTable } from './ResultsTable';

export function QueryPage() {
  const transactions = useTransactions();
  const [filters, setFilters] = useState<QueryFilters>({});

  const filtered = useMemo(() => applyFilters(transactions, filters), [transactions, filters]);
  const summary = useMemo(() => summarize(filtered), [filtered]);

  return (
    <div>
      <FilterPanel filters={filters} onChange={setFilters} />
      <ResultsSummary summary={summary} />
      <ResultsTable transactions={filtered} />
    </div>
  );
}
