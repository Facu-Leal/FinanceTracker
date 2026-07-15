import { useState } from 'react';
import { QueryPage } from '../../query/components/QueryPage';
import { EmptyState } from '../../../shared/ui/EmptyState';

type Tab = 'consultas' | 'graficos';

export function StatsPage() {
  const [tab, setTab] = useState<Tab>('consultas');

  return (
    <div>
      <h1 className="h4 mb-3">Estadísticas</h1>

      <div className="btn-group w-100 mb-3">
        <button
          type="button"
          className={`btn ${tab === 'consultas' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setTab('consultas')}
        >
          Consultas
        </button>
        <button
          type="button"
          className={`btn ${tab === 'graficos' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setTab('graficos')}
        >
          Gráficos
        </button>
      </div>

      {tab === 'consultas' ? (
        <QueryPage />
      ) : (
        <EmptyState
          icon="bi-bar-chart"
          title="Próximamente"
          description="Los gráficos se implementan en la fase siguiente del roadmap."
        />
      )}
    </div>
  );
}
