import { useState } from 'react';
import { createAccount } from '../../../db/repositories/accounts.repo';
import { parseAmountToCents } from '../../../shared/utils/currency';

const TYPE_OPTIONS: Array<{ value: 'cash' | 'bank' | 'wallet'; label: string; icon: string }> = [
  { value: 'cash', label: 'Efectivo', icon: 'bi-cash' },
  { value: 'bank', label: 'Banco', icon: 'bi-bank' },
  { value: 'wallet', label: 'Billetera virtual', icon: 'bi-phone' },
];

interface AccountFormProps {
  onDone: () => void;
}

export function AccountForm({ onDone }: AccountFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'cash' | 'bank' | 'wallet'>('bank');
  const [initialBalance, setInitialBalance] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    await createAccount({
      name: name.trim(),
      type,
      initialBalance: parseAmountToCents(initialBalance || '0'),
      icon: TYPE_OPTIONS.find((t) => t.value === type)?.icon,
    });
    setSubmitting(false);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label small text-secondary">Nombre</label>
        <input
          className="form-control"
          placeholder="ej. Santander, Prex, Efectivo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>

      <div className="mb-3">
        <label className="form-label small text-secondary">Tipo</label>
        <div className="d-flex gap-2">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`btn flex-fill d-flex flex-column align-items-center gap-1 py-2 ${
                type === option.value ? 'btn-primary' : 'btn-light'
              }`}
              onClick={() => setType(option.value)}
            >
              <i className={`bi ${option.icon}`} />
              <span className="small">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label small text-secondary">Saldo inicial</label>
        <input
          className="form-control"
          inputMode="decimal"
          placeholder="0"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={!name.trim() || submitting}>
        Guardar
      </button>
    </form>
  );
}
