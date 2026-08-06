import BrandLogo from "@/app/ui/brand-logo";
import {
  ArrowRightIcon,
  ChartPieIcon,
  MagnifyingGlassIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { lusitana } from "./ui/fonts";

const features = [
  {
    icon: PresentationChartLineIcon,
    title: "Ingresos en tiempo real",
    description:
      "Sigue la evolución mensual de tus ventas y compárala con el período anterior.",
  },
  {
    icon: ChartPieIcon,
    title: "Canales y regiones",
    description:
      "Descubre qué canales venden más y cómo se distribuyen tus pedidos en el Perú.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Pedidos al detalle",
    description:
      "Busca, filtra y pagina todos tus pedidos con el estado de cobro de cada uno.",
  },
];

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-600 p-4 md:h-32">
        <BrandLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-16">
          <h1
            className={`${lusitana.className} text-2xl text-gray-800 md:text-4xl md:leading-tight`}
          >
            La analítica de ventas de tu e-commerce, en un solo lugar.
          </h1>
          <p className="text-base text-gray-600 md:text-lg">
            Kipu Analytics reúne los ingresos, pedidos y clientes de tu tienda
            para que tomes decisiones con datos, no con intuición. Hecho en el
            Perú por Daniel Yataco.
          </p>
          <Link
            href="/dashboard"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500 md:text-base"
          >
            <span>Ver dashboard</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 md:w-3/5 md:px-16 md:py-12">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="rounded-lg bg-blue-50 p-3">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  {feature.title}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
