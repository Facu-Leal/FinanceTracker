import type { BudgetStatus } from '../../features/budgets/logic/thresholds';

interface BudgetProgressBarProps {
  spent: number;
  limit: number;
  status: BudgetStatus;
}

const STATUS_CLASS: Record<BudgetStatus, string> = {
  ok: 'bg-primary',
  warning: 'bg-warning',
  over: 'bg-danger',
};

export function BudgetProgressBar({ spent, limit, status }: BudgetProgressBarProps) {
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  return (
    <div className="progress" style={{ height: '0.5rem' }}>
      <div
        className={`progress-bar ${STATUS_CLASS[status]}`}
        role="progressbar"
        style={{ width: `${pct}%` }}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
