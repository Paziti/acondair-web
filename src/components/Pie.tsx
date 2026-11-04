"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONTACTO, MARCAS } from "@/data/sitio";

// Mismas tres columnas que el pie de la web actual: reseña, marcas y contacto con horario.
function Titulo({ children }: { children: React.ReactNode }) {
  return <p className="border-l-[3px] border-turquesa pl-3 text-white font-semibold text-[16px] mb-5">{children}</p>;
}

export function Pie() {
  const path = usePathname();
  if (path.startsWith("/panel")) return null;
  return (
    <footer className="bg-pie text-white/80 text-[14.5px]">
      <div className="mx-auto max-w-[1240px] px-4 md:px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <Titulo>Reseña de la empresa</Titulo>
          <p className="leading-relaxed max-w-sm">
            Nos dedicamos a la ingeniería termomecánica desde 1963, diseñando y proyectando las soluciones más convenientes para cada necesidad. Vendemos, instalamos y atendemos la garantía con personal propio.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {[
              ["/tienda", "Tienda"],
              ["/sistemas", "Sistemas"],
              ["/calculadora", "Calculadora"],
              ["/obras", "Proyectos"],
              ["/empresa", "La Empresa"],
            ].map(([h, t]) => (
              <li key={h}>
                <Link href={h} className="underline underline-offset-4 decoration-white/30 hover:text-white hover:decoration-turquesa">
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Titulo>Marcas distribuidas</Titulo>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {MARCAS.map((m) => (
              <li key={m}>
                <Link href={`/tienda?q=${encodeURIComponent(m)}`} className="inline-flex items-center gap-2 hover:text-white">
                  <svg width="6" height="9" viewBox="0 0 6 9" aria-hidden>
                    <path d="M1 1l3.5 3.5L1 8" stroke="currentColor" strokeWidth="1.4" fill="none" />
                  </svg>
                  {m}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Titulo>Contáctenos</Titulo>
          <ul className="space-y-1.5">
            <li>
              <a className="hover:text-white" href={CONTACTO.telHref}>
                {CONTACTO.telefono}
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={`https://wa.me/${CONTACTO.waNumero}`} target="_blank" rel="noopener">
                WhatsApp {CONTACTO.whatsapp}
              </a>
            </li>
            <li>
              {CONTACTO.direccion}, {CONTACTO.ciudad}, Pcia. Bs. As.
            </li>
            <li>
              <a className="hover:text-white" href={`mailto:${CONTACTO.email}`}>
                {CONTACTO.email}
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={CONTACTO.instagram} target="_blank" rel="noopener">
                Instagram
              </a>
            </li>
          </ul>
          <div className="mt-8">
            <Titulo>Horario de atención</Titulo>
            <p>Lun a vie 08:30 a 12:30</p>
            <p>Lun a vie 15:00 a 18:00</p>
          </div>
        </div>
      </div>
      <div className="bg-pie-barra">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 py-5 text-[13px] flex flex-wrap justify-between gap-3 text-white/65">
          <span>© {new Date().getFullYear()} Acondair Climatización</span>
          <span>Precios en pesos con IVA incluido, calculados con el dólar Banco Nación del día</span>
        </div>
      </div>
    </footer>
  );
}
