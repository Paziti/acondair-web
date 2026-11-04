"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { PRODUCTOS, catSlug } from "@/lib/catalogo";
import { TarjetaProducto } from "./TarjetaProducto";

const PESTANAS = ["Calderas", "Aires Acondicionados", "Radiadores", "Calefones", "Climatizadores de piscina"];

// Vista previa de la tienda en la portada: pestañas por categoría y carril horizontal.
export function Vidriera() {
  const [cat, setCat] = useState(PESTANAS[0]);
  const lista = PRODUCTOS.filter((p) => p.c.includes(cat)).slice(0, 8);
  return (
    <div>
      <div role="tablist" aria-label="Categorías" className="flex gap-1 overflow-x-auto border-b border-chapa -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none]">
        {PESTANAS.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            aria-controls="vidriera-panel"
            onClick={() => setCat(c)}
            className={`relative shrink-0 h-12 px-4 text-[15px] font-medium transition-colors ${cat === c ? "text-hierro" : "text-acero hover:text-hierro"}`}
          >
            {c}
            {cat === c && <motion.span layoutId="vidriera-linea" className="absolute left-0 right-0 -bottom-px h-[3px] bg-acento" transition={{ duration: 0.3, ease: [0.77, 0, 0.175, 1] }} />}
          </button>
        ))}
      </div>
      <div id="vidriera-panel" role="tabpanel" className="mt-6 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto snap-x snap-mandatory [scrollbar-width:thin]">
        <ul className="flex gap-3 md:gap-4 pb-4">
          {lista.map((p) => (
            <li key={p.id} className="snap-start shrink-0 w-[68%] sm:w-[40%] md:w-[calc((100%-3*16px)/4)]">
              <TarjetaProducto p={p} />
            </li>
          ))}
        </ul>
      </div>
      <Link href={`/tienda?categoria=${catSlug(cat)}`} className="mt-2 inline-flex items-center gap-2 text-[15px] font-semibold underline underline-offset-4 decoration-acento decoration-2 hover:text-acento">
        Ver todo en {cat.toLowerCase()} ({PRODUCTOS.filter((p) => p.c.includes(cat)).length})
      </Link>
    </div>
  );
}
