import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompraProducto } from "@/components/CompraProducto";
import { TarjetaProducto } from "@/components/TarjetaProducto";
import { PRODUCTOS, SISTEMAS, catSlug, pesos, productoPorSlug } from "@/lib/catalogo";

export function generateStaticParams() {
  return PRODUCTOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tienda/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = productoPorSlug(slug);
  if (!p) return {};
  return {
    title: p.n,
    description: `${p.n} a ${pesos(p.p)}. ${p.desc.slice(0, 120)}`,
    alternates: { canonical: `/tienda/${p.slug}` },
    openGraph: { images: [p.img] },
  };
}

export default async function PaginaProducto({ params }: PageProps<"/tienda/[slug]">) {
  const { slug } = await params;
  const p = productoPorSlug(slug);
  if (!p) notFound();
  const relacionados = PRODUCTOS.filter((x) => x.id !== p.id && x.c.some((c) => p.c.includes(c))).slice(0, 4);
  const sistema = SISTEMAS.find((s) => s.cats.includes(p.c[0]));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.n,
    image: `https://www.acondair.com.ar${p.img}`,
    sku: p.sku || undefined,
    brand: p.b ? { "@type": "Brand", name: p.b } : undefined,
    description: p.desc,
    offers: { "@type": "Offer", priceCurrency: "ARS", price: p.p, availability: "https://schema.org/InStock", url: `https://www.acondair.com.ar/tienda/${p.slug}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto max-w-[1240px] px-4 md:px-6 pt-8 pb-16">
        <nav aria-label="Ruta" className="text-[14px] text-acero mb-8">
          <Link href="/tienda" className="underline underline-offset-2 hover:text-hierro">
            Tienda
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/tienda?categoria=${catSlug(p.c[0])}`} className="underline underline-offset-2 hover:text-hierro">
            {p.c[0]}
          </Link>
        </nav>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="relative aspect-square bg-papel">
            <Image src={p.img} alt={p.n} fill priority sizes="(max-width: 1024px) 100vw, 600px" className="object-contain p-10 mix-blend-multiply" />
          </div>
          <div>
            {p.b && <p className="text-[14px] font-semibold text-acero">{p.b}</p>}
            <h1 className="display text-[30px] md:text-[40px] mt-1">{p.n}</h1>
            <div className="mt-6">
              <CompraProducto p={p} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-chapa">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 py-14 grid lg:grid-cols-[1.3fr_0.7fr] gap-10 lg:gap-16">
          <div>
            <h2 className="display text-[24px] mb-4">Descripción</h2>
            <p className="text-[16.5px] leading-relaxed text-[#3b4552] max-w-[68ch]">{p.desc || "Consultanos por las especificaciones técnicas de este producto."}</p>
            {sistema && (
              <p className="mt-6 text-[15.5px]">
                ¿Cómo funciona este sistema?{" "}
                <Link href={`/sistemas/${sistema.slug}`} className="font-semibold underline underline-offset-4 decoration-acento decoration-2 hover:text-acento">
                  Leer sobre {sistema.nombre.toLowerCase()}
                </Link>
              </p>
            )}
          </div>
          <div className="placa p-6 self-start">
            <span className="remaches" />
            <h2 className="display text-[18px] mb-3">Datos</h2>
            <dl className="text-[14.5px] divide-y divide-chapa">
              {p.sku && (
                <div className="flex justify-between py-2">
                  <dt className="text-acero">Código</dt>
                  <dd className="cifra">{p.sku}</dd>
                </div>
              )}
              <div className="flex justify-between py-2">
                <dt className="text-acero">Categoría</dt>
                <dd>{p.c.join(", ")}</dd>
              </div>
              {p.b && (
                <div className="flex justify-between py-2">
                  <dt className="text-acero">Marca</dt>
                  <dd>{p.b}</dd>
                </div>
              )}
              <div className="flex justify-between py-2">
                <dt className="text-acero">Garantía</dt>
                <dd>Oficial, atendida por Acondair</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="bg-papel">
          <div className="mx-auto max-w-[1240px] px-4 md:px-6 py-14">
            <h2 className="display text-[26px] md:text-[32px] mb-8">También en {p.c[0].toLowerCase()}</h2>
            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {relacionados.map((x) => (
                <li key={x.id}>
                  <TarjetaProducto p={x} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
