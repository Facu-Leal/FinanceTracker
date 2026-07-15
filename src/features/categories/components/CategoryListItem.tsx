import { useState } from 'react';
import type { Category } from '../../../db/types';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';
import { removeCategory } from '../../../db/repositories/categories.repo';

interface CategoryListItemProps {
  category: Category;
}

export function CategoryListItem({ category }: CategoryListItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="card h-100 w-100 border-0 bg-transparent p-0"
        onClick={() => setConfirmOpen(true)}
      >
        <div className="card-body d-flex flex-column align-items-center gap-1 py-3">
          <i className={`bi ${category.icon} fs-4`} style={{ color: category.color }} />
          <span className="small text-truncate w-100 text-center">{category.name}</span>
        </div>
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar categoría"
        description={`"${category.name}" — si tiene movimientos asociados, se archivará en vez de borrarse para no perder el historial.`}
        confirmLabel="Eliminar"
        danger
        onConfirm={async () => {
          await removeCategory(category.id);
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
