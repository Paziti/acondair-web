"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Dígitos que ruedan como un contador mecánico. Propósito: mostrar que el número
// cambió por la acción del usuario (o, una sola vez, al entrar en pantalla).
function Columna({ digito, instantaneo }: { digito: number; instantaneo: boolean }) {
  return (
    <span className="relative inline-block overflow-hidden h-[1em] leading-none align-baseline" style={{ width: "0.62em" }}>
      <motion.span
        className="absolute left-0 top-0 flex flex-col w-full"
        initial={false}
        animate={{ y: `${-digito * 10}%` }}
        transition={instantaneo ? { duration: 0 } : { type: "spring", duration: 0.7, bounce: 0.12 }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          // el dígito se dibuja por CSS: así no queda en el texto copiado ni lo indexa Google
          <span key={i} data-d={i} className="h-[1em] leading-none text-center before:content-[attr(data-d)]" />
        ))}
      </motion.span>
    </span>
  );
}

export function NumeroDeslizante({ valor, alEntrar = false, className = "" }: { valor: number; alEntrar?: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visto = useInView(ref, { once: true, margin: "-10% 0px" });
  const reducido = useReducedMotion();
  const [mostrado, setMostrado] = useState(alEntrar ? 0 : valor);

  useEffect(() => {
    if (!alEntrar || visto) setMostrado(valor);
  }, [valor, visto, alEntrar]);

  const texto = Math.round(mostrado).toLocaleString("es-AR");
  const largoFinal = Math.round(valor).toLocaleString("es-AR").length;
  const relleno = texto.padStart(largoFinal, " ");

  return (
    <span ref={ref} className={`cifra inline-flex items-baseline ${className}`}>
      <span className="sr-only">{Math.round(valor).toLocaleString("es-AR")}</span>
      <span aria-hidden className="inline-flex items-baseline select-none">
        {relleno.split("").map((ch, i) => {
          const clave = relleno.length - i;
          if (ch === " ") return <span key={clave} style={{ width: "0.62em" }} />;
          if (!/\d/.test(ch))
            return (
              <span key={clave} data-d={ch} className="self-start h-[1em] leading-none before:content-[attr(data-d)]" />
            );
          return <Columna key={clave} digito={Number(ch)} instantaneo={!!reducido} />;
        })}
      </span>
    </span>
  );
}
