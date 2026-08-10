import type { Category } from '../../../db/types';

interface CategoryListItemProps {
  category: Category;
  onClick: () => void;
}

export function CategoryListItem({ category, onClick }: CategoryListItemProps) {
  return (
    <button type="button" className="card h-100 w-100 border-0 bg-transparent p-0" onClick={onClick}>
      <div className="card-body d-flex flex-column align-items-center gap-1 py-3">
        <i className={`bi ${category.icon} fs-4`} style={{ color: category.color }} />
        <span className="small text-truncate w-100 text-center">{category.name}</span>
      </div>
    </button>
  );
}
