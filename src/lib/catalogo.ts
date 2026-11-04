import productosJson from "@/data/productos.json";
import sistemasJson from "@/data/sistemas.json";

export type Producto = {
  id: number;
  n: string;
  slug: string;
  p: number;
  c: string[];
  sku: string;
  img: string;
  b: string;
  w: number;
  d: number[];
  desc: string;
  usd: number;
};

export type Bloque = [string, string];
export type Sistema = {
  slug: string;
  nombre: string;
  grupo: "calor" | "frio" | "piscina";
  resumen: string;
  imgs: string[];
  cats: string[];
  blocks: Bloque[];
};

// Las listas de Acondair están en dólares. El precio en pesos de productos.json se tomó con el dólar
// Banco Nación venta del 4/11/2026; de ahí sale el precio en USD de cada producto.
export const DOLAR_BASE = 1570;
export const PRODUCTOS: Producto[] = (productosJson as Omit<Producto, "usd">[]).map((p) => ({ ...p, usd: Math.round((p.p / DOLAR_BASE) * 100) / 100 }));
export const SISTEMAS = sistemasJson.sistemas as Sistema[];
export const CALEFACCION_GENERAL = sistemasJson.calefaccion.blocks as Bloque[];

export const CATEGORIAS = [
  "Calderas",
  "Aires Acondicionados",
  "Radiadores",
  "Calefones",
  "Climatizadores de piscina",
  "Toalleros",
  "Bombas de agua",
  "Accesorios climatización",
  "Repuestos",
].filter((c) => PRODUCTOS.some((p) => p.c.includes(c)));

export const catSlug = (c: string) =>
  c
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-");

export const productoPorSlug = (s: string) => PRODUCTOS.find((p) => p.slug === s);
export const productoPorId = (id: number) => PRODUCTOS.find((p) => p.id === id);
export const sistemaPorSlug = (s: string) => SISTEMAS.find((x) => x.slug === s);

export const GRUPOS = {
  calor: { nombre: "Calefacción", color: "text-acento" },
  frio: { nombre: "Refrigeración", color: "text-azul" },
  piscina: { nombre: "Piscinas", color: "text-azul" },
} as const;

export const pesos = (n: number) => "$ " + Math.round(n).toLocaleString("es-AR");
export const dolares = (n: number) => "US$ " + n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
