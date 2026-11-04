"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SISTEMAS, GRUPOS } from "@/lib/catalogo";
import { CONTACTO } from "@/data/sitio";
import { useTienda } from "@/lib/tienda-estado";
import { AbiertoAhora } from "./AbiertoAhora";

// mismo orden de menú que la web actual: Principal, La Empresa, Sistemas, Proyectos, Contacto, Tienda
const ANTES = [
  { href: "/", label: "Principal" },
  { href: "/empresa", label: "La Empresa" },
];
const DESPUES = [
  { href: "/obras", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
  { href: "/tienda", label: "Tienda" },
];
const LINKS = [...ANTES, ...DESPUES, { href: "/calculadora", label: "Calculadora" }];

export function Encabezado() {
  const path = usePathname();
  const { carrito, setAbierto, listo } = useTienda();
  const [mega, setMega] = useState(false);
  const [movil, setMovil] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const cant = carrito.reduce((a, x) => a + x.cant, 0);

  useEffect(() => {
    setMega(false);
    setMovil(false);
  }, [path]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(false);
        setMovil(false);
      }
    };
    const fuera = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMega(false);
    };
    document.addEventListener("keydown", esc);
    document.addEventListener("mousedown", fuera);
    return () => {
      document.removeEventListener("keydown", esc);
      document.removeEventListener("mousedown", fuera);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = movil ? "hidden" : "";
  }, [movil]);

  if (path.startsWith("/panel")) return null;
  const activo = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  const grupos = (["calor", "frio", "piscina"] as const).map((g) => ({ g, items: SISTEMAS.filter((s) => s.grupo === g) }));

  return (
    <>
      <div className="hidden md:block bg-papel text-[13px] text-[#3b4552]">
        <div className="mx-auto max-w-[1240px] px-6 h-10 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden><path d="M6 0a5 5 0 0 0-5 5c0 3.6 5 9 5 9s5-5.4 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="currentColor" /></svg>
              {CONTACTO.direccion}, {CONTACTO.ciudad}
            </span>
            <a className="inline-flex items-center gap-1.5 hover:text-acento" href={CONTACTO.telHref}>
              <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor" /></svg>
              {CONTACTO.telefono}
            </a>
            <a className="inline-flex items-center gap-1.5 hover:text-acento" href={`mailto:${CONTACTO.email}`}>
              <svg width="14" height="11" viewBox="0 0 14 11" aria-hidden><path d="M0 0h14v11H0z" fill="currentColor" /><path d="M0 0l7 6 7-6" stroke="#f3f5f8" strokeWidth="1.3" fill="none" /></svg>
              {CONTACTO.email}
            </a>
            <a className="hidden lg:inline hover:text-acento" href={`https://wa.me/${CONTACTO.waNumero}`} target="_blank" rel="noopener">
              WhatsApp {CONTACTO.whatsapp}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden xl:inline"><AbiertoAhora oscuro={false} /></span>
            <a href={CONTACTO.instagram} target="_blank" rel="noopener" aria-label="Instagram de Acondair" className="w-8 h-8 grid place-items-center rounded-full bg-white hover:text-acento">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
            </a>
          </div>
        </div>
      </div>

    <header className="sticky top-0 z-40 bg-white border-b border-chapa">
      <div className="mx-auto max-w-[1240px] px-4 md:px-6 h-[76px] md:h-[96px] flex items-center gap-4">
        <Link href="/" aria-label="Acondair, ir al inicio" className="shrink-0">
          <Image src="/marca/logo.jpg" alt="Acondair Climatización Ambiental" width={394} height={109} priority className="h-12 w-auto md:h-[68px]" />
        </Link>

        <nav aria-label="Principal" className="hidden lg:flex items-center gap-1 ml-auto">
          {ANTES.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={activo(l.href) ? "page" : undefined}
              className={`px-3 py-2 text-[15px] ${activo(l.href) ? "text-turquesa font-semibold" : "text-acero hover:text-acento"}`}
            >
              {l.label}
            </Link>
          ))}
          <div ref={megaRef} className="relative">
            <button
              className={`presionable px-3 py-2 text-[15px] flex items-center gap-1.5 ${path.startsWith("/sistemas") ? "text-turquesa font-semibold" : "text-acero hover:text-acento"}`}
              aria-expanded={mega}
              aria-controls="menu-sistemas"
              onClick={() => setMega((v) => !v)}
            >
              Sistemas
              <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden className={`transition-transform duration-200 ${mega ? "rotate-180" : ""}`}>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" />
              </svg>
            </button>
            <AnimatePresence>
              {mega && (
                <motion.div
                  id="menu-sistemas"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+14px)] w-[760px] bg-white border border-chapa border-t-[3px] border-t-turquesa shadow-[0_12px_30px_rgba(33,48,71,0.12)] p-7 grid grid-cols-3 gap-8"
                >
                  {grupos.map(({ g, items }) => (
                    <div key={g}>
                      <p className={`display text-[15px] mb-3 ${GRUPOS[g].color}`}>{GRUPOS[g].nombre}</p>
                      <ul className="space-y-1">
                        {items.map((s) => (
                          <li key={s.slug}>
                            <Link href={`/sistemas/${s.slug}`} className="block py-1.5 text-[15px] text-hierro hover:text-acento">
                              {s.nombre}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Link href="/sistemas" className="col-span-3 border-t border-chapa pt-4 text-[14.5px] font-medium hover:text-acento">
                    ¿Qué sistema me conviene? Ver la comparación completa
                  </Link>
                  <Link href="/calculadora" className="col-span-3 -mt-5 text-[14.5px] font-medium hover:text-acento">
                    Calcular cuántas kcal o frigorías necesito
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {DESPUES.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={activo(l.href) ? "page" : undefined}
              className={`px-3 py-2 text-[15px] ${activo(l.href) ? "text-turquesa font-semibold" : "text-acero hover:text-acento"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setAbierto(true)}
          className="presionable relative ml-auto lg:ml-3 w-11 h-11 grid place-items-center rounded-full border border-chapa text-acero hover:text-acento hover:border-turquesa"
          aria-label={`Abrir carrito, ${cant} productos`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20.5 8H6.2" />
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="17" cy="20" r="1.4" />
          </svg>
          <motion.span
            key={cant}
            initial={listo ? { scale: 1.35 } : false}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
            className="cifra absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 grid place-items-center rounded-full bg-acento text-white text-[12px] font-bold"
          >
            {cant}
          </motion.span>
        </button>

        <button
          className="presionable lg:hidden w-11 h-11 grid place-items-center border border-chapa"
          aria-label={movil ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={movil}
          onClick={() => setMovil((v) => !v)}
        >
          <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden>
            {movil ? (
              <path d="M3 1l14 12M17 1L3 13" stroke="currentColor" strokeWidth="1.8" />
            ) : (
              <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="1.8" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {movil && (
          <motion.nav
            aria-label="Menú móvil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute inset-x-0 top-full h-[calc(100dvh-77px)] bg-white border-t border-chapa overflow-y-auto px-5 pb-10 pt-4"
          >
            {grupos.map(({ g, items }) => (
              <div key={g} className="py-4 border-b border-chapa">
                <p className={`display text-[15px] mb-2 ${GRUPOS[g].color}`}>{GRUPOS[g].nombre}</p>
                {items.map((s) => (
                  <Link key={s.slug} href={`/sistemas/${s.slug}`} className="block py-2.5 text-[16px]">
                    {s.nombre}
                  </Link>
                ))}
              </div>
            ))}
            <div className="py-3">
              <Link href="/sistemas" className="block py-3 text-[17px] font-medium">
                Comparar sistemas
              </Link>
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="block py-3 text-[17px] font-medium">
                  {l.label}
                </Link>
              ))}
            </div>
            <a href={CONTACTO.telHref} className="mt-4 flex h-12 items-center justify-center border border-hierro font-medium">
              Llamar al {CONTACTO.telefono}
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
    </>
  );
}
