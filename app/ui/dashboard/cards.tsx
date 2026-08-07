import {
  ArrowDownIcon,
  ArrowUpIcon,
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData, fetchKpiTrends, KpiTrend } from '@/app/lib/data';
import Sparkline from '@/app/ui/charts/sparkline';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const [
    {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    },
    trends,
  ] = await Promise.all([fetchCardData(), fetchKpiTrends()]);

  return (
    <>
      <Card
        title="Ventas cobradas"
        value={totalPaidInvoices}
        type="collected"
        trend={trends.collected}
      />
      <Card
        title="Por cobrar"
        value={totalPendingInvoices}
        type="pending"
        trend={trends.pending}
        increaseIsGood={false}
      />
      <Card
        title="Pedidos"
        value={numberOfInvoices}
        type="invoices"
        trend={trends.invoices}
      />
      <Card
        title="Clientes"
        value={numberOfCustomers}
        type="customers"
        trend={trends.customers}
      />
    </>
  );
}

function DeltaBadge({
  delta,
  increaseIsGood,
}: {
  delta: number;
  increaseIsGood: boolean;
}) {
  const isUp = delta >= 0;
  const isGood = isUp === increaseIsGood;
  const Icon = isUp ? ArrowUpIcon : ArrowDownIcon;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
        isGood ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700',
      )}
      title="Variación frente al mes anterior"
    >
      <Icon className="h-3 w-3" />
      {`${isUp ? '+' : ''}${delta.toFixed(1)}%`}
    </span>
  );
}

export function Card({
  title,
  value,
  type,
  trend,
  increaseIsGood = true,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
  trend?: KpiTrend;
  increaseIsGood?: boolean;
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex items-center p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
        {trend ? (
          <span className="ml-auto">
            <DeltaBadge delta={trend.delta} increaseIsGood={increaseIsGood} />
          </span>
        ) : null}
      </div>
      <div className="rounded-xl bg-white px-4 pb-2 pt-6">
        <p
          className={`${lusitana.className} truncate text-center text-2xl`}
        >
          {value}
        </p>
        {trend ? <Sparkline data={trend.series} id={type} /> : null}
      </div>
    </div>
  );
}
