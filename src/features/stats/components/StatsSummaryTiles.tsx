import { formatCurrency } from '../../../shared/utils/currency';

interface StatsSummaryTilesProps {
  totalExpense: number;
  dailyAverage: number;
  monthlyAverage: number;
}

/** Single current values — stat tiles, not one-bar charts (per the dataviz form guidance). */
export function StatsSummaryTiles({ totalExpense, dailyAverage, monthlyAverage }: StatsSummaryTilesProps) {
  const tiles = [
    { label: 'Gastado desde el inicio', value: totalExpense },
    { label: 'Promedio diario', value: dailyAverage },
    { label: 'Promedio mensual', value: monthlyAverage },
  ];

  return (
    <div className="row row-cols-3 g-2 mb-3">
      {tiles.map((tile) => (
        <div className="col" key={tile.label}>
          <div className="card h-100">
            <div className="card-body p-2 text-center">
              <div className="small text-secondary" style={{ fontSize: '0.7rem' }}>
                {tile.label}
              </div>
              <div className="fw-semibold" style={{ fontSize: '0.95rem' }}>
                {formatCurrency(tile.value)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
