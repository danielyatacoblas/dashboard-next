import { roboto } from "@/app/ui/fonts";
import "@/app/ui/global.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Kipu Analytics",
    default: "Kipu Analytics — Analítica de ventas para e-commerce",
  },
  description:
    "Dashboard de analítica de ventas para e-commerce en el Perú: ingresos, pedidos, clientes, canales y regiones. Desarrollado por Daniel Yataco.",
  authors: [{ name: "Daniel Yataco Blas" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${roboto.className} antialiased`}>{children}</body>
    </html>
  );
}
