"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTienda } from "@/lib/tienda-estado";

export function Aviso() {
  const { aviso, setAbierto } = useTienda();
  return (
    <div aria-live="polite" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] w-[min(92vw,460px)] pointer-events-none">
      <AnimatePresence>
        {aviso && (
          <motion.div
            key={aviso}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="pointer-events-auto bg-hierro text-white px-4 py-3 flex items-center gap-3 text-[14.5px]"
          >
            <span className="flex-1 line-clamp-2">{aviso}</span>
            {aviso.startsWith("Agregaste") && (
              <button onClick={() => setAbierto(true)} className="shrink-0 underline underline-offset-2 font-medium">
                Ver carrito
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
