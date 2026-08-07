import SideNav from "@/app/ui/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  // En móvil la altura crece con el contenido y scrollea la página; a partir
  // de md el alto se fija y solo scrollea la columna de contenido.
  return (
    <div className="flex min-h-screen flex-col md:h-screen md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 pb-10 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}
