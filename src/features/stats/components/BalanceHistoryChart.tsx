import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { BalancePoint } from '../logic/statsAggregations';
import { CHART_GRIDLINE, CHART_TEXT_MUTED, SEQUENTIAL_HUE } from '../logic/chartPalette';
import { formatCompactCurrency, formatCurrency } from '../../../shared/utils/currency';

interface BalanceHistoryChartProps {
  data: BalancePoint[];
}

/** Single series over time — sequential hue, area fill as a wash per the mark spec. */
export function BalanceHistoryChart({ data }: BalanceHistoryChartProps) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="fw-medium mb-2">
          <i className="bi bi-graph-up me-1" />
          Balance histórico
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ left: -16, right: 8, top: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SEQUENTIAL_HUE} stopOpacity={0.18} />
                <stop offset="100%" stopColor={SEQUENTIAL_HUE} stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="balance"
              stroke={SEQUENTIAL_HUE}
              strokeWidth={2}
              fill="url(#balanceFill)"
              dot={{ r: 3, fill: SEQUENTIAL_HUE, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
