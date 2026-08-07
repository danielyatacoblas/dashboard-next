'use client';

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { RevenueComparisonPoint } from '@/app/lib/data';
import {
  axisTick,
  chartColors,
  formatSoles,
  formatSolesCompact,
  tooltipStyle,
} from './theme';

export default function RevenueAreaChart({
  data,
}: {
  data: RevenueComparisonPoint[];
}) {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 4 }}
        >
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={chartColors.primary}
                stopOpacity={0.18}
              />
              <stop
                offset="100%"
                stopColor={chartColors.primary}
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke={chartColors.grid}
            strokeWidth={1}
          />
          <XAxis
            dataKey="month"
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={formatSolesCompact}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => formatSoles(Number(value))}
            cursor={{ stroke: chartColors.axis, strokeDasharray: '3 3' }}
          />
          <Legend
            iconType="plainline"
            wrapperStyle={{ fontSize: '0.8rem', color: chartColors.axis }}
          />
          <Area
            type="monotone"
            dataKey="actual"
            name="Este período"
            stroke={chartColors.primary}
            strokeWidth={2}
            fill="url(#revenueFill)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: '#ffffff' }}
          />
          <Line
            type="monotone"
            dataKey="anterior"
            name="Período anterior"
            stroke={chartColors.comparison}
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: '#ffffff' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
