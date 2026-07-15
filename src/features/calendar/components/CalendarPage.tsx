import { useState } from 'react';
import { useTransactions } from '../../transactions/hooks/useTransactions';
import { CalendarMonthGrid } from './CalendarMonthGrid';
import { DayTransactionsList } from './DayTransactionsList';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { addMonths, currentPeriod, formatDateDisplay, formatPeriodDisplay } from '../../../shared/utils/dateUtils';

export function CalendarPage() {
  const [period, setPeriod] = useState(currentPeriod());
  const [selectedDate, setSelectedDate] = useState<string>();
  const transactions = useTransactions();

  const dayTransactions = selectedDate ? transactions.filter((t) => t.date === selectedDate) : [];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          aria-label="Mes anterior"
          onClick={() => setPeriod(addMonths(`${period}-01`, -1).slice(0, 7))}
        >
          <i className="bi bi-chevron-left" />
        </button>
        <h1 className="h5 mb-0 text-capitalize">{formatPeriodDisplay(period)}</h1>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          aria-label="Mes siguiente"
          onClick={() => setPeriod(addMonths(`${period}-01`, 1).slice(0, 7))}
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <CalendarMonthGrid period={period} transactions={transactions} onSelectDay={setSelectedDate} />
        </div>
      </div>

      <BottomSheet
        open={Boolean(selectedDate)}
        onClose={() => setSelectedDate(undefined)}
        title={selectedDate ? formatDateDisplay(selectedDate) : undefined}
      >
        <DayTransactionsList transactions={dayTransactions} />
      </BottomSheet>
    </div>
  );
}
