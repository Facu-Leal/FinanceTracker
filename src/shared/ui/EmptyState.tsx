interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <i className={`bi ${icon} d-block mb-2`} />
      <p className="fw-medium mb-1">{title}</p>
      {description && <p className="small mb-0">{description}</p>}
    </div>
  );
}
