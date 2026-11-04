import type { Metadata } from "next";
import { Catalogo } from "@/components/Catalogo";

export const metadata: Metadata = {
  title: "Tienda online: calderas, aires, radiadores y repuestos",
  description: "Comprá calderas, aires acondicionados, radiadores, calefones, climatizadores de piscina y repuestos. Envíos a todo el país con Andreani o retiro en Bahía Blanca.",
  alternates: { canonical: "/tienda" },
};

export default function Tienda() {
  return (
    <section className="mx-auto max-w-[1240px] px-4 md:px-6 pt-10 md:pt-14 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <h1 className="display text-[40px] sm:text-[52px]">Tienda</h1>
        <p className="text-[15px] text-acero max-w-md">Precios con IVA incluido. Pagás con Mercado Pago o transferencia; envío con Andreani o retiro sin cargo en Undiano 460.</p>
      </div>
      <Catalogo />
    </section>
  );
}
