import { useState } from 'react';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { useCategories } from '../hooks/useCategories';
import type { Category } from '../../../db/types';

interface CategoryPickerProps {
  kind?: Category['kind'];
  value?: string;
  onChange: (categoryId: string) => void;
}

export function CategoryPicker({ kind, value, onChange }: CategoryPickerProps) {
  const categories = useCategories(kind);
  const [open, setOpen] = useState(false);
  const selected = categories.find((c) => c.id === value);

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-secondary w-100 d-flex align-items-center gap-2 text-start"
        onClick={() => setOpen(true)}
      >
        {selected ? (
          <>
            <i className={`bi ${selected.icon}`} style={{ color: selected.color }} />
            <span>{selected.name}</span>
          </>
        ) : (
          <span className="text-secondary">Elegir categoría</span>
        )}
        <i className="bi bi-chevron-down ms-auto small" />
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Categoría">
        {categories.length === 0 ? (
          <p className="text-secondary text-center py-3">
            No hay categorías todavía. Creá una desde Más &gt; Categorías.
          </p>
        ) : (
          <div className="row row-cols-3 g-2">
            {categories.map((category) => (
              <div className="col" key={category.id}>
                <button
                  type="button"
                  className={`btn w-100 h-100 d-flex flex-column align-items-center gap-1 py-3 ${
                    value === category.id ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  onClick={() => {
                    onChange(category.id);
                    setOpen(false);
                  }}
                >
                  <i
                    className={`bi ${category.icon} fs-4`}
                    style={{ color: value === category.id ? undefined : category.color }}
                  />
                  <span className="small text-truncate w-100">{category.name}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </BottomSheet>
    </>
  );
}
