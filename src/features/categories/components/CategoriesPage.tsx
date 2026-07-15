import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { CategoryForm } from './CategoryForm';
import { CategoryListItem } from './CategoryListItem';

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
              <CategoryListItem category={category} />
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
