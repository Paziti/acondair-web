import type { Metadata } from "next";
import { Articulo } from "@/components/Articulo";
import { IndiceSistemas } from "@/components/IndiceSistemas";
import { CALEFACCION_GENERAL } from "@/lib/catalogo";

export const metadata: Metadata = {
  title: "Sistemas de calefacción y refrigeración",
  description: "Radiadores, piso radiante, calderas, aerotermia, split inverter, VRF, fancoil y climatización de piscinas. Cómo elegir el sistema según tu casa.",
  alternates: { canonical: "/sistemas" },
};

export default function Sistemas() {
  return (
    <>
      <section className="mx-auto max-w-[1240px] px-4 md:px-6 pt-10 md:pt-16 pb-16">
        <h1 className="display text-[40px] sm:text-[52px] md:text-[64px] max-w-4xl">Sistemas de calefacción y refrigeración</h1>
        <p className="mt-5 text-[19px] leading-relaxed text-[#3b4552] max-w-2xl">
          Elegí un sistema para ver cómo funciona, qué ventajas tiene y qué equipos tenemos en stock.
        </p>
        <div className="mt-12">
          <IndiceSistemas />
        </div>
      </section>
      <section className="border-t border-chapa">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 py-16 md:py-20 grid lg:grid-cols-[0.7fr_1.3fr] gap-10 lg:gap-16">
          <h2 className="display text-[30px] md:text-[38px] lg:sticky lg:top-32 self-start">Confort térmico y cómo se calcula</h2>
          <Articulo bloques={CALEFACCION_GENERAL} />
        </div>
      </section>
    </>
  );
}
