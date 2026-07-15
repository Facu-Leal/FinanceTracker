import type { Transaction } from '../../../db/types';
import { getMonthGridDates, periodOf } from '../../../shared/utils/dateUtils';

const WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

interface CalendarMonthGridProps {
  period: string;
  transactions: Transaction[];
  onSelectDay: (date: string) => void;
}

export function CalendarMonthGrid({ period, transactions, onSelectDay }: CalendarMonthGridProps) {
  const dates = getMonthGridDates(period);

  const byDate = new Map<string, { income: number; expense: number }>();
  for (const t of transactions) {
    const bucket = byDate.get(t.date) ?? { income: 0, expense: 0 };
    if (t.type === 'income') bucket.income += t.amount;
    if (t.type === 'expense') bucket.expense += t.amount;
    byDate.set(t.date, bucket);
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center small text-secondary py-1">
            {label}
          </div>
        ))}
      </div>
      <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {dates.map((date) => {
          const inMonth = periodOf(date) === period;
          const day = Number(date.slice(8, 10));
          const bucket = byDate.get(date);
          const hasActivity = Boolean(bucket && (bucket.income > 0 || bucket.expense > 0));
          const net = bucket ? bucket.income - bucket.expense : 0;

          return (
            <button
              key={date}
              type="button"
              className="btn p-0 border-0 bg-transparent d-flex flex-column align-items-center justify-content-center"
              style={{ height: '2.75rem', opacity: inMonth ? 1 : 0.35 }}
              onClick={() => hasActivity && onSelectDay(date)}
              disabled={!hasActivity}
            >
              <span className={`small ${date === today ? 'fw-bold text-primary' : ''}`}>{day}</span>
              {hasActivity && (
                <span
                  className="rounded-circle"
                  style={{
                    width: '0.4rem',
                    height: '0.4rem',
                    backgroundColor: net >= 0 ? 'var(--bs-success)' : 'var(--bs-danger)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
