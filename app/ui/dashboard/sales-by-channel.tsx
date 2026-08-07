import { lusitana } from '@/app/ui/fonts';
import { fetchSalesByChannel } from '@/app/lib/data';
import ChannelDonut from '@/app/ui/charts/channel-donut';

export default async function SalesByChannel() {
  const data = await fetchSalesByChannel();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Ventas por canal
      </h2>
      <div className="flex grow flex-col rounded-xl bg-gray-50 p-4">
        <div className="flex grow items-center rounded-md bg-white p-4">
          <ChannelDonut data={data} />
        </div>
        <p className="pt-4 text-sm text-gray-500">Últimos 12 meses completos</p>
      </div>
    </div>
  );
}
