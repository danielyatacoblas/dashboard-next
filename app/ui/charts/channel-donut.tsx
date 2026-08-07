'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChannelSales } from '@/app/lib/data';
import {
  channelColors,
  chartColors,
  formatSoles,
  formatSolesCompact,
  tooltipStyle,
} from './theme';

export default function ChannelDonut({ data }: { data: ChannelSales[] }) {
  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
      <div className="relative h-[220px] w-[220px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => formatSoles(Number(value))}
            />
            <Pie
              data={data}
              dataKey="total"
              nameKey="channel"
              innerRadius="62%"
              outerRadius="88%"
              stroke="#ffffff"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.channel}
                  fill={channelColors[entry.channel] ?? chartColors.primary}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-sm font-semibold text-gray-800">
            {formatSolesCompact(total)}
          </p>
        </div>
      </div>
      {/* Direct labels: name, value and share for every segment. */}
      <ul className="w-full space-y-3">
        {data.map((entry) => (
          <li key={entry.channel} className="flex items-center gap-3 text-sm">
            <span
              aria-hidden
              className="h-3 w-3 shrink-0 rounded-sm"
              style={{
                backgroundColor:
                  channelColors[entry.channel] ?? chartColors.primary,
              }}
            />
            <span className="w-28 text-gray-700">{entry.channel}</span>
            <span className="font-medium text-gray-900">
              {formatSoles(entry.total)}
            </span>
            <span className="ml-auto text-gray-500">
              {total > 0 ? Math.round((entry.total / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
