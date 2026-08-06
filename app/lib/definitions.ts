// Type definitions for the Kipu Analytics data layer.

export type Channel = 'Web' | 'App' | 'Marketplace';

export type Customer = {
  id: string;
  name: string;
  email: string;
  region: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number; // céntimos de sol
  date: string; // YYYY-MM-DD
  status: 'pending' | 'paid';
  region: string;
  channel: Channel;
};

export type Revenue = {
  month: string;
  revenue: number; // soles
};

export type LatestInvoice = {
  id: string;
  name: string;
  email: string;
  amount: string;
  channel: Channel;
};

// The data layer returns a number for amount; formatCurrency turns it into a string.
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
  region: string;
  channel: Channel;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  region: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  region: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
