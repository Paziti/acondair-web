"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Revelado de imagen con clip-path, una sola vez al entrar en pantalla.
// Propósito: en Obras, cada foto aparece como una lámina que se descubre, acompañando la lectura.
export function Revelar({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reducido = useReducedMotion();
  if (reducido) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
    >
      {children}
    </motion.div>
  );
}
