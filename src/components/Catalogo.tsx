"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIAS, PRODUCTOS, catSlug } from "@/lib/catalogo";
import { useTienda } from "@/lib/tienda-estado";
import { TarjetaProducto } from "./TarjetaProducto";
import { wa } from "@/data/sitio";

const normal = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function Catalogo() {
  const { precio } = useTienda();
  const [cat, setCat] = useState("Todas");
  const [q, setQ] = useState("");
  const [orden, setOrden] = useState("relevancia");

  // lee ?categoria= y ?q= al entrar, y mantiene la URL compartible
  useEffect(() => {
    const u = new URLSearchParams(window.location.search);
    const c = CATEGORIAS.find((x) => catSlug(x) === u.get("categoria"));
    if (c) setCat(c);
    if (u.get("q")) setQ(u.get("q")!);
  }, []);
  useEffect(() => {
    const u = new URLSearchParams();
    if (cat !== "Todas") u.set("categoria", catSlug(cat));
    if (q) u.set("q", q);
    const s = u.toString();
    window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
  }, [cat, q]);

  const lista = useMemo(() => {
    const terms = normal(q).split(/\s+/).filter(Boolean);
    const l = PRODUCTOS.filter((p) => (cat === "Todas" || p.c.includes(cat)) && terms.every((t) => normal(`${p.n} ${p.b} ${p.c.join(" ")} ${p.sku}`).includes(t)));
    if (orden === "menor") l.sort((a, b) => precio(a) - precio(b));
    if (orden === "mayor") l.sort((a, b) => precio(b) - precio(a));
    if (orden === "az") l.sort((a, b) => a.n.localeCompare(b.n));
    return l;
  }, [cat, q, orden, precio]);

  return (
    <div className="grid lg:grid-cols-[230px_1fr] gap-8 lg:gap-12">
      <aside aria-label="Categorías" className="min-w-0 lg:sticky lg:top-32 self-start">
        <p className="text-[13.5px] font-medium text-acero mb-2 hidden lg:block">Categorías</p>
        <ul className="flex lg:flex-col gap-1.5 lg:gap-0 overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 pb-2 lg:pb-0 [scrollbar-width:none]">
          {["Todas", ...CATEGORIAS].map((c) => {
            const n = c === "Todas" ? PRODUCTOS.length : PRODUCTOS.filter((p) => p.c.includes(c)).length;
            const activa = cat === c;
            return (
              <li key={c} className="shrink-0">
                <button
                  onClick={() => setCat(c)}
                  aria-pressed={activa}
                  className={`w-full text-left flex items-center justify-between gap-3 h-10 lg:h-11 px-3.5 lg:px-0 border lg:border-0 lg:border-b border-chapa text-[15px] transition-colors ${
                    activa ? "bg-hierro text-white border-hierro lg:bg-transparent lg:text-acento lg:font-semibold" : "hover:text-acento"
                  }`}
                >
                  <span className="whitespace-nowrap">{c}</span>
                  <span className={`cifra text-[13px] ${activa ? "lg:text-acento" : "text-acero"}`}>{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <label className="relative flex-1">
            <span className="sr-only">Buscar productos</span>
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-acero" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre, marca o código"
              className="w-full h-12 pl-11 pr-3 border border-chapa bg-white text-[15.5px] focus:border-hierro outline-none"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-[14px] text-acero whitespace-nowrap">Ordenar</span>
            <select value={orden} onChange={(e) => setOrden(e.target.value)} className="h-12 px-3 border border-chapa bg-white text-[15px] focus:border-hierro outline-none">
              <option value="relevancia">Más vendidos</option>
              <option value="menor">Menor precio</option>
              <option value="mayor">Mayor precio</option>
              <option value="az">Nombre A a Z</option>
            </select>
          </label>
        </div>

        <p className="text-[14px] text-acero mb-4" aria-live="polite">
          {lista.length} {lista.length === 1 ? "producto" : "productos"}
          {cat !== "Todas" ? ` en ${cat.toLowerCase()}` : ""}
          {q ? ` para “${q}”` : ""}
        </p>

        {lista.length ? (
          <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {lista.map((p, i) => (
              <li key={p.id}>
                <TarjetaProducto p={p} prioridad={i < 4} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="border border-chapa p-10 text-center">
            <p className="display text-[22px]">No encontramos “{q}”</p>
            <p className="mt-2 text-acero">Probá con otra palabra o preguntanos: muchos repuestos están en el local y todavía no en la web.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button onClick={() => { setQ(""); setCat("Todas"); }} className="presionable h-11 px-5 border border-hierro font-semibold hover:bg-hierro hover:text-white">
                Ver todos los productos
              </button>
              <a href={wa(`Hola Acondair, ¿tienen ${q}?`)} target="_blank" rel="noopener" className="presionable inline-flex h-11 items-center px-5 bg-[#1a8f47] text-white font-semibold hover:bg-[#137038]">
                Preguntar por WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
