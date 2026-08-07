import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenueComparison } from '@/app/lib/data';
import RevenueAreaChart from '@/app/ui/charts/revenue-area-chart';

export default async function RevenueChart() {
  const data = await fetchRevenueComparison();

  if (!data || data.length === 0) {
    return <p className="mt-4 text-gray-400">No hay datos disponibles.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Ingresos mensuales
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="rounded-md bg-white p-4">
          <RevenueAreaChart data={data} />
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">
            Últimos 8 meses completos vs. los 8 anteriores
          </h3>
        </div>
      </div>
    </div>
  );
}
