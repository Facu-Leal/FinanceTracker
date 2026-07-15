import { formatCurrency, parseAmountToCents } from '../utils/currency';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

/**
 * Large, thumb-friendly amount entry. Deliberately not built on Bootstrap's .input-group —
 * that component's padding/line-height assumes normal-sized text, and looks broken next to a
 * ~2.5rem (fs-1) number. Plain flex + a bottom border gives a clean "big number field" look
 * and keeps a visible input affordance (borderless alone reads as static text, not a field).
 *
 * Accepts digits plus a single "." or "," (either can mean thousands-grouping or a decimal
 * point — see parseAmountToCents for how that's resolved) and shows a live "= $X" preview so a
 * misread separator is caught before saving, not after.
 */
export function AmountInput({ value, onChange, autoFocus }: AmountInputProps) {
  const preview = value ? formatCurrency(parseAmountToCents(value)) : null;

  return (
    <div className="text-center my-3">
      <div className="d-flex align-items-baseline justify-content-center gap-1">
        <span className="fs-2 fw-semibold text-secondary">$</span>
        <input
          type="text"
          inputMode="decimal"
          autoFocus={autoFocus}
          className="amount-input-field fs-1 fw-semibold text-center"
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.,]/g, ''))}
        />
      </div>
      <div className="small text-secondary mt-1" style={{ minHeight: '1.1em' }}>
        {preview ? `= ${preview}` : ' '}
      </div>
    </div>
  );
}
