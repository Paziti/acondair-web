"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useState } from "react";
import { NumeroDeslizante } from "./NumeroDeslizante";

type Cifra = { valor: number; etiqueta: string; nota?: string };

const EASE = [0.23, 1, 0.32, 1] as const;

// Corrientes de aire: ondas finas que se desplazan despacio, como el flujo de un equipo.
// Cada trazo es una onda de 2 períodos repetida; se mueve medio ancho y vuelve a empezar sin salto.
function Corrientes({ quieto }: { quieto: boolean }) {
  const onda = (y: number, amp: number) => {
    let d = `M0 ${y}`;
    for (let i = 0; i < 4; i++) {
      const x = i * 300;
      d += ` C${x + 75} ${y - amp} ${x + 225} ${y + amp} ${x + 300} ${y}`;
    }
    return d;
  };
  const trazos = [
    { y: 70, amp: 18, dur: 26, op: 0.16, ancho: 1.5 },
    { y: 130, amp: 26, dur: 34, op: 0.1, ancho: 1 },
    { y: 190, amp: 14, dur: 22, op: 0.13, ancho: 1.25 },
    { y: 250, amp: 22, dur: 40, op: 0.08, ancho: 1 },
  ];
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 600 320" preserveAspectRatio="none">
      {trazos.map((t, i) => (
        <motion.path
          key={i}
          d={onda(t.y, t.amp)}
          fill="none"
          stroke="white"
          strokeOpacity={t.op}
          strokeWidth={t.ancho}
          vectorEffect="non-scaling-stroke"
          animate={quieto ? undefined : { x: i % 2 ? [0, -600] : [-600, 0] }}
          transition={{ duration: t.dur, ease: "linear", repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

function CifraAnimada({ c, i, quieto }: { c: Cifra; i: number; quieto: boolean }) {
  const [lista, setLista] = useState(false);
  return (
    <motion.div
      initial={quieto ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.15 }}
    >
      <p className="flex items-baseline justify-center text-[48px] sm:text-[40px] md:text-[50px] lg:text-[44px] xl:text-[52px] font-semibold leading-none">
        <NumeroDeslizante valor={c.valor} alEntrar retraso={250 + i * 250} alTerminar={() => setLista(true)} />
        <motion.span
          aria-hidden
          className="inline-block"
          initial={false}
          animate={lista || quieto ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", duration: 0.45, bounce: 0.45 }}
        >
          +
        </motion.span>
      </p>
      <motion.span
        aria-hidden
        className="mx-auto mt-3 block h-[3px] w-10 origin-center bg-white/70"
        initial={false}
        animate={{ scaleX: lista || quieto ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      />
      <p className="mt-3 text-[14px] sm:text-[15.5px] font-medium first-letter:uppercase">{c.etiqueta}</p>
      {c.nota && <p className="mt-1 text-[13px] text-white">{c.nota}</p>}
    </motion.div>
  );
}

export function PorQueElegirnos({ cifras }: { cifras: Cifra[] }) {
  const quieto = !!useReducedMotion();

  // luz que sigue al mouse (solo con puntero fino, en compu)
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const x = useSpring(mx, { stiffness: 140, damping: 22, mass: 0.6 });
  const y = useSpring(my, { stiffness: 140, damping: 22, mass: 0.6 });
  const luz = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgba(255,255,255,0.14), transparent 70%)`;
  const [encima, setEncima] = useState(false);

  return (
    <section
      className="relative overflow-hidden bg-azul text-white"
      onPointerMove={(e) => {
        if (quieto || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setEncima(true)}
      onPointerLeave={() => setEncima(false)}
    >
      <Corrientes quieto={quieto} />
      {!quieto && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: luz }}
          animate={{ opacity: encima ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
      )}

      <div className="relative mx-auto max-w-[1240px] px-4 md:px-6 py-14 md:py-16 grid lg:grid-cols-[1fr_2fr] gap-10 items-center">
        <motion.div
          initial={quieto ? false : { opacity: 0, x: -20, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <h2 className="text-[26px] md:text-[30px] font-semibold">¿Por qué elegirnos?</h2>
          <p className="mt-2 text-white/85 text-[15.5px]">Un servicio personalizado y profesional nos hace diferentes.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 text-center">
          {cifras.map((c, i) => (
            <CifraAnimada key={c.etiqueta} c={c} i={i} quieto={quieto} />
          ))}
        </div>
      </div>
    </section>
  );
}
