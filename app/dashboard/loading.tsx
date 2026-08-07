export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
