"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTienda, bultosDe } from "@/lib/tienda-estado";
import { productoPorId, pesos } from "@/lib/catalogo";
import { cotizar } from "@/lib/envio";

export function CarritoLateral() {
  const { abierto, setAbierto, carrito, cambiar, quitar, precio, meta, cp, setCp } = useTienda();
  const [cpInput, setCpInput] = useState("");
  const [error, setError] = useState("");
  const cerrarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setCpInput(cp);
  }, [cp]);
  useEffect(() => {
    if (!abierto) return;
    cerrarRef.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [abierto, setAbierto]);

  const items = carrito.map((it) => ({ ...it, p: productoPorId(it.id)! })).filter((x) => x.p);
  const subtotal = items.reduce((a, x) => a + precio(x.p) * x.cant, 0);
  const cot = cp && items.length ? cotizar(cp, bultosDe(carrito, meta)) : null;

  const calcular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(cpInput)) {
      setError("El código postal tiene 4 números, por ejemplo 8000.");
      return;
    }
    setError("");
    setCp(cpInput);
  };

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-hierro/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setAbierto(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito"
            className="fixed top-0 right-0 z-[61] h-dvh w-full max-w-[440px] bg-white flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%", transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-chapa">
              <h2 className="display text-xl">Tu carrito</h2>
              <button ref={cerrarRef} onClick={() => setAbierto(false)} className="presionable w-11 h-11 grid place-items-center hover:bg-papel" aria-label="Cerrar carrito">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                  <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 grid place-items-center px-8 text-center">
                <div>
                  <p className="display text-2xl mb-2">Todavía no agregaste nada</p>
                  <p className="text-acero mb-6">Buscá calderas, aires, radiadores y repuestos en la tienda.</p>
                  <Link href="/tienda" onClick={() => setAbierto(false)} className="presionable inline-flex h-12 items-center px-6 bg-hierro text-white font-medium hover:bg-black">
                    Ir a la tienda
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-5">
                  {items.map(({ p, cant, id }) => (
                    <li key={id} className="flex gap-3 py-4 border-b border-chapa">
                      <div className="w-[72px] h-[72px] shrink-0 bg-papel grid place-items-center">
                        <Image src={p.img} alt="" width={72} height={72} className="object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/tienda/${p.slug}`} onClick={() => setAbierto(false)} className="text-[14.5px] leading-snug hover:text-acento">
                          {p.n}
                        </Link>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="flex items-center border border-chapa">
                            <button className="w-9 h-9 hover:bg-papel" onClick={() => cambiar(id, -1)} aria-label={`Quitar una unidad de ${p.n}`}>
                              −
                            </button>
                            <span className="cifra w-8 text-center text-sm" aria-live="polite">
                              {cant}
                            </span>
                            <button className="w-9 h-9 hover:bg-papel" onClick={() => cambiar(id, 1)} aria-label={`Sumar una unidad de ${p.n}`}>
                              +
                            </button>
                          </div>
                          <span className="cifra font-bold">{pesos(precio(p) * cant)}</span>
                        </div>
                        <button className="mt-1 text-[13px] text-acero underline underline-offset-2 hover:text-hierro" onClick={() => quitar(id)}>
                          Quitar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-chapa bg-papel px-5 py-4">
                  <form onSubmit={calcular} className="flex gap-2">
                    <label htmlFor="cp-carrito" className="sr-only">
                      Código postal
                    </label>
                    <input
                      id="cp-carrito"
                      inputMode="numeric"
                      maxLength={4}
                      value={cpInput}
                      onChange={(e) => setCpInput(e.target.value.replace(/\D/g, ""))}
                      placeholder="Tu código postal"
                      className="flex-1 h-11 px-3 border border-chapa bg-white focus:border-hierro outline-none"
                    />
                    <button className="presionable h-11 px-4 border border-hierro bg-white font-medium hover:bg-hierro hover:text-white">Calcular envío</button>
                  </form>
                  {error && <p className="mt-2 text-sm text-error">{error}</p>}
                  {cot && (
                    <dl className="mt-3 text-[14px] space-y-1">
                      <div className="flex justify-between">
                        <dt>Andreani a domicilio, {cot.zona.nombre}</dt>
                        <dd className="cifra">{pesos(cot.domicilio)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Retiro en Undiano 460</dt>
                        <dd className="text-ok font-medium">Sin cargo</dd>
                      </div>
                    </dl>
                  )}
                  <div className="mt-4 flex justify-between items-baseline">
                    <span className="text-acero">Subtotal</span>
                    <span className="cifra text-2xl font-bold">{pesos(subtotal)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setAbierto(false)}
                    className="presionable mt-3 flex h-[52px] items-center justify-center bg-acento text-white font-semibold text-[16px] hover:bg-acento-oscuro"
                  >
                    Finalizar compra
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
