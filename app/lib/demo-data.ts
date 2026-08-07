// Deterministic in-memory dataset for Kipu Analytics.
// Everything is generated from a fixed-seed PRNG (mulberry32), so the data
// is identical on every run — no database and no Math.random involved.

import { Customer, Invoice } from './definitions';

// --- Seeded PRNG -----------------------------------------------------------

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260806);

function randBetween(min: number, max: number) {
  return min + rand() * (max - min);
}

function pickWeighted<T>(options: { value: T; weight: number }[]): T {
  const total = options.reduce((sum, o) => sum + o.weight, 0);
  let r = rand() * total;
  for (const option of options) {
    r -= option.weight;
    if (r <= 0) return option.value;
  }
  return options[options.length - 1].value;
}

// --- Static catalogs -------------------------------------------------------

export const REGIONS = [
  'Lima',
  'Arequipa',
  'Cusco',
  'Trujillo',
  'Piura',
  'Chiclayo',
  'Huancayo',
  'Tacna',
] as const;

export const CHANNELS = ['Web', 'App', 'Marketplace'] as const;

const CUSTOMER_SEED: { name: string; region: (typeof REGIONS)[number] }[] = [
  { name: 'Valeria Quispe Mamani', region: 'Cusco' },
  { name: 'José Luis Huamán Ríos', region: 'Lima' },
  { name: 'María Fernanda Rojas', region: 'Arequipa' },
  { name: 'Luis Alberto Ccahuana', region: 'Cusco' },
  { name: 'Rosa Elena Chávez', region: 'Trujillo' },
  { name: 'Jorge Castillo Paredes', region: 'Lima' },
  { name: 'Carmen Flores Núñez', region: 'Piura' },
  { name: 'Pedro Vásquez Salas', region: 'Chiclayo' },
  { name: 'Ana Lucía Torres', region: 'Lima' },
  { name: 'Miguel Ángel Paredes', region: 'Huancayo' },
  { name: 'Lucía Fernández Vega', region: 'Arequipa' },
  { name: 'Ricardo Salazar Ponce', region: 'Tacna' },
  { name: 'Fiorella Gutiérrez Luna', region: 'Lima' },
  { name: 'Diego Espinoza Cárdenas', region: 'Trujillo' },
  { name: 'Sofía Cárdenas Bravo', region: 'Piura' },
];

const ACCENT_MAP: Record<string, string> = {
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ú: 'u',
  ü: 'u',
  ñ: 'n',
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[áéíóúüñ]/g, (c) => ACCENT_MAP[c] ?? c)
    .split(' ')
    .slice(0, 2)
    .join('.');
}

function fakeUuid(prefix: number, index: number) {
  const block = (n: number, len: number) =>
    Math.floor(n).toString(16).padStart(len, '0').slice(-len);
  return [
    block(prefix * 104729 + index * 7919, 8),
    block(index * 104729 + 13, 4),
    '4' + block(index * 331 + prefix, 3),
    'a' + block(index * 977 + 41, 3),
    block(prefix * 15485863 + index * 6700417, 12),
  ].join('-');
}

export const customers: Customer[] = CUSTOMER_SEED.map((seed, i) => ({
  id: fakeUuid(1, i),
  name: seed.name,
  email: `${slugify(seed.name)}@${
    ['gmail.com', 'hotmail.com', 'outlook.com'][i % 3]
  }`,
  region: seed.region,
}));

// --- Order (invoice) generation -------------------------------------------
// ~18 months of e-commerce sales with an upward trend and seasonal peaks in
// July (Fiestas Patrias) and December (Navidad). Amounts are in céntimos.

const MONTHS_OF_HISTORY = 18;

// Seasonality multiplier per calendar month (0 = January).
const SEASONALITY = [
  0.82, 0.85, 0.95, 1.0, 1.12, 1.0, 1.38, 1.02, 0.95, 1.0, 1.18, 1.62,
];

// Anchor the series to the current month so the dashboard always looks fresh.
const now = new Date();
const anchor = new Date(now.getFullYear(), now.getMonth(), 1);

export const invoices: Invoice[] = [];

let orderIndex = 0;
for (let m = MONTHS_OF_HISTORY - 1; m >= 0; m--) {
  const monthDate = new Date(anchor.getFullYear(), anchor.getMonth() - m, 1);
  const monthsFromStart = MONTHS_OF_HISTORY - 1 - m;

  // Upward trend (~2.2% monthly) with seasonality.
  const trend = Math.pow(1.022, monthsFromStart);
  const season = SEASONALITY[monthDate.getMonth()];
  const orderCount = Math.round(randBetween(24, 30) * trend * season);

  const daysInMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0,
  ).getDate();
  // Don't create orders in the future within the current month.
  const maxDay = m === 0 ? Math.max(now.getDate(), 1) : daysInMonth;

  for (let i = 0; i < orderCount; i++) {
    const customer = customers[Math.floor(rand() * customers.length)];
    const day = 1 + Math.floor(rand() * maxDay);
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);

    // Ticket in soles: skewed towards small baskets, occasional big orders.
    const base = randBetween(60, 380);
    const bigOrder = rand() < 0.12 ? randBetween(400, 1600) : 0;
    const amount = Math.round((base + bigOrder) * trend * 100); // céntimos

    // Recent orders are more likely to still be pending collection.
    const pendingChance = m === 0 ? 0.55 : m === 1 ? 0.3 : 0.08;
    const status: Invoice['status'] =
      rand() < pendingChance ? 'pending' : 'paid';

    invoices.push({
      id: fakeUuid(2, orderIndex++),
      customer_id: customer.id,
      amount,
      date: date.toISOString().split('T')[0],
      status,
      region: customer.region,
      channel: pickWeighted([
        { value: 'Web' as const, weight: 45 },
        { value: 'App' as const, weight: 20 },
        { value: 'Marketplace' as const, weight: 35 },
      ]),
    });
  }
}

invoices.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

// --- Helpers shared by the query layer -------------------------------------

export const MONTH_LABELS_ES = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

export function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function lastMonths(count: number): Date[] {
  const months: Date[] = [];
  for (let m = count - 1; m >= 0; m--) {
    months.push(new Date(anchor.getFullYear(), anchor.getMonth() - m, 1));
  }
  return months;
}

/**
 * The last `count` COMPLETE months (the current, partial month is excluded so
 * aggregates and deltas are not skewed by a month still in progress).
 */
export function completeMonths(count: number): Date[] {
  const months: Date[] = [];
  for (let m = count; m >= 1; m--) {
    months.push(new Date(anchor.getFullYear(), anchor.getMonth() - m, 1));
  }
  return months;
}

/** Simulated network/database latency so Suspense boundaries are visible. */
export function simulateLatency(ms = 300) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
