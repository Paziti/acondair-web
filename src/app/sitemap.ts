import type { MetadataRoute } from "next";
import { PRODUCTOS, SISTEMAS } from "@/lib/catalogo";

const BASE = "https://www.acondair.com.ar";

export default function sitemap(): MetadataRoute.Sitemap {
  const fijas = ["", "/sistemas", "/calculadora", "/tienda", "/obras", "/empresa", "/contacto"].map((p) => ({ url: `${BASE}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 }));
  return [
    ...fijas,
    ...SISTEMAS.map((s) => ({ url: `${BASE}/sistemas/${s.slug}`, changeFrequency: "yearly" as const, priority: 0.7 })),
    ...PRODUCTOS.map((p) => ({ url: `${BASE}/tienda/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
