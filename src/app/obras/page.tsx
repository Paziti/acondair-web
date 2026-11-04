import type { Metadata } from "next";
import Image from "next/image";
import { Revelar } from "@/components/Revelar";
import { OBRAS, wa } from "@/data/sitio";

export const metadata: Metadata = {
  title: "Obras de climatización en Bahía Blanca",
  description: "Natatorio Barlovento, Hospital Municipal, Oficinas Land y Colegio El Solar: obras de calefacción y climatización hechas por Acondair.",
  alternates: { canonical: "/obras" },
};

export default function Obras() {
  return (
    <>
      <section className="mx-auto max-w-[1240px] px-4 md:px-6 pt-10 md:pt-16 pb-10">
        <h1 className="display text-[40px] sm:text-[52px] md:text-[64px] max-w-4xl">Obras</h1>
        <p className="mt-5 text-[19px] leading-relaxed text-[#3b4552] max-w-2xl">Más de 800 obras desde 1963. Estas son algunas, en edificios públicos, oficinas, escuelas y piscinas de Bahía Blanca.</p>
      </section>
      <section className="mx-auto max-w-[1240px] px-4 md:px-6 pb-24">
        <ol className="space-y-20 md:space-y-28">
          {OBRAS.map((o, i) => (
            <li key={o.slug} className={`grid md:grid-cols-12 gap-6 md:gap-10 items-end`}>
              <Revelar className={`relative aspect-[4/3] bg-papel md:col-span-7 ${i % 2 ? "md:order-2 md:col-start-6" : ""}`}>
                <Image src={o.img} alt={o.nombre} fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" priority={i === 0} />
              </Revelar>
              <div className={`md:col-span-5 ${i % 2 ? "md:order-1" : ""}`}>
                <p className="text-[14px] text-acero">{o.tipo}</p>
                <h2 className="display text-[28px] md:text-[36px] mt-1">{o.nombre}</h2>
                <p className={`mt-4 text-[17px] leading-relaxed max-w-md ${o.texto.startsWith("[") ? "text-aviso bg-aviso-claro p-3" : "text-[#3b4552]"}`}>{o.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="bg-hierro text-white">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 py-16 flex flex-wrap items-center justify-between gap-6">
          <p className="display text-[26px] md:text-[34px] max-w-2xl">¿Tenés una obra o un edificio para climatizar?</p>
          <a href={wa("Hola Acondair, quiero cotizar la climatización de una obra")} target="_blank" rel="noopener" className="presionable inline-flex h-[52px] items-center px-7 bg-acento font-semibold hover:bg-acento-oscuro">
            Cotizar una obra
          </a>
        </div>
      </section>
    </>
  );
}
