import { Suspense } from 'react';
import { Metadata } from 'next';
import { lusitana } from '@/app/ui/fonts';
import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import SalesByChannel from '@/app/ui/dashboard/sales-by-channel';
import SalesByRegion from '@/app/ui/dashboard/sales-by-region';
import {
  CardsSkeleton,
  ChartPanelSkeleton,
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Resumen',
};

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-6 text-2xl md:text-3xl`}>
        Resumen de ventas
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<ChartPanelSkeleton />}>
          <SalesByChannel />
        </Suspense>
        <Suspense fallback={<ChartPanelSkeleton />}>
          <SalesByRegion />
        </Suspense>
      </div>
    </main>
  );
}
