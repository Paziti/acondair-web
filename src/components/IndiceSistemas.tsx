"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { SISTEMAS, type Sistema } from "@/lib/catalogo";

// Lista tipográfica de sistemas. En compu, al pasar el mouse, una foto del sistema sigue al cursor
// (propósito: ver cómo es cada sistema sin salir de la lista). En celular, miniatura fija.
export function IndiceSistemas() {
  const zona = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState<Sistema | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  const mover = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !zona.current) return;
    const r = zona.current.getBoundingClientRect();
    x.set(e.clientX - r.left + 48);
    y.set(e.clientY - r.top - 200);
  };

  const columnas = [
    { titulo: "Calor", grupo: ["calor"], color: "text-acento", linea: "bg-acento" },
    { titulo: "Frío y piscinas", grupo: ["frio", "piscina"], color: "text-azul", linea: "bg-azul" },
  ];

  return (
    <div ref={zona} className="relative" onPointerMove={mover} onPointerLeave={() => setActivo(null)}>
      <div className="grid md:grid-cols-2 gap-x-14 gap-y-12">
        {columnas.map((col) => (
          <div key={col.titulo}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`display text-[15px] ${col.color}`}>{col.titulo}</span>
              <span aria-hidden className={`h-[2px] flex-1 ${col.linea}`} />
            </div>
            <ul>
              {SISTEMAS.filter((s) => col.grupo.includes(s.grupo)).map((s) => (
                <li key={s.slug} className="border-b border-chapa">
                  <Link
                    href={`/sistemas/${s.slug}`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActivo(s)}
                    onFocus={() => setActivo(null)}
                    className="group flex items-center gap-4 py-4 md:py-5"
                  >
                    <span className="md:hidden w-14 h-14 shrink-0 bg-papel grid place-items-center overflow-hidden">
                      <Image src={s.imgs[0]} alt="" width={56} height={56} className="object-contain" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="display block text-[22px] md:text-[30px] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] md:group-hover:translate-x-2">{s.nombre}</span>
                      <span className="block mt-1 text-[14.5px] text-acero leading-snug max-w-md">{s.resumen}</span>
                    </span>
                    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className={`shrink-0 ${col.color} opacity-60 group-hover:opacity-100 transition-opacity`}>
                      <path d="M3 9h11M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" fill="none" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activo && (
          <motion.div
            aria-hidden
            className="hidden md:block pointer-events-none absolute left-0 top-0 z-20 w-[260px] h-[180px] bg-white border border-hierro p-3"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={activo.slug} className="relative w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <Image src={activo.imgs[0]} alt="" fill sizes="260px" className="object-contain" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
