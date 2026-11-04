"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NumeroDeslizante } from "./NumeroDeslizante";
import { useTienda } from "@/lib/tienda-estado";
import { pesos } from "@/lib/catalogo";
import { airesPara, calderasPara, ELEMENTO_RADIADOR, frigoriasNecesarias, kcalNecesarias, KCAL_POR_ELEMENTO, type Modo } from "@/lib/calculo";
import { wa } from "@/data/sitio";

const AISLACION = [
  { v: 0.85, t: "Buena" },
  { v: 1, t: "Normal" },
  { v: 1.2, t: "Poca o mucho vidrio" },
];
const SOL = [
  { v: 0.9, t: "Sombra" },
  { v: 1, t: "Normal" },
  { v: 1.15, t: "Mucho sol" },
];

function Segmentado<T extends string | number | boolean>({ etiqueta, opciones, valor, onChange }: { etiqueta: string; opciones: { v: T; t: string }[]; valor: T; onChange: (v: T) => void }) {
  const id = useId();
  return (
    <fieldset className="mb-5">
      <legend className="text-[13.5px] font-medium text-acero mb-2" id={id}>
        {etiqueta}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {opciones.map((o) => (
          <button
            key={String(o.v)}
            type="button"
            aria-pressed={valor === o.v}
            onClick={() => onChange(o.v)}
            className={`presionable h-10 px-3.5 text-[14.5px] border ${valor === o.v ? "bg-hierro text-white border-hierro" : "border-chapa hover:border-hierro"}`}
          >
            {o.t}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Rango({ id, etiqueta, min, max, step, valor, onChange, formato }: { id: string; etiqueta: string; min: number; max: number; step: number; valor: number; onChange: (v: number) => void; formato: (v: number) => string }) {
  const p = ((valor - min) / (max - min)) * 100;
  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-1">
        <label htmlFor={id} className="text-[13.5px] font-medium text-acero">
          {etiqueta}
        </label>
        <output htmlFor={id} className="cifra text-[17px] font-bold">
          {formato(valor)}
        </output>
      </div>
      <input id={id} type="range" className="termo" min={min} max={max} step={step} value={valor} onChange={(e) => onChange(Number(e.target.value))} style={{ ["--p" as string]: `${p}%` }} />
      {/* escala térmica: marcas cada 10% como en un instrumento */}
      <div aria-hidden className="flex justify-between px-[9px] -mt-1">
        {Array.from({ length: 11 }, (_, i) => (
          <span key={i} className={`w-px ${i % 5 === 0 ? "h-2.5 bg-hierro" : "h-1.5 bg-chapa"}`} />
        ))}
      </div>
    </div>
  );
}

export function Calculadora({ compacta = false }: { compacta?: boolean }) {
  const { agregar, precio } = useTienda();
  const [modo, setModo] = useState<Modo>("calor");
  const [m2, setM2] = useState(90);
  const [altura, setAltura] = useState(2.6);
  const [aislacion, setAislacion] = useState(1);
  const [agua, setAgua] = useState(true);
  const [sol, setSol] = useState(1);

  const entrada = { m2, altura, aislacion, aguaCaliente: agua, sol };
  const kcal = kcalNecesarias(entrada);
  const frig = frigoriasNecesarias(entrada);
  const calderas = calderasPara(kcal, agua);
  const elementos = Math.ceil(kcal / KCAL_POR_ELEMENTO);
  const aires = airesPara(frig);

  const cambiarModo = (m: Modo) => {
    setModo(m);
    if (m === "frio" && m2 > 80) setM2(25);
    if (m === "calor" && m2 < 40) setM2(90);
  };

  const mensaje = `Hola Acondair! Usé la calculadora de la web: ${modo === "calor" ? `calefacción, ${m2} m², techo de ${altura} m, da ${kcal} kcal/h` : `aire acondicionado, ${m2} m², da ${frig} frigorías`}. ¿Me pasan un presupuesto con instalación?`;

  return (
    <div className="placa">
      <span className="remaches" />
      <div className={`grid ${compacta ? "md:grid-cols-[1fr_1.05fr]" : "md:grid-cols-[1fr_1.05fr]"}`}>
        <div className={`p-6 md:p-8 border-chapa ${compacta ? "md:border-r" : "md:border-r"}`}>
          <div role="tablist" aria-label="Tipo de cálculo" className="relative grid grid-cols-2 border border-hierro mb-6">
            {(["calor", "frio"] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={modo === m}
                onClick={() => cambiarModo(m)}
                className={`relative h-11 text-[15px] font-semibold z-10 transition-colors duration-200 ${modo === m ? "text-white" : "text-hierro"}`}
              >
                {modo === m && (
                  <motion.span layoutId={compacta ? "modo-c" : "modo"} className={`absolute inset-0 -z-10 ${m === "calor" ? "bg-acento" : "bg-azul"}`} transition={{ duration: 0.3, ease: [0.77, 0, 0.175, 1] }} />
                )}
                {m === "calor" ? "Calefacción" : "Aire acondicionado"}
              </button>
            ))}
          </div>

          <Rango id={`m2-${compacta}`} etiqueta={modo === "calor" ? "Superficie a calefaccionar" : "Superficie del ambiente"} min={10} max={modo === "calor" ? 300 : 80} step={5} valor={m2} onChange={setM2} formato={(v) => `${v} m²`} />
          <Rango id={`alt-${compacta}`} etiqueta="Altura del techo" min={2.4} max={4} step={0.1} valor={altura} onChange={setAltura} formato={(v) => `${v.toFixed(1).replace(".", ",")} m`} />
          {modo === "calor" ? (
            <>
              <Segmentado etiqueta="Aislación de la casa" opciones={AISLACION} valor={aislacion} onChange={setAislacion} />
              <Segmentado
                etiqueta="¿También agua caliente?"
                opciones={[
                  { v: true, t: "Sí, doble servicio" },
                  { v: false, t: "Solo calefacción" },
                ]}
                valor={agua}
                onChange={setAgua}
              />
            </>
          ) : (
            <Segmentado etiqueta="Sol que recibe" opciones={SOL} valor={sol} onChange={setSol} />
          )}
        </div>

        <div className={`p-6 md:p-8 bg-papel/60 border-t border-chapa ${compacta ? "md:border-t-0" : "md:border-t-0"}`}>
          <p className="text-[13.5px] font-medium text-acero">{modo === "calor" ? "Potencia necesaria" : "Capacidad necesaria"}</p>
          <p className={`flex items-baseline gap-2 ${modo === "calor" ? "text-acento" : "text-azul"}`}>
            <NumeroDeslizante valor={modo === "calor" ? kcal : frig} alEntrar className="text-[52px] md:text-[64px] font-extrabold" />
            <span className="text-[17px] font-semibold text-hierro">{modo === "calor" ? "kcal/h" : "frigorías"}</span>
          </p>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={modo} initial={{ opacity: 0, filter: "blur(2px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.2 }}>
              <dl className="mt-5 divide-y divide-chapa border-y border-chapa">
                {modo === "calor" ? (
                  <>
                    {calderas.length ? (
                      calderas.map(({ p, cap }) => (
                        <Recomendado key={p.id} img={p.img} nombre={p.n} slug={p.slug} detalle={`${pesos(precio(p))}, hasta ${cap.toLocaleString("es-AR")} kcal/h`} onAgregar={() => agregar(p.id)} />
                      ))
                    ) : (
                      <p className="py-4 text-[14.5px]">Para esta superficie conviene un proyecto a medida, con una caldera de más potencia o dos equipos.</p>
                    )}
                    <Recomendado img={ELEMENTO_RADIADOR.img} nombre={`${elementos} elementos de radiador`} slug={ELEMENTO_RADIADOR.slug} detalle={`${ELEMENTO_RADIADOR.n}, ${pesos(elementos * precio(ELEMENTO_RADIADOR))}`} onAgregar={() => agregar(ELEMENTO_RADIADOR.id)} etiquetaBoton="Agregar 1" />
                  </>
                ) : aires.length ? (
                  aires.map(({ p, cap }) => <Recomendado key={p.id} img={p.img} nombre={p.n} slug={p.slug} detalle={`${pesos(precio(p))}, ${cap} frigorías`} onAgregar={() => agregar(p.id)} />)
                ) : (
                  <p className="py-4 text-[14.5px]">Para este ambiente conviene un equipo más grande o un sistema VRF. Te asesoramos sin cargo.</p>
                )}
              </dl>
            </motion.div>
          </AnimatePresence>

          <a href={wa(mensaje)} target="_blank" rel="noopener" className="presionable mt-5 flex h-12 items-center justify-center bg-hierro text-white font-semibold hover:bg-black">
            Pedir presupuesto con instalación
          </a>
          <p className="mt-3 text-[13px] text-acero leading-relaxed">Cálculo orientativo para el clima de Bahía Blanca. El número final sale del balance térmico que hacemos en tu casa.</p>
        </div>
      </div>
    </div>
  );
}

function Recomendado({ img, nombre, slug, detalle, onAgregar, etiquetaBoton = "Agregar" }: { img: string; nombre: string; slug: string; detalle: string; onAgregar: () => void; etiquetaBoton?: string }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-14 h-14 shrink-0 bg-white grid place-items-center border border-chapa">
        <Image src={img} alt="" width={52} height={52} className="object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/tienda/${slug}`} className="block text-[14.5px] leading-snug font-medium hover:text-acento">
          {nombre}
        </Link>
        <span className="text-[13px] text-acero">{detalle}</span>
      </div>
      <button onClick={onAgregar} className="presionable shrink-0 h-10 px-3 text-[13.5px] font-semibold border border-hierro hover:bg-hierro hover:text-white">
        {etiquetaBoton}
      </button>
    </div>
  );
}
