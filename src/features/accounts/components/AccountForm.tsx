import { useState } from 'react';
import { createAccount, updateAccount, adjustAccountBalance } from '../../../db/repositories/accounts.repo';
import { parseAmountToCents } from '../../../shared/utils/currency';
import type { Account } from '../../../db/types';

const TYPE_OPTIONS: Array<{ value: 'cash' | 'bank' | 'wallet'; label: string; icon: string }> = [
  { value: 'cash', label: 'Efectivo', icon: 'bi-cash' },
  { value: 'bank', label: 'Banco', icon: 'bi-bank' },
  { value: 'wallet', label: 'Billetera virtual', icon: 'bi-phone' },
];

interface AccountFormProps {
  /** When set, edits this account (including its balance) instead of creating a new one. */
  account?: Account;
  onDone: () => void;
}

export function AccountForm({ account, onDone }: AccountFormProps) {
  const [name, setName] = useState(account?.name ?? '');
  const [type, setType] = useState<'cash' | 'bank' | 'wallet'>(account?.type ?? 'bank');
  const [balance, setBalance] = useState(account ? String(account.currentBalance / 100) : '');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);

    if (account) {
      await updateAccount(account.id, {
        name: name.trim(),
        type,
        icon: TYPE_OPTIONS.find((t) => t.value === type)?.icon,
      });
      const newBalance = parseAmountToCents(balance || '0');
      if (newBalance !== account.currentBalance) {
        await adjustAccountBalance(account.id, newBalance);
      }
    } else {
      await createAccount({
        name: name.trim(),
        type,
        initialBalance: parseAmountToCents(balance || '0'),
        icon: TYPE_OPTIONS.find((t) => t.value === type)?.icon,
      });
    }

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
        <label className="form-label small text-secondary">{account ? 'Saldo actual' : 'Saldo inicial'}</label>
        <input
          className="form-control"
          inputMode="decimal"
          placeholder="0"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />
        {account && (
          <div className="form-text">Corrige el saldo directamente, sin crear un movimiento nuevo.</div>
        )}
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={!name.trim() || submitting}>
        Guardar
      </button>
    </form>
  );
}
