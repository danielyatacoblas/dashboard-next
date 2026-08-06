// Query layer for Kipu Analytics.
// Reads from the deterministic in-memory dataset in demo-data.ts and mimics
// an async database: every function returns a promise with simulated latency,
// so server components keep the same fetching patterns they would use with a
// real backend.

import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoice,
  Revenue,
} from './definitions';
import {
  MONTH_LABELS_ES,
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

const ITEMS_PER_PAGE = 6;

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
