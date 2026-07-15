import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { NamedTotal } from '../logic/statsAggregations';
import { CHART_GRIDLINE, CHART_TEXT_MUTED, paletteSlot } from '../logic/chartPalette';
import { formatCurrency } from '../../../shared/utils/currency';

interface RankedBarChartProps {
  title: string;
  icon: string;
  data: NamedTotal[];
  valueLabel?: (value: number) => string;
}

/** Horizontal ranked bar chart — used for "por categoría", "por cuenta", "por método de pago", "más usadas". */
export function RankedBarChart({ title, icon, data, valueLabel = formatCurrency }: RankedBarChartProps) {
  if (data.length === 0) return null;

  const chartData = data.map((d, i) => ({ ...d, fill: paletteSlot(i) }));
  const height = Math.max(120, chartData.length * 36 + 24);

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="fw-medium mb-2">
          <i className={`bi ${icon} me-1`} />
          {title}
        </div>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 56, top: 4, bottom: 4 }}>
            <XAxis type="number" hide domain={[0, (max: number) => max * 1.2]} />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tickLine={false}
              axisLine={false}
              tick={{ fill: CHART_TEXT_MUTED, fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => valueLabel(Number(value))}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${CHART_GRIDLINE}` }}
            />
            <Bar
              dataKey="total"
              radius={[0, 4, 4, 0]}
              maxBarSize={20}
              label={{ position: 'right', formatter: (v) => valueLabel(Number(v)), fontSize: 11, fill: CHART_TEXT_MUTED }}
            >
              {chartData.map((entry) => (
                <Cell key={entry.id} fill={entry.color ?? entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
