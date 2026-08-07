'use client';

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { RegionSales } from '@/app/lib/data';
import {
  axisTick,
  chartColors,
  formatSoles,
  formatSolesCompact,
  tooltipStyle,
} from './theme';

export default function RegionBars({ data }: { data: RegionSales[] }) {
  return (
    <div className="w-full" style={{ height: data.length * 34 + 16 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 64, bottom: 0, left: 0 }}
          barSize={18}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="region"
            width={82}
            tick={axisTick}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [formatSoles(Number(value)), 'Ventas']}
            cursor={{ fill: 'rgba(79, 70, 229, 0.06)' }}
          />
          <Bar
            dataKey="total"
            fill={chartColors.primary}
            radius={[0, 4, 4, 0]}
            isAnimationActive={false}
          >
            {data.map((entry) => (
              <Cell key={entry.region} fill={chartColors.primary} />
            ))}
            <LabelList
              dataKey="total"
              position="right"
              formatter={(value: React.ReactNode) =>
                formatSolesCompact(Number(value))
              }
              style={{ fill: chartColors.axis, fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
