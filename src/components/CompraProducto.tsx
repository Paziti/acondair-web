"use client";

import { useEffect, useState } from "react";
import { useTienda } from "@/lib/tienda-estado";
import { dolares, pesos, type Producto } from "@/lib/catalogo";
import { cotizar } from "@/lib/envio";
import { wa } from "@/data/sitio";

export function CompraProducto({ p }: { p: Producto }) {
  const { agregar, setAbierto, precio, precioUsd, dolar, meta, cp, setCp, listo } = useTienda();
  const [cpInput, setCpInput] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  useEffect(() => {
    setCpInput(cp);
  }, [cp]);

  const m = meta[p.id];
  const valor = precio(p);
  const stock = m?.stock ?? 0;
  const cot = cp && m ? cotizar(cp, [{ peso: m.peso, medidas: m.medidas, cantidad: 1 }]) : null;

  const calcular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(cpInput)) {
      setError("El código postal tiene 4 números, por ejemplo 8000.");
      return;
    }
    setError("");
    setCargando(true);
    // simula la demora de la consulta a Andreani
    window.setTimeout(() => {
      setCp(cpInput);
      setCargando(false);
    }, 600);
  };

  return (
    <div>
      <p className="cifra text-[38px] md:text-[44px] font-extrabold leading-none">{pesos(valor)}</p>
      <p className="mt-2 text-[13.5px] text-acero">
        {dolares(precioUsd(p))} al dólar BNA de hoy ({pesos(dolar.valor)})
      </p>
      {valor > 50000 && <p className="mt-2 text-[15px] text-ok">6 cuotas de {pesos(valor / 6)} con Mercado Pago</p>}
      <p className="mt-3 text-[14.5px]">
        {!listo ? " " : stock === 0 ? <span className="text-error font-medium">Sin stock por ahora</span> : stock <= 2 ? <span className="text-aviso font-medium">Quedan {stock} unidades</span> : <span className="text-ok font-medium">En stock</span>}
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => {
            agregar(p.id);
            setAbierto(true);
          }}
          disabled={stock === 0}
          className="presionable flex-1 h-[54px] bg-acento text-white font-semibold text-[16px] hover:bg-acento-oscuro disabled:bg-chapa disabled:text-acero"
        >
          Agregar al carrito
        </button>
        <a href={wa(`Hola Acondair! Consulta por ${p.n}: ¿incluye instalación en mi casa?`)} target="_blank" rel="noopener" className="presionable flex-1 h-[54px] inline-flex items-center justify-center border border-hierro font-semibold hover:bg-hierro hover:text-white">
          Consultar instalación
        </a>
      </div>

      <div className="mt-8 placa p-5">
        <span className="remaches" />
        <form onSubmit={calcular}>
          <label htmlFor="cp-producto" className="block text-[14.5px] font-semibold mb-2">
            Calculá el envío
          </label>
          <div className="flex gap-2">
            <input
              id="cp-producto"
              inputMode="numeric"
              maxLength={4}
              value={cpInput}
              onChange={(e) => setCpInput(e.target.value.replace(/\D/g, ""))}
              placeholder="Código postal"
              aria-describedby={error ? "cp-error" : undefined}
              className="flex-1 min-w-0 h-11 px-3 border border-chapa focus:border-hierro outline-none"
            />
            <button disabled={cargando} className="presionable h-11 px-4 bg-hierro text-white font-semibold hover:bg-black disabled:opacity-60">
              {cargando ? "Consultando…" : "Calcular"}
            </button>
          </div>
        </form>
        {error && (
          <p id="cp-error" className="mt-2 text-[14px] text-error">
            {error}
          </p>
        )}
        {cot && !cargando && (
          <dl className="mt-4 text-[14.5px] divide-y divide-chapa border-t border-chapa">
            <div className="flex justify-between gap-3 py-2.5">
              <dt>
                Andreani a domicilio
                <span className="block text-[13px] text-acero">
                  {cot.zona.nombre}, {cot.zona.plazo}
                </span>
              </dt>
              <dd className="cifra font-semibold">{pesos(cot.domicilio)}</dd>
            </div>
            <div className="flex justify-between gap-3 py-2.5">
              <dt>Andreani a sucursal</dt>
              <dd className="cifra font-semibold">{pesos(cot.sucursal)}</dd>
            </div>
            <div className="flex justify-between gap-3 py-2.5">
              <dt>Retiro en Undiano 460</dt>
              <dd className="text-ok font-semibold">Sin cargo</dd>
            </div>
          </dl>
        )}
        <p className="mt-3 text-[12.5px] text-acero">Demo: tarifas simuladas. En la web real se cotizan en vivo con Andreani.</p>
      </div>
    </div>
  );
}
