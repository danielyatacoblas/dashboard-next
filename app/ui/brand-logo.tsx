import { ChartBarSquareIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";

export default function BrandLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center gap-2 leading-none text-white`}
    >
      <ChartBarSquareIcon className="h-10 w-10 shrink-0 md:h-12 md:w-12" />
      <p className="text-2xl font-bold md:text-[28px]">
        Kipu <span className="font-normal">Analytics</span>
      </p>
    </div>
  );
}
