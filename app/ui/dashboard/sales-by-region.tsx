import { lusitana } from '@/app/ui/fonts';
import { fetchSalesByRegion } from '@/app/lib/data';
import RegionBars from '@/app/ui/charts/region-bars';

export default async function SalesByRegion() {
  const data = await fetchSalesByRegion();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Ventas por región
      </h2>
      <div className="flex grow flex-col rounded-xl bg-gray-50 p-4">
        <div className="grow rounded-md bg-white p-4">
          <RegionBars data={data} />
        </div>
        <p className="pt-4 text-sm text-gray-500">Últimos 12 meses completos</p>
      </div>
    </div>
  );
}
