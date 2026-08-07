import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
        {
          // Contraste AA: gray-700 sobre gray-100 y blanco sobre green-700.
          'bg-gray-100 text-gray-700': status === 'pending',
          'bg-green-700 text-white': status === 'paid',
        },
      )}
    >
      {status === 'pending' ? (
        <>
          Pendiente
          <ClockIcon className="ml-1 w-4 text-gray-700" />
        </>
      ) : null}
      {status === 'paid' ? (
        <>
          Pagado
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
