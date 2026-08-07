'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { generatePagination } from '@/app/lib/utils';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <nav aria-label="Paginación de pedidos" className="w-full">
      {/* max-w-full + overflow-x-auto: en pantallas muy estrechas la tira de
          páginas se desplaza dentro de su caja en vez de desbordar la página. */}
      <div className="flex w-full justify-center">
        <div className="inline-flex max-w-full items-center overflow-x-auto px-1 py-1">
          <PaginationArrow
            direction="left"
            href={createPageURL(currentPage - 1)}
            isDisabled={currentPage <= 1}
          />

          <div className="flex -space-x-px">
            {allPages.map((page, index) => {
              let position: 'first' | 'last' | 'single' | 'middle' | undefined;

              if (index === 0) position = 'first';
              if (index === allPages.length - 1) position = 'last';
              if (allPages.length === 1) position = 'single';
              if (page === '...') position = 'middle';

              return (
                <PaginationNumber
                  key={`${page}-${index}`}
                  href={createPageURL(page)}
                  page={page}
                  position={position}
                  isActive={currentPage === page}
                />
              );
            })}
          </div>

          <PaginationArrow
            direction="right"
            href={createPageURL(currentPage + 1)}
            isDisabled={currentPage >= totalPages}
          />
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-gray-600">
        Página {currentPage} de {totalPages}
      </p>
    </nav>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  const className = clsx(
    'flex h-9 w-9 shrink-0 items-center justify-center border border-gray-200 text-xs sm:h-10 sm:w-10 sm:text-sm',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 border-blue-700 bg-blue-700 font-medium text-white': isActive,
      'text-gray-700 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700':
        !isActive && position !== 'middle',
      'text-gray-500': position === 'middle',
    },
  );

  return isActive || position === 'middle' ? (
    <div className={className} aria-current={isActive ? 'page' : undefined}>
      {page}
    </div>
  ) : (
    <Link href={href} className={className} aria-label={`Ir a la página ${page}`}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const className = clsx(
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 sm:h-10 sm:w-10',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'text-gray-700 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700':
        !isDisabled,
      'mr-1 sm:mr-4': direction === 'left',
      'ml-1 sm:ml-4': direction === 'right',
    },
  );

  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className} aria-hidden>
      {icon}
    </div>
  ) : (
    <Link
      className={className}
      href={href}
      aria-label={
        direction === 'left' ? 'Página anterior' : 'Página siguiente'
      }
    >
      {icon}
    </Link>
  );
}
