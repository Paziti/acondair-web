"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Las tres diapositivas de la web actual, con las mismas fotos.
const DIAPOSITIVAS = [
  {
    titulo: "Calefacción por radiadores",
    texto: "Solución integral del proyecto: asesoramiento, cálculo de balance térmico, provisión de calderas, radiadores, termostatos y cañerías.",
    img: "/actual/Slider1.jpg",
    href: "/sistemas/radiadores",
  },
  {
    titulo: "Piso radiante",
    texto: "Solución integral del proyecto: asesoramiento, cálculo de balance térmico, provisión de calderas, colectores, termostatos y cañerías.",
    img: "/actual/Slider2.jpg",
    href: "/sistemas/piso-radiante",
  },
  {
    titulo: "Climatización de piscinas",
    texto: "Climatizadores a gas e intercambiadores de calor para piscinas cubiertas y descubiertas, con el cálculo de la pileta incluido.",
    img: "/actual/Slider3.jpg",
    href: "/sistemas/climatizadores-a-gas",
  },
];

const INTERVALO = 7000;

export function SliderPrincipal() {
  const [i, setI] = useState(0);
  const [pausa, setPausa] = useState(false);
  const reducir = useReducedMotion();
  const d = DIAPOSITIVAS[i];

  useEffect(() => {
    if (pausa || reducir) return;
    const t = window.setTimeout(() => setI((x) => (x + 1) % DIAPOSITIVAS.length), INTERVALO);
    return () => window.clearTimeout(t);
  }, [i, pausa, reducir]);

  const ir = (n: number) => setI((n + DIAPOSITIVAS.length) % DIAPOSITIVAS.length);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Sistemas destacados"
      className="relative overflow-hidden bg-papel"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={() => setPausa(false)}
    >
      <div className="relative h-[600px] sm:h-[560px] lg:h-[580px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={d.img}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducir ? 0 : 0.7, ease: [0.77, 0, 0.175, 1] }}
          >
            <Image
              src={d.img}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-[70%_center] sm:object-right"
            />
            {/* aclara el lado del texto para que se lea sobre cualquier foto */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/50 sm:via-white/60 sm:to-white/0" />
          </motion.div>
        </AnimatePresence>

        <div className="relative h-full mx-auto max-w-[1240px] px-4 md:px-6 flex items-center pb-16">
          <div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={d.titulo}
              className="max-w-[560px]"
              initial={reducir ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
            >
              {i === 0 ? (
                <h1 className="text-[34px] sm:text-[46px] lg:text-[54px] leading-[1.1] font-medium uppercase text-[#3b4552]">{d.titulo}</h1>
              ) : (
                <h2 className="text-[34px] sm:text-[46px] lg:text-[54px] leading-[1.1] font-medium uppercase text-[#3b4552]">{d.titulo}</h2>
              )}
              <p className="mt-5 text-[16px] sm:text-[17px] leading-relaxed text-[#3b4552] max-w-[480px]">{d.texto}</p>
              <Link
                href={d.href}
                className="presionable mt-8 inline-flex h-[50px] items-center px-7 border-2 border-turquesa text-acento text-[17px] font-medium hover:bg-turquesa hover:text-white"
              >
                Más información
              </Link>
            </motion.div>
          </AnimatePresence>
            <div className="mt-8 flex items-center gap-3">
            <button onClick={() => ir(i - 1)} aria-label="Diapositiva anterior" className="presionable w-11 h-11 grid place-items-center rounded-full bg-white/90 border border-chapa hover:border-turquesa hover:text-acento">
              <svg width="8" height="14" viewBox="0 0 8 14" aria-hidden>
                <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.8" fill="none" />
              </svg>
            </button>
            <div className="flex items-center gap-1">
              {DIAPOSITIVAS.map((x, n) => (
                <button key={x.titulo} onClick={() => setI(n)} aria-label={`Ver ${x.titulo}`} aria-current={n === i} className="w-11 h-11 grid place-items-center">
                  <span className={`block h-[3px] transition-all duration-300 ${n === i ? "w-8 bg-turquesa" : "w-4 bg-acero/40"}`} />
                </button>
              ))}
            </div>
            <button onClick={() => ir(i + 1)} aria-label="Diapositiva siguiente" className="presionable w-11 h-11 grid place-items-center rounded-full bg-white/90 border border-chapa hover:border-turquesa hover:text-acento">
              <svg width="8" height="14" viewBox="0 0 8 14" aria-hidden>
                <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.8" fill="none" />
              </svg>
            </button>
          </div>
          </div>
        </div>

      </div>
    </section>
  );
}
