// Query layer for Kipu Analytics.
// Reads from the deterministic in-memory dataset in demo-data.ts and mimics
// an async database: every function returns a promise with simulated latency,
// so server components keep the same fetching patterns they would use with a
// real backend.

import { ITEMS_PER_PAGE } from './constants';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoice,
  Revenue,
} from './definitions';
import {
  CHANNELS,
  MONTH_LABELS_ES,
  completeMonths,
  customers,
  invoices,
  lastMonths,
  monthKey,
  simulateLatency,
} from './demo-data';
import { formatCurrency } from './utils';

const customersById = new Map(customers.map((c) => [c.id, c]));

function revenueByMonth(): Map<string, number> {
  const totals = new Map<string, number>();
  for (const invoice of invoices) {
    const key = invoice.date.slice(0, 7); // YYYY-MM
    totals.set(key, (totals.get(key) ?? 0) + invoice.amount);
  }
  return totals;
}

export async function fetchRevenue(): Promise<Revenue[]> {
  await simulateLatency(500);

  const totals = revenueByMonth();
  return lastMonths(12).map((month) => ({
    month: MONTH_LABELS_ES[month.getMonth()],
    revenue: Math.round((totals.get(monthKey(month)) ?? 0) / 100),
  }));
}

export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
  await simulateLatency(400);

  return invoices.slice(0, 5).map((invoice) => {
    const customer = customersById.get(invoice.customer_id)!;
    return {
      id: invoice.id,
      name: customer.name,
      email: customer.email,
      channel: invoice.channel,
      amount: formatCurrency(invoice.amount),
    };
  });
}

export async function fetchCardData() {
  await simulateLatency(300);

  let paid = 0;
  let pending = 0;
  for (const invoice of invoices) {
    if (invoice.status === 'paid') paid += invoice.amount;
    else pending += invoice.amount;
  }

  return {
    numberOfCustomers: customers.length,
    numberOfInvoices: invoices.length,
    totalPaidInvoices: formatCurrency(paid),
    totalPendingInvoices: formatCurrency(pending),
  };
}

export type RevenueComparisonPoint = {
  month: string; // label of the current-period month
  actual: number; // soles
  anterior: number; // soles, same offset within the previous period
};

/**
 * Monthly revenue of the last 8 complete months compared point-by-point with
 * the 8 months before them.
 */
export async function fetchRevenueComparison(): Promise<
  RevenueComparisonPoint[]
> {
  await simulateLatency(500);

  const totals = revenueByMonth();
  const soles = (month: Date) =>
    Math.round((totals.get(monthKey(month)) ?? 0) / 100);

  const months = completeMonths(16);
  const previous = months.slice(0, 8);
  const current = months.slice(8);

  return current.map((month, i) => ({
    month: `${MONTH_LABELS_ES[month.getMonth()]} ${String(
      month.getFullYear(),
    ).slice(-2)}`,
    actual: soles(month),
    anterior: soles(previous[i]),
  }));
}

export type ChannelSales = { channel: string; total: number };
export type RegionSales = { region: string; total: number };

/** Sales in soles by channel over the last 12 complete months. */
export async function fetchSalesByChannel(): Promise<ChannelSales[]> {
  await simulateLatency(400);

  const window = new Set(completeMonths(12).map(monthKey));
  const totals = new Map<string, number>(CHANNELS.map((c) => [c, 0]));
  for (const invoice of invoices) {
    if (!window.has(invoice.date.slice(0, 7))) continue;
    totals.set(invoice.channel, (totals.get(invoice.channel) ?? 0) + invoice.amount);
  }
  return CHANNELS.map((channel) => ({
    channel,
    total: Math.round((totals.get(channel) ?? 0) / 100),
  }));
}

/** Sales in soles by region over the last 12 complete months, descending. */
export async function fetchSalesByRegion(): Promise<RegionSales[]> {
  await simulateLatency(400);

  const window = new Set(completeMonths(12).map(monthKey));
  const totals = new Map<string, number>();
  for (const invoice of invoices) {
    if (!window.has(invoice.date.slice(0, 7))) continue;
    totals.set(invoice.region, (totals.get(invoice.region) ?? 0) + invoice.amount);
  }
  return [...totals.entries()]
    .map(([region, total]) => ({ region, total: Math.round(total / 100) }))
    .sort((a, b) => b.total - a.total);
}

export type KpiTrend = {
  /** Monthly values for the last 6 complete months. */
  series: number[];
  /** Percent change of the last month vs the month before. */
  delta: number;
};

export type KpiTrends = {
  collected: KpiTrend;
  pending: KpiTrend;
  invoices: KpiTrend;
  customers: KpiTrend;
};

/** Monthly KPI series (last 6 complete months) for the card sparklines. */
export async function fetchKpiTrends(): Promise<KpiTrends> {
  await simulateLatency(300);

  const months = completeMonths(6).map(monthKey);
  const byMonth = new Map(
    months.map((key) => [
      key,
      { collected: 0, pending: 0, invoices: 0, customerIds: new Set<string>() },
    ]),
  );

  for (const invoice of invoices) {
    const bucket = byMonth.get(invoice.date.slice(0, 7));
    if (!bucket) continue;
    if (invoice.status === 'paid') bucket.collected += invoice.amount / 100;
    else bucket.pending += invoice.amount / 100;
    bucket.invoices += 1;
    bucket.customerIds.add(invoice.customer_id);
  }

  const series = (pick: (b: {
    collected: number;
    pending: number;
    invoices: number;
    customerIds: Set<string>;
  }) => number) => months.map((key) => pick(byMonth.get(key)!));

  const withDelta = (values: number[]): KpiTrend => {
    const last = values[values.length - 1];
    const prev = values[values.length - 2];
    const delta = prev === 0 ? 0 : ((last - prev) / prev) * 100;
    return { series: values, delta };
  };

  return {
    collected: withDelta(series((b) => Math.round(b.collected))),
    pending: withDelta(series((b) => Math.round(b.pending))),
    invoices: withDelta(series((b) => b.invoices)),
    customers: withDelta(series((b) => b.customerIds.size)),
  };
}

function matchesQuery(invoice: InvoicesTable, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    invoice.name.toLowerCase().includes(q) ||
    invoice.email.toLowerCase().includes(q) ||
    invoice.region.toLowerCase().includes(q) ||
    invoice.channel.toLowerCase().includes(q) ||
    invoice.date.includes(q) ||
    String(invoice.amount / 100).includes(q) ||
    (q === 'pagado' && invoice.status === 'paid') ||
    (q === 'pendiente' && invoice.status === 'pending') ||
    invoice.status.includes(q)
  );
}

function filteredInvoiceRows(query: string): InvoicesTable[] {
  return invoices
    .map((invoice) => {
      const customer = customersById.get(invoice.customer_id)!;
      return {
        id: invoice.id,
        customer_id: invoice.customer_id,
        name: customer.name,
        email: customer.email,
        date: invoice.date,
        amount: invoice.amount,
        status: invoice.status,
        region: invoice.region,
        channel: invoice.channel,
      };
    })
    .filter((row) => matchesQuery(row, query));
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
): Promise<InvoicesTable[]> {
  await simulateLatency(350);

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  return filteredInvoiceRows(query).slice(offset, offset + ITEMS_PER_PAGE);
}

export async function fetchInvoicesPages(query: string): Promise<number> {
  await simulateLatency(200);

  return Math.max(
    1,
    Math.ceil(filteredInvoiceRows(query).length / ITEMS_PER_PAGE),
  );
}

export async function fetchInvoiceById(
  id: string,
): Promise<InvoiceForm | undefined> {
  await simulateLatency(200);

  const invoice = invoices.find((item) => item.id === id);
  if (!invoice) return undefined;

  return {
    id: invoice.id,
    customer_id: invoice.customer_id,
    amount: invoice.amount / 100,
    status: invoice.status,
  };
}

export async function fetchCustomers(): Promise<CustomerField[]> {
  await simulateLatency(200);

  return customers
    .map(({ id, name }) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

export async function fetchFilteredCustomers(query: string) {
  await simulateLatency(350);

  const q = query.toLowerCase();
  const rows: CustomersTableType[] = customers
    .filter(
      (customer) =>
        !q ||
        customer.name.toLowerCase().includes(q) ||
        customer.email.toLowerCase().includes(q) ||
        customer.region.toLowerCase().includes(q),
    )
    .map((customer) => {
      const own = invoices.filter((i) => i.customer_id === customer.id);
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        region: customer.region,
        total_invoices: own.length,
        total_pending: own
          .filter((i) => i.status === 'pending')
          .reduce((sum, i) => sum + i.amount, 0),
        total_paid: own
          .filter((i) => i.status === 'paid')
          .reduce((sum, i) => sum + i.amount, 0),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));

  return rows.map((customer) => ({
    ...customer,
    total_pending: formatCurrency(customer.total_pending),
    total_paid: formatCurrency(customer.total_paid),
  }));
}
