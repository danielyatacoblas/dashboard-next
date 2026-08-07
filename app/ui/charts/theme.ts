// Shared visual language for every chart: one validated palette, one axis
// style, one tooltip style. Categorical slots were validated for color-vision
// deficiency and normal-vision separation (all pairs) on a white surface.

export const chartColors = {
  /** Categorical slot 1 — brand primary (indigo). */
  primary: '#4f46e5',
  /** Categorical slot 2 (aqua). */
  aqua: '#1baf7a',
  /** Categorical slot 3 (amber). */
  amber: '#eda100',
  /** Previous-period series: neutral, recessive. */
  comparison: '#9ca3af',
  grid: '#e5e7eb',
  axis: '#6b7280',
  positive: '#16a34a',
  negative: '#dc2626',
};

export const channelColors: Record<string, string> = {
  Web: chartColors.primary,
  App: chartColors.aqua,
  Marketplace: chartColors.amber,
};

/** Values arrive in soles (not céntimos). */
export function formatSoles(value: number) {
  return `S/ ${Math.round(value).toLocaleString('es-PE')}`;
}

export function formatSolesCompact(value: number) {
  if (Math.abs(value) >= 1000) {
    const k = value / 1000;
    return `S/ ${Number.isInteger(k) ? k : k.toFixed(1)}k`;
  }
  return `S/ ${value}`;
}

export const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '0.5rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  fontSize: '0.8rem',
  padding: '0.5rem 0.75rem',
} as const;

export const axisTick = {
  fill: chartColors.axis,
  fontSize: 12,
} as const;
