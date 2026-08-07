'use client';

import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { chartColors } from './theme';

export default function Sparkline({
  data,
  id,
}: {
  data: number[];
  id: string;
}) {
  const points = data.map((value, i) => ({ i, value }));

  return (
    <div className="h-10 w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={chartColors.primary}
                stopOpacity={0.25}
              />
              <stop
                offset="100%"
                stopColor={chartColors.primary}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={chartColors.primary}
            strokeWidth={2}
            fill={`url(#spark-${id})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
