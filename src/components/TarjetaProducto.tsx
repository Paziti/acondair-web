"use client";

import Image from "next/image";
import Link from "next/link";
import { useTienda } from "@/lib/tienda-estado";
import { pesos, type Producto } from "@/lib/catalogo";

export function TarjetaProducto({ p, prioridad = false }: { p: Producto; prioridad?: boolean }) {
  const { agregar, precio, meta } = useTienda();
  const valor = precio(p);
  const sinStock = meta[p.id]?.stock === 0;
  return (
    <article className="group flex flex-col bg-white border border-chapa hover:border-hierro transition-colors duration-150 h-full">
      <Link href={`/tienda/${p.slug}`} className="relative block aspect-square bg-papel overflow-hidden" tabIndex={-1} aria-hidden>
        <Image
          src={p.img}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
          priority={prioridad}
          className="object-contain p-5 mix-blend-multiply transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
        />
      </Link>
      <div className="flex flex-col flex-1 p-3.5 md:p-4">
        <span className="text-[12.5px] font-semibold text-acero">{p.b || p.c[0]}</span>
        <h3 className="mt-1 text-[14.5px] md:text-[15px] leading-snug font-medium">
          <Link href={`/tienda/${p.slug}`} className="hover:text-acento">
            {p.n}
          </Link>
        </h3>
        <div className="mt-auto pt-3">
          <p className="cifra text-[19px] md:text-[21px] font-bold">{pesos(valor)}</p>
          <p className="text-[12.5px] text-ok min-h-[1.2em]">{valor > 50000 ? `6 cuotas de ${pesos(valor / 6)}` : ""}</p>
          <button
            onClick={() => agregar(p.id)}
            disabled={sinStock}
            className="presionable mt-3 w-full h-11 bg-hierro text-white text-[14.5px] font-semibold hover:bg-black disabled:bg-chapa disabled:text-acero disabled:cursor-not-allowed"
          >
            {sinStock ? "Sin stock" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </article>
  );
}
