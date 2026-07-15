import { formatCurrency, parseAmountToCents } from '../utils/currency';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

/**
 * Large, thumb-friendly amount entry. Accepts digits plus a single "." or "," (either can mean
 * thousands-grouping or a decimal point — see parseAmountToCents for how that's resolved) and
 * shows a live "= $X" preview so a misread separator is caught before saving, not after.
 */
export function AmountInput({ value, onChange, autoFocus }: AmountInputProps) {
  const preview = value ? formatCurrency(parseAmountToCents(value)) : null;

  return (
    <div className="text-center my-3">
      <div className="input-group input-group-lg justify-content-center">
        <span className="input-group-text bg-transparent border-0 fs-2 fw-semibold">$</span>
        <input
          type="text"
          inputMode="decimal"
          autoFocus={autoFocus}
          className="form-control border-0 bg-transparent fs-1 fw-semibold text-center p-0"
          style={{ maxWidth: '12rem' }}
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.,]/g, ''))}
        />
      </div>
      {preview && <div className="small text-secondary">= {preview}</div>}
    </div>
  );
}
