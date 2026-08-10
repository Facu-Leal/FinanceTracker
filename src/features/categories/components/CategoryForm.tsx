import { useState } from 'react';
import type { Category } from '../../../db/types';
import { createCategory, removeCategory, updateCategory } from '../../../db/repositories/categories.repo';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';

const ICONS = [
  // Compras y hogar
  'bi-cart', 'bi-bag', 'bi-basket3', 'bi-cup-hot', 'bi-house-door', 'bi-key', 'bi-tools', 'bi-wrench',
  'bi-lightning-charge', 'bi-droplet', 'bi-wifi', 'bi-router', 'bi-phone', 'bi-tv',
  // Dinero
  'bi-cash-stack', 'bi-wallet2', 'bi-piggy-bank', 'bi-credit-card', 'bi-bank', 'bi-cash-coin',
  'bi-currency-dollar', 'bi-currency-exchange', 'bi-receipt',
  // Transporte
  'bi-car-front', 'bi-fuel-pump', 'bi-bus-front', 'bi-bicycle', 'bi-scooter', 'bi-taxi-front', 'bi-train-front',
  // Viajes
  'bi-airplane', 'bi-luggage', 'bi-globe', 'bi-compass',
  // Educación
  'bi-mortarboard', 'bi-book', 'bi-backpack', 'bi-pencil', 'bi-journal-text', 'bi-easel', 'bi-laptop',
  // Salud
  'bi-heart-pulse', 'bi-hospital', 'bi-capsule', 'bi-bandaid', 'bi-thermometer', 'bi-heart',
  // Ocio
  'bi-controller', 'bi-joystick', 'bi-film', 'bi-music-note', 'bi-dice-5', 'bi-palette', 'bi-camera',
  'bi-headphones',
  // Personas y ocasiones
  'bi-people', 'bi-person-heart', 'bi-gift', 'bi-balloon', 'bi-cake', 'bi-briefcase', 'bi-umbrella',
  // General
  'bi-tag', 'bi-star', 'bi-trophy', 'bi-puzzle', 'bi-calendar-check', 'bi-three-dots',
];
const COLORS = ['#0d6efd', '#fd7e14', '#ffc107', '#dc3545', '#6f42c1', '#20c997', '#198754', '#6c757d'];

interface CategoryFormProps {
  category?: Category;
  onDone: () => void;
}

export function CategoryForm({ category, onDone }: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? '');
  const [kind, setKind] = useState<'income' | 'expense' | 'both'>(category?.kind ?? 'expense');
  const [icon, setIcon] = useState(category?.icon ?? ICONS[0]!);
  const [color, setColor] = useState(category?.color ?? COLORS[0]!);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    if (category) {
      await updateCategory(category.id, { name: name.trim(), icon, color, kind });
    } else {
      await createCategory({ name: name.trim(), icon, color, kind });
    }
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

      {category && (
        <button
          type="button"
          className="btn btn-outline-danger w-100 mt-2"
          onClick={() => setConfirmDeleteOpen(true)}
        >
          Eliminar categoría
        </button>
      )}

      {category && (
        <ConfirmDialog
          open={confirmDeleteOpen}
          title="Eliminar categoría"
          description={`"${category.name}" — si tiene movimientos asociados, se archivará en vez de borrarse para no perder el historial.`}
          confirmLabel="Eliminar"
          danger
          onConfirm={async () => {
            await removeCategory(category.id);
            setConfirmDeleteOpen(false);
            onDone();
          }}
          onCancel={() => setConfirmDeleteOpen(false)}
        />
      )}
    </form>
  );
}
