import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Articulo } from "@/components/Articulo";
import { TarjetaProducto } from "@/components/TarjetaProducto";
import { GRUPOS, PRODUCTOS, SISTEMAS, sistemaPorSlug } from "@/lib/catalogo";
import { wa } from "@/data/sitio";

export function generateStaticParams() {
  return SISTEMAS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sistemas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = sistemaPorSlug(slug);
  if (!s) return {};
  return { title: `${s.nombre} en Bahía Blanca`, description: s.resumen, alternates: { canonical: `/sistemas/${s.slug}` } };
}

export default async function PaginaSistema({ params }: PageProps<"/sistemas/[slug]">) {
  const { slug } = await params;
  const s = sistemaPorSlug(slug);
  if (!s) notFound();
  const grupo = GRUPOS[s.grupo];
  const productos = PRODUCTOS.filter((p) => s.cats.some((c) => p.c.includes(c))).slice(0, 4);
  const hermanos = SISTEMAS.filter((x) => x.grupo === s.grupo && x.slug !== s.slug);
  const esCalor = s.grupo === "calor";

  return (
    <>
      <section className="mx-auto max-w-[1240px] px-4 md:px-6 pt-8 md:pt-12 pb-12">
        <nav aria-label="Ruta" className="text-[14px] text-acero mb-8">
          <Link href="/sistemas" className="hover:text-hierro underline underline-offset-2">
            Sistemas
          </Link>
          <span className="mx-2">/</span>
          <span className={grupo.color}>{grupo.nombre}</span>
        </nav>
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-end">
          <div>
            <h1 className="display text-[40px] sm:text-[52px] md:text-[64px]">{s.nombre}</h1>
            <p className="mt-5 text-[19px] leading-relaxed text-[#3b4552] max-w-xl">{s.resumen}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={wa(`Hola Acondair, quiero asesoramiento sobre ${s.nombre.toLowerCase()}`)}
                target="_blank"
                rel="noopener"
                className={`presionable inline-flex h-[52px] items-center px-7 text-white font-semibold ${esCalor ? "bg-acento hover:bg-acento-oscuro" : "bg-azul hover:bg-[#164a86]"}`}
              >
                Pedir asesoramiento
              </a>
              {productos.length > 0 && (
                <a href="#productos" className="presionable inline-flex h-[52px] items-center px-7 border border-hierro font-semibold hover:bg-hierro hover:text-white">
                  Ver equipos en la tienda
                </a>
              )}
            </div>
          </div>
          <figure className="placa p-6">
            <span className="remaches" />
            <div className="relative aspect-[16/10]">
              <Image src={s.imgs[0]} alt={`${s.nombre}: imagen ilustrativa`} fill priority sizes="(max-width: 1024px) 100vw, 520px" className="object-contain" />
            </div>
          </figure>
        </div>
      </section>

      <div aria-hidden className={`h-[3px] ${esCalor ? "bg-acento" : "bg-azul"}`} />

      <section className="mx-auto max-w-[1240px] px-4 md:px-6 py-14 md:py-20 grid lg:grid-cols-[1fr_300px] gap-12 lg:gap-20">
        <article>
          <Articulo bloques={s.blocks} />
          {s.imgs.slice(1).map((src) => (
            <figure key={src} className="my-10 border border-chapa p-4 max-w-[68ch]">
              <div className="relative aspect-[16/8]">
                <Image src={src} alt={`${s.nombre}: esquema`} fill sizes="680px" className="object-contain" />
              </div>
            </figure>
          ))}
        </article>
        <aside className="lg:sticky lg:top-32 self-start space-y-8">
          <div className="placa p-6">
            <span className="remaches" />
            <p className="display text-[18px]">¿Es para tu casa?</p>
            <p className="mt-2 text-[15px] leading-relaxed text-[#3b4552]">Calculamos la carga térmica de cada ambiente antes de recomendarte un equipo.</p>
            <Link href="/calculadora" className="mt-4 block text-[15px] font-semibold underline underline-offset-4 decoration-acento decoration-2 hover:text-acento">
              Probar la calculadora
            </Link>
          </div>
          {hermanos.length > 0 && (
            <div>
              <p className="text-[14px] font-semibold text-acero mb-2">Otros sistemas de {grupo.nombre.toLowerCase()}</p>
              <ul className="border-t border-chapa">
                {hermanos.map((h) => (
                  <li key={h.slug} className="border-b border-chapa">
                    <Link href={`/sistemas/${h.slug}`} className="block py-3 text-[15.5px] hover:text-acento">
                      {h.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      {productos.length > 0 && (
        <section id="productos" className="bg-papel">
          <div className="mx-auto max-w-[1240px] px-4 md:px-6 py-16 md:py-20">
            <h2 className="display text-[28px] md:text-[36px] mb-8">Equipos para {s.nombre.toLowerCase()}</h2>
            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {productos.map((p) => (
                <li key={p.id}>
                  <TarjetaProducto p={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
