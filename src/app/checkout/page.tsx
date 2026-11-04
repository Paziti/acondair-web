"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTienda, bultosDe, type Pedido } from "@/lib/tienda-estado";
import { productoPorId, pesos } from "@/lib/catalogo";
import { cotizar, zonaDe } from "@/lib/envio";
import { CONTACTO } from "@/data/sitio";

type Datos = Pedido["cliente"];
type Envio = Pedido["envio"];
const VACIO: Datos = { nombre: "", dni: "", email: "", tel: "", calle: "", ciudad: "", cp: "" };
const PASOS = ["Tus datos", "Entrega", "Pago"];

export default function Checkout() {
  const { listo, carrito, precio, meta, crearPedido, vaciar, cp } = useTienda();
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState<Datos>(VACIO);
  const [errores, setErrores] = useState<Partial<Record<keyof Datos, string>>>({});
  const [cotizando, setCotizando] = useState(false);
  const [envio, setEnvio] = useState<Envio | null>(null);
  const [pago, setPago] = useState<Pedido["pago"]>("mercadopago");
  const [procesando, setProcesando] = useState(false);
  const [hecho, setHecho] = useState<Pedido | null>(null);

  useEffect(() => {
    try {
      const g = localStorage.getItem("acondair_cliente");
      setDatos(g ? { ...VACIO, ...JSON.parse(g) } : { ...VACIO, cp });
    } catch {
      setDatos({ ...VACIO, cp });
    }
  }, [cp]);
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [paso, hecho]);

  const items = carrito.map((it) => ({ ...it, p: productoPorId(it.id)! }));
  const subtotal = items.reduce((a, x) => a + precio(x.p) * x.cant, 0);
  const cot = zonaDe(datos.cp) ? cotizar(datos.cp, bultosDe(carrito, meta)) : null;
  const esBahia = cot?.zona.nombre === "Bahía Blanca";

  if (!listo) return <div className="mx-auto max-w-[1100px] px-4 py-24 text-acero">Cargando tu carrito…</div>;

  if (hecho) return <Confirmacion pedido={hecho} />;

  if (!items.length)
    return (
      <div className="mx-auto max-w-[640px] px-4 py-24 text-center">
        <h1 className="display text-[34px]">Tu carrito está vacío</h1>
        <p className="mt-3 text-acero">Agregá productos desde la tienda para finalizar la compra.</p>
        <Link href="/tienda" className="presionable mt-7 inline-flex h-12 items-center px-7 bg-hierro text-white font-semibold">
          Ir a la tienda
        </Link>
      </div>
    );

  const set = (k: keyof Datos) => (e: React.ChangeEvent<HTMLInputElement>) => setDatos((d) => ({ ...d, [k]: k === "cp" || k === "dni" ? e.target.value.replace(/\D/g, "") : e.target.value }));

  const validarDatos = (e: React.FormEvent) => {
    e.preventDefault();
    const er: typeof errores = {};
    if (datos.nombre.trim().length < 3) er.nombre = "Escribí tu nombre y apellido.";
    if (!/^\S+@\S+\.\S+$/.test(datos.email)) er.email = "Revisá el email, por ejemplo nombre@gmail.com.";
    if (datos.tel.replace(/\D/g, "").length < 8) er.tel = "Escribí un celular con código de área.";
    if (!/^\d{4}$/.test(datos.cp)) er.cp = "El código postal tiene 4 números.";
    if (!datos.calle.trim()) er.calle = "Necesitamos la dirección para el envío o la factura.";
    setErrores(er);
    if (Object.keys(er).length) {
      document.getElementById(`f-${Object.keys(er)[0]}`)?.focus();
      return;
    }
    try {
      localStorage.setItem("acondair_cliente", JSON.stringify(datos));
    } catch {}
    setPaso(1);
    setCotizando(true);
    setEnvio(null);
    window.setTimeout(() => setCotizando(false), 900);
  };

  const opciones: Envio[] = [];
  if (cot) {
    opciones.push({ tipo: "domicilio", nombre: "Andreani a domicilio", precio: cot.domicilio, kg: cot.kg });
    opciones.push({ tipo: "sucursal", nombre: "Andreani a sucursal", precio: cot.sucursal, kg: cot.kg });
  }
  if (esBahia) opciones.push({ tipo: "instalacion", nombre: "Entrega e instalación en Bahía Blanca", precio: 0 });
  opciones.push({ tipo: "retiro", nombre: "Retiro en el local", precio: 0 });

  const confirmar = () => {
    if (!envio) return;
    setProcesando(true);
    window.setTimeout(() => {
      const p = crearPedido({ cliente: datos, items: carrito, subtotal, envio, pago, estado: pago === "mercadopago" ? "Pagado" : "Pendiente de pago" });
      vaciar();
      setHecho(p);
      setProcesando(false);
    }, 1100);
  };

  return (
    <div className="mx-auto max-w-[1160px] px-4 md:px-6 pt-8 md:pt-12 pb-20">
      <h1 className="display text-[32px] md:text-[42px]">Finalizar compra</h1>
      <ol className="mt-6 flex flex-wrap gap-2" aria-label="Pasos">
        {PASOS.map((t, i) => (
          <li key={t} aria-current={i === paso ? "step" : undefined} className={`h-9 px-3.5 inline-flex items-center text-[14px] font-semibold border ${i === paso ? "bg-hierro text-white border-hierro" : i < paso ? "border-ok text-ok" : "border-chapa text-acero"}`}>
            {i < paso ? "✓ " : `${i + 1}. `}
            {t}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid lg:grid-cols-[1.25fr_0.75fr] gap-8 lg:gap-12 items-start">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={paso} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8, transition: { duration: 0.12 } }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
            {paso === 0 && (
              <form onSubmit={validarDatos} noValidate>
                <h2 className="display text-[22px] mb-5">Tus datos</h2>
                <div className="grid sm:grid-cols-2 gap-x-4">
                  <Campo id="nombre" label="Nombre y apellido" value={datos.nombre} onChange={set("nombre")} error={errores.nombre} auto="name" />
                  <Campo id="dni" label="DNI (para Andreani)" value={datos.dni} onChange={set("dni")} inputMode="numeric" opcional />
                  <Campo id="email" label="Email" value={datos.email} onChange={set("email")} error={errores.email} auto="email" type="email" />
                  <Campo id="tel" label="Celular" value={datos.tel} onChange={set("tel")} error={errores.tel} auto="tel" type="tel" />
                  <Campo id="calle" label="Calle y número" value={datos.calle} onChange={set("calle")} error={errores.calle} auto="street-address" />
                  <Campo id="ciudad" label="Ciudad" value={datos.ciudad} onChange={set("ciudad")} auto="address-level2" opcional />
                  <Campo id="cp" label="Código postal" value={datos.cp} onChange={set("cp")} error={errores.cp} inputMode="numeric" auto="postal-code" max={4} />
                </div>
                <button className="presionable mt-4 w-full h-[54px] bg-acento text-white font-semibold text-[16px] hover:bg-acento-oscuro">Continuar a la entrega</button>
              </form>
            )}

            {paso === 1 && (
              <div>
                <h2 className="display text-[22px] mb-5">¿Cómo lo recibís?</h2>
                {cotizando ? (
                  <div className="border border-chapa p-6" role="status">
                    <div className="h-1 bg-chapa overflow-hidden">
                      <motion.div className="h-full w-1/3 bg-hierro" animate={{ x: ["-100%", "300%"] }} transition={{ duration: 0.9, ease: "linear", repeat: Infinity }} />
                    </div>
                    <p className="mt-3 text-[15px] text-acero">Consultando tarifas de Andreani para el código postal {datos.cp}…</p>
                  </div>
                ) : (
                  <fieldset>
                    <legend className="sr-only">Forma de entrega</legend>
                    {!cot && <p className="mb-3 bg-aviso-claro text-aviso p-3 text-[14.5px]">No pudimos cotizar el envío para ese código postal. Podés retirar en el local o te cotizamos por WhatsApp.</p>}
                    {opciones.map((o) => (
                      <label key={o.tipo} className={`flex gap-3 items-start p-4 mb-2.5 border cursor-pointer transition-colors ${envio?.tipo === o.tipo ? "border-hierro bg-papel" : "border-chapa hover:border-acero"}`}>
                        <input type="radio" name="envio" className="mt-1 accent-hierro w-4 h-4" checked={envio?.tipo === o.tipo} onChange={() => setEnvio(o)} />
                        <span className="flex-1">
                          <span className="block font-semibold text-[15.5px]">{o.nombre}</span>
                          <span className="block text-[14px] text-acero mt-0.5">
                            {o.tipo === "domicilio" && `${datos.calle}, ${cot!.zona.nombre}. Llega en ${cot!.zona.plazo}.`}
                            {o.tipo === "sucursal" && `Retirás en la sucursal Andreani más cercana. ${cot!.zona.plazo}.`}
                            {o.tipo === "instalacion" && "Nuestro equipo lo lleva y lo instala. Te llamamos para coordinar y cotizar la instalación."}
                            {o.tipo === "retiro" && `${CONTACTO.direccion}, ${CONTACTO.ciudad}. ${CONTACTO.horario}.`}
                          </span>
                        </span>
                        <span className={`cifra font-semibold whitespace-nowrap ${o.precio ? "" : "text-ok"}`}>{o.precio ? pesos(o.precio) : "Sin cargo"}</span>
                      </label>
                    ))}
                    {cot && <p className="mt-3 text-[13.5px] text-acero">Peso del envío: {cot.kg.toFixed(1).replace(".", ",")} kg (el mayor entre peso real y volumétrico). Demo: tarifa simulada; en la web real llega en vivo desde Andreani.</p>}
                    <div className="mt-5 flex gap-3">
                      <button onClick={() => setPaso(0)} className="presionable h-[54px] px-5 border border-chapa font-semibold hover:border-hierro">
                        Volver
                      </button>
                      <button onClick={() => envio && setPaso(2)} disabled={!envio} className="presionable flex-1 h-[54px] bg-acento text-white font-semibold text-[16px] hover:bg-acento-oscuro disabled:bg-chapa disabled:text-acero disabled:cursor-not-allowed">
                        {envio ? "Continuar al pago" : "Elegí una forma de entrega"}
                      </button>
                    </div>
                  </fieldset>
                )}
              </div>
            )}

            {paso === 2 && envio && (
              <div>
                <h2 className="display text-[22px] mb-5">Pago</h2>
                <fieldset>
                  <legend className="sr-only">Medio de pago</legend>
                  {(
                    [
                      ["mercadopago", "Mercado Pago", "Tarjeta de crédito, débito o dinero en cuenta. Hasta 6 cuotas."],
                      ["transferencia", "Transferencia bancaria", "Te mandamos los datos por email. Reservamos el pedido 48 horas."],
                      ["local", "Pago en el local", "Efectivo o tarjeta al retirar. Solo con retiro en el local."],
                    ] as const
                  ).map(([v, t, d]) => {
                    const off = v === "local" && envio.tipo !== "retiro";
                    return (
                      <label key={v} className={`flex gap-3 items-start p-4 mb-2.5 border ${off ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${pago === v ? "border-hierro bg-papel" : "border-chapa"}`}>
                        <input type="radio" name="pago" disabled={off} className="mt-1 accent-hierro w-4 h-4" checked={pago === v} onChange={() => setPago(v)} />
                        <span>
                          <span className="block font-semibold text-[15.5px]">{t}</span>
                          <span className="block text-[14px] text-acero mt-0.5">{d}</span>
                        </span>
                      </label>
                    );
                  })}
                </fieldset>
                <div className="mt-5 flex gap-3">
                  <button onClick={() => setPaso(1)} className="presionable h-[54px] px-5 border border-chapa font-semibold hover:border-hierro">
                    Volver
                  </button>
                  <button onClick={confirmar} disabled={procesando} className={`presionable flex-1 h-[54px] text-white font-semibold text-[16px] disabled:opacity-70 ${pago === "mercadopago" ? "bg-[#0a6fb8] hover:bg-[#085a96]" : "bg-acento hover:bg-acento-oscuro"}`}>
                    {procesando ? "Procesando…" : pago === "mercadopago" ? `Pagar ${pesos(subtotal + envio.precio)} con Mercado Pago` : "Confirmar pedido"}
                  </button>
                </div>
                <p className="mt-3 text-[13px] text-acero">Demo: no se cobra nada. En la web real se abre el checkout seguro de Mercado Pago y el pedido se confirma cuando el pago se acredita.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <aside className="placa p-6 lg:sticky lg:top-32">
          <span className="remaches" />
          <h2 className="display text-[18px] mb-3">Tu pedido</h2>
          <ul className="divide-y divide-chapa">
            {items.map(({ p, cant, id }) => (
              <li key={id} className="flex gap-3 py-2.5 items-center">
                <Image src={p.img} alt="" width={44} height={44} className="w-11 h-11 object-contain bg-papel" />
                <span className="flex-1 text-[13.5px] leading-snug">
                  {cant} × {p.n}
                </span>
                <span className="cifra text-[14px] font-semibold">{pesos(precio(p) * cant)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 pt-3 border-t border-chapa text-[15px] space-y-1.5">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="cifra">{pesos(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Envío</dt>
              <dd className="cifra">{envio ? (envio.precio ? pesos(envio.precio) : "Sin cargo") : "A elegir"}</dd>
            </div>
            <div className="flex justify-between pt-2 text-[20px] font-bold">
              <dt>Total</dt>
              <dd className="cifra">{pesos(subtotal + (envio?.precio ?? 0))}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Campo({ id, label, value, onChange, error, type = "text", auto, inputMode, opcional, max }: { id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; type?: string; auto?: string; inputMode?: "numeric"; opcional?: boolean; max?: number }) {
  return (
    <div className="mb-4">
      <label htmlFor={`f-${id}`} className="block text-[14px] font-semibold mb-1.5">
        {label} {opcional && <span className="font-normal text-acero">(opcional)</span>}
      </label>
      <input
        id={`f-${id}`}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={auto}
        inputMode={inputMode}
        maxLength={max}
        aria-invalid={!!error}
        aria-describedby={error ? `e-${id}` : undefined}
        className={`w-full h-12 px-3 border bg-white text-[15.5px] outline-none ${error ? "border-acento" : "border-chapa focus:border-hierro"}`}
      />
      {error && (
        <p id={`e-${id}`} className="mt-1 text-[13.5px] text-error">
          {error}
        </p>
      )}
    </div>
  );
}

function Confirmacion({ pedido }: { pedido: Pedido }) {
  const andreani = pedido.envio.tipo === "domicilio" || pedido.envio.tipo === "sucursal";
  const pasos = ["Pedido", "Pago", andreani ? "Despachado" : "Preparado", andreani ? "Entregado" : pedido.envio.tipo === "retiro" ? "Retirado" : "Instalado"];
  const hechos = pedido.estado === "Pagado" ? 2 : 1;
  return (
    <div className="mx-auto max-w-[720px] px-4 py-16 md:py-24 text-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.5, bounce: 0.25 }} className="w-16 h-16 mx-auto grid place-items-center bg-ok-claro text-ok text-3xl">
        ✓
      </motion.div>
      <h1 className="display text-[30px] md:text-[40px] mt-6">Pedido #{pedido.nro} confirmado</h1>
      <p className="mt-4 text-[17px] text-[#3b4552]">
        Gracias, {pedido.cliente.nombre.split(" ")[0]}. Te mandamos el detalle a {pedido.cliente.email}.{" "}
        {andreani ? "Cuando lo despachemos te llega el número de seguimiento de Andreani." : pedido.envio.tipo === "retiro" ? "Te avisamos por WhatsApp cuando esté listo para retirar." : "Te llamamos para coordinar la instalación."}
      </p>
      <ol className="mt-10 grid grid-cols-4 relative" aria-label="Estado del pedido">
        <span aria-hidden className="absolute top-[9px] left-[12.5%] right-[12.5%] h-[2px] bg-chapa" />
        <motion.span aria-hidden className="absolute top-[9px] left-[12.5%] h-[2px] bg-ok origin-left" initial={{ width: 0 }} animate={{ width: `${((hechos - 1) / 3) * 75}%` }} transition={{ duration: 0.6, delay: 0.3, ease: [0.23, 1, 0.32, 1] }} />
        {pasos.map((t, i) => (
          <li key={t} className="relative text-[13px]">
            <span className={`block w-5 h-5 mx-auto rounded-full border-[3px] border-white ${i < hechos ? "bg-ok" : "bg-chapa"}`} />
            <span className={`block mt-2 ${i < hechos ? "font-semibold" : "text-acero"}`}>{t}</span>
          </li>
        ))}
      </ol>
      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Link href="/tienda" className="presionable inline-flex h-12 items-center px-6 border border-hierro font-semibold hover:bg-hierro hover:text-white">
          Seguir comprando
        </Link>
        <Link href="/panel" className="presionable inline-flex h-12 items-center px-6 bg-hierro text-white font-semibold hover:bg-black">
          Demo: ver cómo le llega a Acondair
        </Link>
      </div>
    </div>
  );
}
