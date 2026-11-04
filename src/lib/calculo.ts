import { PRODUCTOS, type Producto } from "./catalogo";

export type Modo = "calor" | "frio";
export type Entrada = { m2: number; altura: number; aislacion: number; aguaCaliente: boolean; sol: number };

// Estimación orientativa para el clima de Bahía Blanca: unas 50 kcal/h por m³ con aislación normal.
// El número final sale del balance térmico que hace Acondair en la obra.
export function kcalNecesarias(e: Entrada) {
  return Math.round((e.m2 * e.altura * 50 * e.aislacion) / 100) * 100;
}
export function frigoriasNecesarias(e: Entrada) {
  return Math.round((e.m2 * e.altura * 50 * e.sol) / 100) * 100;
}

const capacidadCaldera = (p: Producto) => {
  const m = p.n.match(/(\d{2})(?=\b|F\b)/);
  const kw = m ? Number(m[1]) : 24;
  return kw * 860;
};

export function calderasPara(kcal: number, aguaCaliente: boolean) {
  return PRODUCTOS.filter(
    (p) =>
      p.c.includes("Calderas") &&
      !/eléctrica/i.test(p.n) &&
      (aguaCaliente ? /doble servicio/i.test(p.n) : /solo calefacción/i.test(p.n)),
  )
    .map((p) => ({ p, cap: capacidadCaldera(p) }))
    .filter((x) => x.cap >= kcal * 1.1)
    .sort((a, b) => a.p.p - b.p.p)
    .slice(0, 2);
}

export const ELEMENTO_RADIADOR = PRODUCTOS.find((p) => /Clan N500/.test(p.n))!;
export const KCAL_POR_ELEMENTO = 150;

export function airesPara(frigorias: number) {
  return PRODUCTOS.filter((p) => p.c.includes("Aires Acondicionados"))
    .map((p) => ({ p, cap: Number((p.n.match(/(\d{4})/) || [0, 0])[1]) }))
    .filter((x) => x.cap >= frigorias)
    .sort((a, b) => a.cap - b.cap || a.p.p - b.p.p)
    .slice(0, 3);
}
