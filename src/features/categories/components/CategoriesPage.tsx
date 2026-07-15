import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { CategoryForm } from './CategoryForm';

export function CategoriesPage() {
  const categories = useCategories();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Categorías</h1>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setFormOpen(true)}>
          <i className="bi bi-plus-lg" /> Nueva
        </button>
      </div>

      {categories.length === 0 ? (
        <EmptyState icon="bi-tags" title="Todavía no tenés categorías" />
      ) : (
        <div className="row row-cols-3 g-2">
          {categories.map((category) => (
            <div className="col" key={category.id}>
              <div className="card h-100">
                <div className="card-body d-flex flex-column align-items-center gap-1 py-3">
                  <i className={`bi ${category.icon} fs-4`} style={{ color: category.color }} />
                  <span className="small text-truncate w-100 text-center">{category.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomSheet open={formOpen} onClose={() => setFormOpen(false)} title="Nueva categoría">
        <CategoryForm onDone={() => setFormOpen(false)} />
      </BottomSheet>
    </div>
  );
}
