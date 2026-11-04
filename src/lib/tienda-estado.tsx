"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DOLAR_BASE, PRODUCTOS, productoPorId, type Producto } from "./catalogo";

// Demo: el carrito, los pedidos y los cambios del panel viven en localStorage.
// En producción esto pasa a una base de datos (Supabase/Postgres) y a la API de Mercado Pago y Andreani.

export type ItemCarrito = { id: number; cant: number };
// usd: precio de lista en dólares cuando se cambió desde el panel (si no, el de catálogo)
export type MetaProducto = { usd?: number; stock: number; peso: number; medidas: number[]; confirmado: boolean };
export type Pedido = {
  nro: number;
  fecha: string;
  cliente: { nombre: string; dni: string; email: string; tel: string; calle: string; ciudad: string; cp: string };
  items: ItemCarrito[];
  subtotal: number;
  envio: { tipo: "domicilio" | "sucursal" | "instalacion" | "retiro"; nombre: string; precio: number; kg?: number };
  pago: "mercadopago" | "transferencia" | "local";
  estado: "Pagado" | "Pendiente de pago";
};

// Dólar Banco Nación venta. En la demo se lee de dolarapi.com cada 10 minutos;
// en producción lo escribe el módulo de José que hoy ya lo toma del BNA y lo pisa en el ERP y en la web.
export type Dolar = { valor: number; actualizado: string; fuente: "bna" | "manual" | "base" };
const DOLAR_INICIAL: Dolar = { valor: DOLAR_BASE, actualizado: "2026-11-04T18:00:00.000Z", fuente: "base" };
const DIEZ_MINUTOS = 10 * 60 * 1000;

const leer = <T,>(k: string, def: T): T => {
  try {
    const v = localStorage.getItem("acondair_" + k);
    return v ? (JSON.parse(v) as T) : def;
  } catch {
    return def;
  }
};
const guardar = (k: string, v: unknown) => {
  try {
    localStorage.setItem("acondair_" + k, JSON.stringify(v));
  } catch {}
};

const metaInicial = (): Record<number, MetaProducto> =>
  Object.fromEntries(
    PRODUCTOS.map((p) => [
      p.id,
      {
        stock: p.c.includes("Aires Acondicionados") ? 4 : p.c.includes("Calderas") ? 3 : 12,
        peso: p.w,
        medidas: [...p.d],
        confirmado: false,
      },
    ]),
  );

type Ctx = {
  listo: boolean;
  carrito: ItemCarrito[];
  agregar: (id: number) => void;
  cambiar: (id: number, delta: number) => void;
  quitar: (id: number) => void;
  vaciar: () => void;
  abierto: boolean;
  setAbierto: (v: boolean) => void;
  meta: Record<number, MetaProducto>;
  setMeta: (id: number, cambios: Partial<MetaProducto>) => void;
  ajustarPrecios: (categoria: string, pct: number) => number;
  precio: (p: Producto) => number;
  precioUsd: (p: Producto) => number;
  dolar: Dolar;
  actualizarDolar: () => Promise<boolean>;
  fijarDolar: (valor: number) => void;
  pedidos: Pedido[];
  crearPedido: (p: Omit<Pedido, "nro" | "fecha">) => Pedido;
  cp: string;
  setCp: (cp: string) => void;
  aviso: string | null;
  avisar: (t: string) => void;
};

const TiendaCtx = createContext<Ctx | null>(null);

export function TiendaProvider({ children }: { children: ReactNode }) {
  const [listo, setListo] = useState(false);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [meta, setMetaAll] = useState<Record<number, MetaProducto>>(metaInicial);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cp, setCpState] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);
  const [dolar, setDolar] = useState<Dolar>(DOLAR_INICIAL);

  const actualizarDolar = useCallback(async () => {
    try {
      const r = await fetch("https://dolarapi.com/v1/dolares/oficial", { cache: "no-store" });
      if (!r.ok) return false;
      const j = (await r.json()) as { venta?: number; fechaActualizacion?: string };
      if (!j.venta) return false;
      const d: Dolar = { valor: j.venta, actualizado: j.fechaActualizacion ?? new Date().toISOString(), fuente: "bna" };
      setDolar(d);
      guardar("dolar", d);
      return true;
    } catch {
      return false;
    }
  }, []);

  const fijarDolar = useCallback((valor: number) => {
    const d: Dolar = { valor, actualizado: new Date().toISOString(), fuente: "manual" };
    setDolar(d);
    guardar("dolar", d);
  }, []);

  useEffect(() => {
    const guardado = leer<Dolar | null>("dolar", null);
    if (guardado) setDolar(guardado);
    // un valor cargado a mano en el panel se respeta; si no, se consulta el BNA ahora y cada 10 minutos
    if (guardado?.fuente === "manual") return;
    actualizarDolar();
    const t = window.setInterval(actualizarDolar, DIEZ_MINUTOS);
    return () => window.clearInterval(t);
  }, [actualizarDolar]);

  useEffect(() => {
    setCarrito(leer("carrito", []));
    setMetaAll({ ...metaInicial(), ...leer("meta", {}) });
    setPedidos(leer("pedidos", []));
    setCpState(leer("cp", ""));
    setListo(true);
  }, []);

  useEffect(() => {
    if (listo) guardar("carrito", carrito);
  }, [carrito, listo]);

  const avisar = useCallback((t: string) => {
    setAviso(t);
    window.setTimeout(() => setAviso((a) => (a === t ? null : a)), 2600);
  }, []);

  const agregar = useCallback(
    (id: number) => {
      setCarrito((c) => {
        const it = c.find((x) => x.id === id);
        return it ? c.map((x) => (x.id === id ? { ...x, cant: x.cant + 1 } : x)) : [...c, { id, cant: 1 }];
      });
      const p = productoPorId(id);
      if (p) avisar(`Agregaste ${p.n}`);
    },
    [avisar],
  );
  const cambiar = useCallback((id: number, d: number) => {
    setCarrito((c) => c.map((x) => (x.id === id ? { ...x, cant: x.cant + d } : x)).filter((x) => x.cant > 0));
  }, []);
  const quitar = useCallback((id: number) => setCarrito((c) => c.filter((x) => x.id !== id)), []);
  const vaciar = useCallback(() => setCarrito([]), []);

  const setMeta = useCallback((id: number, cambios: Partial<MetaProducto>) => {
    setMetaAll((m) => {
      const n = { ...m, [id]: { ...m[id], ...cambios } };
      guardar("meta", n);
      return n;
    });
  }, []);

  const precioUsd = useCallback((p: Producto) => meta[p.id]?.usd ?? p.usd, [meta]);
  const precio = useCallback((p: Producto) => Math.round(precioUsd(p) * dolar.valor), [precioUsd, dolar.valor]);

  const ajustarPrecios = useCallback(
    (categoria: string, pct: number) => {
      const afectados = PRODUCTOS.filter((p) => categoria === "Todas" || p.c.includes(categoria));
      setMetaAll((m) => {
        const copia = { ...m };
        for (const p of afectados) {
          const actual = copia[p.id].usd ?? p.usd;
          copia[p.id] = { ...copia[p.id], usd: Math.round(actual * (1 + pct / 100) * 100) / 100 };
        }
        guardar("meta", copia);
        return copia;
      });
      return afectados.length;
    },
    [],
  );

  const crearPedido = useCallback(
    (p: Omit<Pedido, "nro" | "fecha">) => {
      const previos = leer<Pedido[]>("pedidos", []);
      const nuevo: Pedido = { ...p, nro: 1241 + previos.length, fecha: new Date().toLocaleString("es-AR") };
      const lista = [nuevo, ...previos];
      guardar("pedidos", lista);
      setPedidos(lista);
      setMetaAll((m) => {
        const copia = { ...m };
        for (const it of p.items) copia[it.id] = { ...copia[it.id], stock: Math.max(0, copia[it.id].stock - it.cant) };
        guardar("meta", copia);
        return copia;
      });
      return nuevo;
    },
    [],
  );

  const setCp = useCallback((v: string) => {
    setCpState(v);
    guardar("cp", v);
  }, []);

  const value = useMemo(
    () => ({ listo, carrito, agregar, cambiar, quitar, vaciar, abierto, setAbierto, meta, setMeta, ajustarPrecios, precio, precioUsd, dolar, actualizarDolar, fijarDolar, pedidos, crearPedido, cp, setCp, aviso, avisar }),
    [listo, carrito, agregar, cambiar, quitar, vaciar, abierto, meta, setMeta, ajustarPrecios, precio, precioUsd, dolar, actualizarDolar, fijarDolar, pedidos, crearPedido, cp, setCp, aviso, avisar],
  );
  return <TiendaCtx.Provider value={value}>{children}</TiendaCtx.Provider>;
}

export function useTienda() {
  const c = useContext(TiendaCtx);
  if (!c) throw new Error("useTienda fuera de TiendaProvider");
  return c;
}

export function bultosDe(items: ItemCarrito[], meta: Record<number, MetaProducto>) {
  return items.map((it) => ({ peso: meta[it.id].peso, medidas: meta[it.id].medidas, cantidad: it.cant }));
}
