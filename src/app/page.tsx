import Image from "next/image";
import Link from "next/link";
import { Calculadora } from "@/components/Calculadora";
import { Vidriera } from "@/components/Vidriera";
import { NumeroDeslizante } from "@/components/NumeroDeslizante";
import { Revelar } from "@/components/Revelar";
import { SliderPrincipal } from "@/components/SliderPrincipal";
import { CIFRAS, OBRAS, wa } from "@/data/sitio";

// Mismo recorrido que la web actual (slider, asesoramiento, servicios, cifras, obras, promociones),
// con dos agregados: la calculadora y la tienda con compra completa.

const SERVICIOS_INICIO = [
  {
    titulo: "Stock de repuestos",
    texto: "Garantizamos una amplia disponibilidad de repuestos de las marcas distribuidas.",
    img: "/actual/Services3.jpg",
  },
  {
    titulo: "Garantía oficial",
    texto: "Somos distribuidores oficiales de los productos ofrecidos. Las garantías las atiende personal propio, no tercerizado.",
    img: "/actual/Services2.jpg",
  },
  {
    titulo: "Servicio técnico propio",
    texto: "Todas nuestras instalaciones están respaldadas por un servicio de post-venta propio y stock permanente de repuestos.",
    img: "/actual/Services1.jpg",
  },
];

const PROMOS = [
  { titulo: "Plan Cuota Simple", texto: "3 y 6 cuotas fijas en productos seleccionados.", img: "/actual/Tarjetas1.jpg" },
  { titulo: "Promo Banco Provincia", texto: "4 cuotas fijas con tasa especial, todos los días.", img: "/actual/Tarjetas3.jpg" },
  { titulo: "Promo Banco Nación", texto: "6, 9 y 12 cuotas fijas con tasa especial BNA+.", img: "/actual/Tarjetas2.jpg" },
];

function TituloCentrado({ children, claro = false }: { children: React.ReactNode; claro?: boolean }) {
  return (
    <div className="text-center mb-10 md:mb-12">
      <h2 className={`text-[24px] md:text-[28px] font-semibold uppercase ${claro ? "text-white" : "text-hierro"}`}>{children}</h2>
      <span aria-hidden className="block mx-auto mt-3 w-12 h-[3px] bg-turquesa" />
    </div>
  );
}

export default function Inicio() {
  return (
    <>
      <SliderPrincipal />

      {/* BANDA AZUL de asesoramiento, montada sobre el borde del slider como en la web actual */}
      <section className="bg-hierro">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 -mt-16 relative z-10">
          <div className="bg-azul text-white px-6 md:px-8 py-7 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <p className="text-[24px] md:text-[30px] font-bold uppercase leading-tight">¿Necesitás asesoramiento?</p>
            <a
              href={wa("Hola Acondair, necesito asesoramiento para la calefacción / climatización de mi casa")}
              target="_blank"
              rel="noopener"
              className="presionable inline-flex h-[50px] items-center justify-center px-12 rounded-full border-2 border-white text-[18px] font-medium hover:bg-white hover:text-azul"
            >
              Consultanos
            </a>
          </div>
        </div>

        {/* SERVICIOS: las tres tarjetas con foto de la web actual */}
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 pt-14 pb-16 md:pb-20 grid md:grid-cols-3 gap-8">
          {SERVICIOS_INICIO.map((s) => (
            <article key={s.titulo} className="group">
              <div className="relative aspect-[8/5] overflow-hidden bg-white">
                <Image src={s.img} alt="" fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]" />
              </div>
              <h3 className="mt-5 text-white text-[18px] font-semibold uppercase">{s.titulo}</h3>
              <p className="mt-2 text-white/75 text-[15px] leading-relaxed">{s.texto}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CALCULADORA: lo nuevo. Saca la cuenta del balance térmico y recomienda equipos de la tienda */}
      <section id="calculadora" className="mx-auto max-w-[1240px] px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-2xl mb-10">
          <h2 className="display text-[28px] md:text-[36px] text-hierro">¿Qué equipo necesita tu casa?</h2>
          <span aria-hidden className="block mt-4 w-12 h-[3px] bg-turquesa" />
          <p className="mt-5 text-[16px] leading-relaxed text-[#3b4552]">
            Mové los valores y te mostramos cuántas kilocalorías o frigorías hacen falta, y qué calderas, radiadores o equipos split de la tienda alcanzan.
          </p>
          <p className="mt-4 text-[15px] text-acero">Es una estimación. Para el cálculo final hacemos el balance térmico en tu casa.</p>
        </div>
        <Calculadora compacta />
      </section>

      {/* POR QUÉ ELEGIRNOS: banda azul con las cifras publicadas */}
      <section className="bg-azul text-white">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 py-14 md:py-16 grid lg:grid-cols-[1fr_2fr] gap-10 items-center">
          <div>
            <h2 className="text-[26px] md:text-[30px] font-semibold">¿Por qué elegirnos?</h2>
            <p className="mt-2 text-white/85 text-[15.5px]">Un servicio personalizado y profesional nos hace diferentes.</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {CIFRAS.map((c) => (
              <div key={c.etiqueta}>
                <p className="flex items-baseline justify-center text-[34px] sm:text-[52px] md:text-[60px] font-semibold leading-none">
                  <NumeroDeslizante valor={c.valor} alEntrar />
                  <span aria-hidden>+</span>
                </p>
                <p className="mt-2 text-[14px] sm:text-[15.5px] first-letter:uppercase">{c.etiqueta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIENDA: el pedido principal de José, que se pueda comprar desde la web */}
      <section className="mx-auto max-w-[1240px] px-4 md:px-6 py-16 md:py-24">
        <TituloCentrado>Tienda online</TituloCentrado>
        <p className="-mt-4 mb-10 text-center text-[16px] text-[#3b4552] max-w-2xl mx-auto">
          Los mismos equipos que instalamos, con precio actualizado. Pagás con Mercado Pago y te llega por Andreani, o lo retirás sin cargo en Undiano 460.
        </p>
        <Vidriera />
        <div className="mt-10 text-center">
          <Link href="/tienda" className="presionable inline-flex h-[50px] items-center px-8 border-2 border-turquesa text-acento font-medium hover:bg-turquesa hover:text-white">
            Ver los 55 productos
          </Link>
        </div>
      </section>

      {/* NUESTRAS OBRAS: grilla de fotos sobre azul marino, como la web actual */}
      <section className="bg-hierro">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 py-16 md:py-20">
          <TituloCentrado claro>Nuestras obras</TituloCentrado>
          <ul className="grid grid-cols-2 lg:grid-cols-4">
            {OBRAS.map((o) => (
              <li key={o.slug}>
                <Link href={`/obras#${o.slug}`} className="group relative block aspect-square overflow-hidden">
                  <Revelar className="absolute inset-0">
                    <Image src={o.img} alt={o.nombre} fill sizes="(max-width: 1024px) 50vw, 310px" className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]" />
                  </Revelar>
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-hierro/90 to-transparent pt-16 pb-4 px-4 text-white">
                    <span className="block text-[16px] md:text-[17px] font-semibold">{o.nombre}</span>
                    <span className="block text-[13.5px] text-white/75">{o.tipo}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link href="/obras" className="presionable inline-flex h-[50px] items-center px-8 border-2 border-turquesa text-white font-medium hover:bg-turquesa">
              Ver todos los proyectos
            </Link>
          </div>
        </div>
      </section>

      {/* PROMOCIONES: las mismas tres tarjetas bancarias de la web actual */}
      <section className="bg-azul">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 py-14 md:py-16 grid md:grid-cols-3 gap-8">
          {PROMOS.map((p) => (
            <article key={p.titulo}>
              <div className="relative aspect-[8/5] bg-white overflow-hidden">
                <Image src={p.img} alt={p.titulo} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
              </div>
              <h3 className="mt-4 text-white text-[17px] font-semibold">{p.titulo}</h3>
              <p className="mt-1 text-white/85 text-[15px]">{p.texto}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
