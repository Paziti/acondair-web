"use client";

import { useEffect, useState } from "react";

// El punto marca un estado real: si el local está abierto en este momento (hora de Argentina).
export function estaAbierto(d = new Date()) {
  const ar = new Date(d.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
  const dia = ar.getDay();
  const h = ar.getHours() + ar.getMinutes() / 60;
  return dia >= 1 && dia <= 5 && ((h >= 8.5 && h < 12.5) || (h >= 15 && h < 18));
}

export function AbiertoAhora({ oscuro = true }: { oscuro?: boolean }) {
  const [abierto, setAbierto] = useState<boolean | null>(null);
  useEffect(() => {
    setAbierto(estaAbierto());
    const t = setInterval(() => setAbierto(estaAbierto()), 60_000);
    return () => clearInterval(t);
  }, []);
  if (abierto === null) return <span>Lun a vie 8:30 a 12:30 y 15 a 18</span>;
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className={`w-2 h-2 rounded-full ${abierto ? "bg-[#3ccf6e]" : oscuro ? "bg-white/40" : "bg-acero"}`} />
      {abierto ? "Abierto ahora" : "Cerrado ahora"}, lun a vie 8:30 a 12:30 y 15 a 18
    </span>
  );
}
