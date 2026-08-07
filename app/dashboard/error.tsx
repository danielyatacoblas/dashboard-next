'use client';

import { useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center gap-4">
      <ExclamationTriangleIcon className="w-12 text-amber-500" />
      <h2 className="text-center text-lg font-semibold">
        Algo salió mal al cargar esta sección.
      </h2>
      <button
        className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-500"
        onClick={() => reset()}
      >
        Reintentar
      </button>
    </main>
  );
}
