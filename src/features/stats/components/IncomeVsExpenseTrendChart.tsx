import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MonthlyPoint } from '../logic/statsAggregations';
import { CHART_GRIDLINE, CHART_TEXT_MUTED, EXPENSE_COLOR, INCOME_COLOR } from '../logic/chartPalette';
import { formatCompactCurrency, formatCurrency } from '../../../shared/utils/currency';

interface IncomeVsExpenseTrendChartProps {
  data: MonthlyPoint[];
}

export function IncomeVsExpenseTrendChart({ data }: IncomeVsExpenseTrendChartProps) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="fw-medium mb-2">
          <i className="bi bi-bar-chart-line me-1" />
          Evolución mensual (ingresos vs. gastos)
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ left: -16, right: 8, top: 4, bottom: 0 }}>
            <CartesianGrid stroke={CHART_GRIDLINE} vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: CHART_TEXT_MUTED, fontSize: 12 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: CHART_TEXT_MUTED, fontSize: 11 }}
              tickFormatter={(v) => formatCompactCurrency(Number(v))}
              width={48}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${CHART_GRIDLINE}` }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="income" name="Ingresos" fill={INCOME_COLOR} radius={[4, 4, 0, 0]} maxBarSize={20} />
            <Bar dataKey="expense" name="Gastos" fill={EXPENSE_COLOR} radius={[4, 4, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
