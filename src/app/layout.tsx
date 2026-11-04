import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { TiendaProvider } from "@/lib/tienda-estado";
import { Encabezado } from "@/components/Encabezado";
import { Pie } from "@/components/Pie";
import { CarritoLateral } from "@/components/CarritoLateral";
import { Aviso } from "@/components/Aviso";
import { BotonWhatsApp } from "@/components/BotonWhatsApp";
import { CONTACTO } from "@/data/sitio";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-montserrat", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.acondair.com.ar"),
  title: {
    default: "Acondair Climatización | Calefacción y aire acondicionado en Bahía Blanca",
    template: "%s | Acondair Climatización",
  },
  description:
    "Calderas, radiadores, piso radiante, aires acondicionados y climatización de piscinas en Bahía Blanca desde 1963. Cálculo, instalación y servicio técnico propio. Tienda online con envíos a todo el país.",
  openGraph: { type: "website", locale: "es_AR", siteName: "Acondair Climatización" },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HVACBusiness",
  name: "Acondair Climatización",
  url: "https://www.acondair.com.ar",
  telephone: CONTACTO.telefono,
  email: CONTACTO.email,
  foundingDate: "1963",
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACTO.direccion,
    addressLocality: CONTACTO.ciudad,
    postalCode: CONTACTO.cp,
    addressRegion: CONTACTO.provincia,
    addressCountry: "AR",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:30", closes: "12:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "15:00", closes: "18:00" },
  ],
  sameAs: [CONTACTO.instagram],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={montserrat.variable}>
      <body className="min-h-dvh flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <TiendaProvider>
          <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2">
            Saltar al contenido
          </a>
          <Encabezado />
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <Pie />
          <CarritoLateral />
          <Aviso />
          <BotonWhatsApp />
        </TiendaProvider>
      </body>
    </html>
  );
}
