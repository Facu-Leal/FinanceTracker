import { EmptyState } from './EmptyState';

interface PlaceholderPageProps {
  title: string;
  icon: string;
}

/** Used for screens not yet implemented in the current roadmap phase. */
export function PlaceholderPage({ title, icon }: PlaceholderPageProps) {
  return (
    <div>
      <h1 className="h4 mb-3">{title}</h1>
      <EmptyState icon={icon} title="Próximamente" description="Esta sección se implementa en una fase siguiente del roadmap." />
    </div>
  );
}
