interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

/** Large, thumb-friendly numeric amount entry — whole currency units, comma as decimal separator. */
export function AmountInput({ value, onChange, autoFocus }: AmountInputProps) {
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
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^0-9,.]/g, '');
            onChange(cleaned);
          }}
        />
      </div>
    </div>
  );
}
