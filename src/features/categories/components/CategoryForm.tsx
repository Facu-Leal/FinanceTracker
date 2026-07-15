import { useState } from 'react';
import { createCategory } from '../../../db/repositories/categories.repo';

const ICONS = [
  'bi-cart', 'bi-bus-front', 'bi-lightning-charge', 'bi-heart-pulse', 'bi-controller',
  'bi-laptop', 'bi-cash-stack', 'bi-house', 'bi-cup-hot', 'bi-airplane', 'bi-fuel-pump', 'bi-three-dots',
];
const COLORS = ['#0d6efd', '#fd7e14', '#ffc107', '#dc3545', '#6f42c1', '#20c997', '#198754', '#6c757d'];

interface CategoryFormProps {
  onDone: () => void;
}

export function CategoryForm({ onDone }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [kind, setKind] = useState<'income' | 'expense' | 'both'>('expense');
  const [icon, setIcon] = useState(ICONS[0]!);
  const [color, setColor] = useState(COLORS[0]!);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    await createCategory({ name: name.trim(), icon, color, kind });
    setSubmitting(false);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label small text-secondary">Nombre</label>
        <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </div>

      <div className="mb-3">
        <label className="form-label small text-secondary">Tipo</label>
        <div className="btn-group w-100">
          {(['expense', 'income', 'both'] as const).map((k) => (
            <button
              key={k}
              type="button"
              className={`btn ${kind === k ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setKind(k)}
            >
              {k === 'expense' ? 'Gasto' : k === 'income' ? 'Ingreso' : 'Ambos'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label small text-secondary">Ícono</label>
        <div className="d-flex flex-wrap gap-2">
          {ICONS.map((i) => (
            <button
              key={i}
              type="button"
              className={`btn ${icon === i ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setIcon(i)}
            >
              <i className={`bi ${i}`} style={{ color: icon === i ? undefined : color }} />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label small text-secondary">Color</label>
        <div className="d-flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className="btn p-0 rounded-circle"
              style={{
                width: '2rem',
                height: '2rem',
                backgroundColor: c,
                border: color === c ? '3px solid var(--bs-body-color)' : 'none',
              }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={!name.trim() || submitting}>
        Guardar
      </button>
    </form>
  );
}
