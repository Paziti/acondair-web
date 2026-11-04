// Cotización de envío SIMULADA. En producción se reemplaza por la API de Andreani
// (cotizador por código postal, peso y volumen). Las tarifas de acá son de ejemplo.
export type Zona = { nombre: string; base: number; porKg: number; plazo: string };

export function zonaDe(cpTexto: string): Zona | null {
  const cp = Number(cpTexto);
  if (!/^\d{4}$/.test(cpTexto) || cp < 1000) return null;
  if (cp >= 8000 && cp <= 8003) return { nombre: "Bahía Blanca", base: 6500, porKg: 180, plazo: "1 a 2 días hábiles" };
  if (cp >= 8100 && cp <= 8199) return { nombre: "Zona Bahía", base: 9800, porKg: 260, plazo: "2 a 3 días hábiles" };
  if (cp < 1900) return { nombre: "CABA y AMBA", base: 14500, porKg: 390, plazo: "3 a 5 días hábiles" };
  if (cp >= 8300) return { nombre: "Patagonia", base: 17900, porKg: 480, plazo: "4 a 7 días hábiles" };
  if ((cp >= 6000 && cp < 8300) || (cp >= 1900 && cp < 2000) || (cp >= 2700 && cp < 3000))
    return { nombre: "Provincia de Buenos Aires", base: 12500, porKg: 340, plazo: "3 a 5 días hábiles" };
  return { nombre: "Interior del país", base: 16200, porKg: 430, plazo: "4 a 6 días hábiles" };
}

export type Bulto = { peso: number; medidas: number[]; cantidad: number };

export function pesoFacturable(bultos: Bulto[]) {
  let real = 0;
  let vol = 0;
  for (const b of bultos) {
    real += b.peso * b.cantidad;
    vol += ((b.medidas[0] * b.medidas[1] * b.medidas[2]) / 4000) * b.cantidad;
  }
  return Math.max(real, vol);
}

export function cotizar(cp: string, bultos: Bulto[]) {
  const zona = zonaDe(cp);
  if (!zona) return null;
  const kg = pesoFacturable(bultos);
  const domicilio = Math.round((zona.base + kg * zona.porKg) / 100) * 100;
  const sucursal = Math.round((domicilio * 0.78) / 100) * 100;
  return { zona, kg, domicilio, sucursal };
}
