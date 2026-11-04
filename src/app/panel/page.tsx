"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTienda } from "@/lib/tienda-estado";
import { CATEGORIAS, PRODUCTOS, pesos, productoPorId } from "@/lib/catalogo";

type Tab = "productos" | "pedidos" | "envios";

export default function Panel() {
  const [entro, setEntro] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("productos");
  useEffect(() => {
    try {
      setEntro(sessionStorage.getItem("acondair_panel") === "1");
    } catch {
      setEntro(false);
    }
  }, []);

  if (entro === null) return <p className="p-10 text-acero">Cargando…</p>;
  if (!entro) return <Ingreso onOk={() => setEntro(true)} />;

  return (
    <div>
      <header className="bg-hierro text-white">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <p className="display text-[18px]">Acondair, gestión</p>
          <div className="flex items-center gap-5 text-[14px]">
            <Link href="/" className="text-white/80 hover:text-white underline underline-offset-2">
              Ver la web
            </Link>
            <button
              onClick={() => {
                try {
                  sessionStorage.removeItem("acondair_panel");
                } catch {}
                setEntro(false);
              }}
              className="text-white/80 hover:text-white underline underline-offset-2"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-chapa" aria-label="Secciones del panel">
        <div role="tablist" className="mx-auto max-w-[1280px] px-4 md:px-6 flex gap-1 overflow-x-auto">
          {(
            [
              ["productos", "Productos y stock"],
              ["pedidos", "Pedidos"],
              ["envios", "Envíos Andreani"],
            ] as const
          ).map(([k, t]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`relative h-14 px-4 text-[15px] font-semibold whitespace-nowrap ${tab === k ? "text-hierro" : "text-acero hover:text-hierro"}`}>
              {t}
              {tab === k && <motion.span layoutId="panel-tab" className="absolute left-0 right-0 bottom-0 h-[3px] bg-acento" transition={{ duration: 0.25, ease: [0.77, 0, 0.175, 1] }} />}
            </button>
          ))}
        </div>
      </nav>
      <main className="mx-auto max-w-[1280px] px-4 md:px-6 py-8 pb-20">
        {tab === "productos" && <Productos />}
        {tab === "pedidos" && <Pedidos />}
        {tab === "envios" && <Envios />}
      </main>
    </div>
  );
}

function Ingreso({ onOk }: { onOk: () => void }) {
  const [u, setU] = useState("");
  const [c, setC] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="min-h-dvh grid place-items-center px-4">
      <form
        className="placa w-full max-w-[400px] p-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (!u.trim() || c.length < 4) {
            setErr("Completá usuario y contraseña (en la demo sirve cualquiera de 4 caracteres o más).");
            return;
          }
          try {
            sessionStorage.setItem("acondair_panel", "1");
          } catch {}
          onOk();
        }}
      >
        <span className="remaches" />
        <h1 className="display text-[24px]">Panel de gestión</h1>
        <p className="mt-2 text-[14.5px] text-acero">Acceso solo para el personal. No está enlazado desde la web pública.</p>
        <label htmlFor="u" className="block mt-6 text-[14px] font-semibold mb-1.5">
          Usuario
        </label>
        <input id="u" autoComplete="username" value={u} onChange={(e) => setU(e.target.value)} placeholder="Tu usuario" className="w-full h-12 px-3 border border-chapa focus:border-hierro outline-none bg-white" />
        <label htmlFor="c" className="block mt-4 text-[14px] font-semibold mb-1.5">
          Contraseña
        </label>
        <input id="c" type="password" autoComplete="current-password" value={c} onChange={(e) => setC(e.target.value)} className="w-full h-12 px-3 border border-chapa focus:border-hierro outline-none bg-white" />
        {err && <p className="mt-3 text-[13.5px] text-error">{err}</p>}
        <button className="presionable mt-6 w-full h-12 bg-hierro text-white font-semibold hover:bg-black">Entrar</button>
      </form>
    </div>
  );
}

function Productos() {
  const { meta, setMeta, precio, precioUsd, ajustarPrecios, avisar, listo } = useTienda();
  const [filtro, setFiltro] = useState<"todos" | "sin-peso" | "stock-bajo">("sin-peso");
  const [q, setQ] = useState("");
  const [masivo, setMasivo] = useState(false);
  const sinPeso = PRODUCTOS.filter((p) => !meta[p.id]?.confirmado).length;
  const bajo = PRODUCTOS.filter((p) => (meta[p.id]?.stock ?? 0) <= 2).length;

  const lista = useMemo(
    () =>
      PRODUCTOS.filter((p) => {
        const m = meta[p.id];
        if (filtro === "sin-peso" && m?.confirmado) return false;
        if (filtro === "stock-bajo" && (m?.stock ?? 0) > 2) return false;
        return !q || p.n.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase());
      }),
    [meta, filtro, q],
  );

  if (!listo) return <p className="text-acero">Cargando productos…</p>;

  const num = (v: string) => parseFloat(v.replace(",", ".")) || 0;

  return (
    <>
      {/* lo que decide esta pantalla: qué productos todavía no se pueden enviar */}
      <div className={`p-5 md:p-6 mb-6 border ${sinPeso ? "bg-aviso-claro border-[#f0d3a4]" : "bg-ok-claro border-[#bfe3cb]"}`}>
        {sinPeso ? (
          <>
            <p className="display text-[20px] md:text-[24px] text-aviso">
              {sinPeso} de {PRODUCTOS.length} productos sin peso y medidas confirmados
            </p>
            <p className="mt-2 text-[15px] text-[#5a3a08] max-w-3xl">
              Sin esos datos Andreani no puede cotizar el envío, y por eso hoy el checkout se corta. Los valores en naranja son estimados por tipo de producto: corregilos con la balanza y el metro y quedan confirmados.
            </p>
          </>
        ) : (
          <p className="display text-[20px] text-ok">Todos los productos tienen peso y medidas. Andreani ya puede cotizar todo el catálogo.</p>
        )}
      </div>

      <Cotizacion />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex border border-hierro">
          {(
            [
              ["sin-peso", `Peso sin confirmar (${sinPeso})`],
              ["stock-bajo", `Stock bajo (${bajo})`],
              ["todos", `Todos (${PRODUCTOS.length})`],
            ] as const
          ).map(([k, t]) => (
            <button key={k} aria-pressed={filtro === k} onClick={() => setFiltro(k)} className={`h-10 px-3.5 text-[14px] font-medium ${filtro === k ? "bg-hierro text-white" : "bg-white hover:bg-papel"}`}>
              {t}
            </button>
          ))}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto o código" aria-label="Buscar producto" className="h-10 px-3 border border-chapa bg-white flex-1 min-w-[180px] outline-none focus:border-hierro" />
        <button onClick={() => setMasivo(true)} className="presionable h-10 px-4 bg-hierro text-white text-[14px] font-semibold hover:bg-black">
          Actualizar precios en bloque
        </button>
      </div>

      <div className="bg-white border border-chapa overflow-x-auto">
        {lista.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold">{filtro === "sin-peso" ? "No queda ningún producto sin peso confirmado." : filtro === "stock-bajo" ? "Ningún producto tiene stock bajo." : `No hay productos que coincidan con “${q}”.`}</p>
            <button onClick={() => { setFiltro("todos"); setQ(""); }} className="mt-3 underline underline-offset-2 font-semibold">
              Ver todos los productos
            </button>
          </div>
        ) : (
          <table className="w-full text-[14px] min-w-[960px]">
            <thead>
              <tr className="text-left text-[13px] text-acero bg-papel border-b border-chapa">
                <th className="py-2.5 px-3 font-semibold" colSpan={2}>
                  Producto
                </th>
                <th className="py-2.5 px-3 font-semibold">Precio de lista (US$)</th>
                <th className="py-2.5 px-3 font-semibold">Stock</th>
                <th className="py-2.5 px-3 font-semibold">Peso (kg)</th>
                <th className="py-2.5 px-3 font-semibold">Largo × ancho × alto (cm)</th>
                <th className="py-2.5 px-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => {
                const m = meta[p.id];
                const est = !m.confirmado;
                const inp = `h-9 px-2 border cifra bg-white outline-none focus:border-hierro ${est ? "border-[#f0c27a] bg-aviso-claro" : "border-chapa"}`;
                return (
                  <tr key={p.id} className="border-b border-chapa last:border-0">
                    <td className="py-2 pl-3 w-12">
                      <Image src={p.img} alt="" width={40} height={40} className="w-10 h-10 object-contain bg-papel" />
                    </td>
                    <td className="py-2 px-3 min-w-[240px]">
                      <span className="block font-medium leading-snug">{p.n}</span>
                      <span className="block text-[12.5px] text-acero">{p.sku || "sin código"}, {p.c[0]}</span>
                    </td>
                    <td className="py-2 px-3">
                      <input aria-label={`Precio en dólares de ${p.n}`} className={`${inp.replace(est ? "border-[#f0c27a] bg-aviso-claro" : "", "border-chapa")} w-[110px]`} defaultValue={String(precioUsd(p)).replace(".", ",")} key={`pr-${precioUsd(p)}`} onBlur={(e) => { const v = Math.round(num(e.target.value) * 100) / 100; if (v && v !== precioUsd(p)) { setMeta(p.id, { usd: v }); avisar("Precio guardado"); } }} />
                      <span className="block mt-0.5 text-[12.5px] text-acero cifra">{pesos(precio(p))} en la web</span>
                    </td>
                    <td className="py-2 px-3">
                      <input aria-label={`Stock de ${p.n}`} className={`h-9 px-2 border border-chapa cifra w-[64px] outline-none focus:border-hierro ${m.stock <= 2 ? "text-error font-bold" : ""}`} defaultValue={m.stock} key={`st-${m.stock}`} onBlur={(e) => { const v = Math.max(0, Math.round(num(e.target.value))); if (v !== m.stock) { setMeta(p.id, { stock: v }); avisar("Stock guardado"); } }} />
                    </td>
                    <td className="py-2 px-3">
                      <input aria-label={`Peso de ${p.n}`} className={`${inp} w-[72px]`} defaultValue={String(m.peso).replace(".", ",")} key={`w-${m.peso}-${m.confirmado}`} onBlur={(e) => { const v = num(e.target.value); if (v && v !== m.peso) setMeta(p.id, { peso: v }); }} />
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {[0, 1, 2].map((i) => (
                        <input key={`d${i}-${m.medidas[i]}-${m.confirmado}`} aria-label={["Largo", "Ancho", "Alto"][i] + ` de ${p.n}`} className={`${inp} w-[58px] mr-1`} defaultValue={m.medidas[i]} onBlur={(e) => { const v = num(e.target.value); if (v && v !== m.medidas[i]) { const d = [...m.medidas]; d[i] = v; setMeta(p.id, { medidas: d }); } }} />
                      ))}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {est ? (
                        <button onClick={() => { setMeta(p.id, { confirmado: true }); avisar(`${p.n}: peso y medidas confirmados`); }} className="presionable h-9 px-3 border border-hierro text-[13px] font-semibold hover:bg-hierro hover:text-white whitespace-nowrap">
                          Confirmar datos
                        </button>
                      ) : (
                        <span className="text-[13px] text-ok font-semibold whitespace-nowrap">Listo para Andreani</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>{masivo && <Masivo onCerrar={() => setMasivo(false)} onAplicar={(cat, pct) => { const n = ajustarPrecios(cat, pct); avisar(`${n} precios actualizados (${pct > 0 ? "+" : ""}${pct}%)`); setMasivo(false); }} />}</AnimatePresence>
    </>
  );
}

// El dólar con el que se pasan a pesos las listas en dólares. Hoy lo actualiza el módulo de José cada 10 minutos.
function Cotizacion() {
  const { dolar, actualizarDolar, fijarDolar, avisar } = useTienda();
  const [cargando, setCargando] = useState(false);
  const hora = new Date(dolar.actualizado).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  const origen = dolar.fuente === "bna" ? "Banco Nación, se actualiza solo cada 10 minutos" : dolar.fuente === "manual" ? "cargado a mano, no se actualiza solo" : "valor de referencia del catálogo";
  return (
    <div className="mb-6 bg-white border border-chapa p-5 flex flex-wrap items-center gap-x-8 gap-y-4">
      <div>
        <p className="text-[13px] text-acero">Dólar BNA venta</p>
        <p className="cifra text-[28px] font-bold leading-tight">{pesos(dolar.valor)}</p>
        <p className="text-[12.5px] text-acero">
          {hora}, {origen}
        </p>
      </div>
      <p className="text-[14px] text-[#3b4552] max-w-md">Los precios se cargan en dólares y la web los muestra en pesos con esta cotización, como hoy hacen tu ERP y tu web.</p>
      <div className="flex flex-wrap items-center gap-2 ml-auto">
        <button
          disabled={cargando}
          onClick={async () => {
            setCargando(true);
            const ok = await actualizarDolar();
            setCargando(false);
            avisar(ok ? "Cotización actualizada desde el Banco Nación" : "No se pudo leer la cotización. Se mantiene la anterior.");
          }}
          className="presionable h-10 px-4 border border-hierro text-[14px] font-semibold hover:bg-hierro hover:text-white disabled:opacity-60"
        >
          {cargando ? "Consultando…" : "Actualizar ahora"}
        </button>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = parseFloat(String(new FormData(e.currentTarget).get("dolar")).replace(",", "."));
            if (!v || v < 100) return avisar("Ingresá una cotización válida, por ejemplo 1570");
            fijarDolar(v);
            avisar(`Cotización fijada en ${pesos(v)}`);
            e.currentTarget.reset();
          }}
          className="flex gap-2"
        >
          <input name="dolar" inputMode="decimal" placeholder="Fijar a mano" aria-label="Fijar cotización a mano" className="h-10 w-[130px] px-3 border border-chapa cifra outline-none focus:border-hierro" />
          <button className="presionable h-10 px-3 border border-chapa text-[14px] font-medium hover:border-hierro">Fijar</button>
        </form>
      </div>
    </div>
  );
}

function Masivo({ onCerrar, onAplicar }: { onCerrar: () => void; onAplicar: (cat: string, pct: number) => void }) {
  const [cat, setCat] = useState("Todas");
  const [pct, setPct] = useState("5");
  const [err, setErr] = useState("");
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onCerrar]);
  const n = PRODUCTOS.filter((p) => cat === "Todas" || p.c.includes(cat)).length;
  return (
    <>
      <motion.div className="fixed inset-0 z-[80] bg-hierro/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCerrar} />
      <motion.div role="dialog" aria-modal="true" aria-labelledby="masivo-t" className="fixed z-[81] left-1/2 top-1/2 w-[min(92vw,520px)] bg-white p-7 border border-hierro" style={{ x: "-50%", y: "-50%" }} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
        <h2 id="masivo-t" className="display text-[22px]">
          Actualizar precios en bloque
        </h2>
        <p className="mt-2 text-[14.5px] text-acero">Cuando llega la lista nueva del proveedor, aplicás el aumento por categoría en un paso en vez de editar producto por producto.</p>
        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            const v = parseFloat(pct.replace(",", "."));
            if (!v || v < -50 || v > 100) {
              setErr("Escribí un porcentaje entre -50 y 100.");
              return;
            }
            onAplicar(cat, v);
          }}
        >
          <div className="grid grid-cols-[1fr_120px] gap-3">
            <label className="block">
              <span className="block text-[14px] font-semibold mb-1.5">Categoría</span>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full h-11 px-3 border border-chapa outline-none focus:border-hierro">
                <option>Todas</option>
                {CATEGORIAS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-[14px] font-semibold mb-1.5">Aumento %</span>
              <input value={pct} onChange={(e) => setPct(e.target.value)} inputMode="decimal" className="w-full h-11 px-3 border border-chapa cifra outline-none focus:border-hierro" />
            </label>
          </div>
          {err && <p className="mt-2 text-[13.5px] text-error">{err}</p>}
          <p className="mt-3 text-[13.5px] text-acero">Afecta a {n} productos. En la versión final también se puede subir el Excel del proveedor y se actualiza por código.</p>
          <div className="mt-6 flex gap-3 justify-end">
            <button type="button" onClick={onCerrar} className="presionable h-11 px-5 border border-chapa font-semibold hover:border-hierro">
              Cancelar
            </button>
            <button className="presionable h-11 px-5 bg-hierro text-white font-semibold hover:bg-black">Aplicar a {n} productos</button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

function Pedidos() {
  const { pedidos, listo } = useTienda();
  if (!listo) return <p className="text-acero">Cargando pedidos…</p>;
  if (!pedidos.length)
    return (
      <div className="bg-white border border-chapa p-10 text-center">
        <p className="display text-[20px]">Todavía no entró ningún pedido web</p>
        <p className="mt-2 text-acero">Hacé una compra de prueba en la tienda y aparece acá al instante.</p>
        <Link href="/tienda" className="mt-5 inline-flex h-11 items-center px-5 bg-hierro text-white font-semibold">
          Ir a la tienda
        </Link>
      </div>
    );
  const porDespachar = pedidos.filter((p) => p.envio.tipo === "domicilio" || p.envio.tipo === "sucursal").length;
  const porInstalar = pedidos.filter((p) => p.envio.tipo === "instalacion").length;
  return (
    <>
      <p className="mb-5 text-[15.5px]">
        <b>{pedidos.length}</b> pedidos web, <b>{porDespachar}</b> para despachar por Andreani y <b>{porInstalar}</b> para coordinar instalación
      </p>
      <div className="bg-white border border-chapa overflow-x-auto">
        <table className="w-full text-[14px] min-w-[860px]">
          <thead>
            <tr className="text-left text-[13px] text-acero bg-papel border-b border-chapa">
              {["Pedido", "Cliente", "Productos", "Entrega", "Total", "Estado"].map((h) => (
                <th key={h} className="py-2.5 px-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pedidos.map((o) => (
              <tr key={o.nro} className="border-b border-chapa last:border-0 align-top">
                <td className="py-3 px-3">
                  <b className="cifra">#{o.nro}</b>
                  <span className="block text-[12.5px] text-acero">{o.fecha}</span>
                </td>
                <td className="py-3 px-3">
                  {o.cliente.nombre}
                  <span className="block text-[12.5px] text-acero">
                    {o.cliente.tel}, CP {o.cliente.cp}
                  </span>
                </td>
                <td className="py-3 px-3">
                  {o.items.map((it) => (
                    <span key={it.id} className="block">
                      {it.cant} × {productoPorId(it.id)?.n}
                    </span>
                  ))}
                </td>
                <td className="py-3 px-3">{o.envio.nombre}</td>
                <td className="py-3 px-3 cifra whitespace-nowrap font-semibold">{pesos(o.subtotal + o.envio.precio)}</td>
                <td className="py-3 px-3">
                  <span className={`inline-block px-2 py-1 text-[12.5px] font-semibold ${o.estado === "Pagado" ? "bg-ok-claro text-ok" : "bg-aviso-claro text-aviso"}`}>{o.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Envios() {
  const { pedidos, avisar, listo } = useTienda();
  if (!listo) return <p className="text-acero">Cargando envíos…</p>;
  const envios = pedidos.filter((p) => p.envio.tipo === "domicilio" || p.envio.tipo === "sucursal");
  return (
    <>
      <p className="mb-5 text-[15px] text-[#3b4552] max-w-3xl">Cuando el pago se acredita, el envío se da de alta solo en Andreani: se genera la etiqueta y el número de seguimiento, y al cliente le llega un mail con el link.</p>
      {!envios.length ? (
        <div className="bg-white border border-chapa p-10 text-center">
          <p className="display text-[20px]">No hay envíos para despachar</p>
          <p className="mt-2 text-acero">Aparecen acá los pedidos con entrega por Andreani.</p>
        </div>
      ) : (
        <div className="bg-white border border-chapa overflow-x-auto">
          <table className="w-full text-[14px] min-w-[820px]">
            <thead>
              <tr className="text-left text-[13px] text-acero bg-papel border-b border-chapa">
                {["Pedido", "Destino", "Peso facturable", "Servicio", "Seguimiento", ""].map((h) => (
                  <th key={h} className="py-2.5 px-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {envios.map((o) => (
                <tr key={o.nro} className="border-b border-chapa last:border-0">
                  <td className="py-3 px-3 cifra font-bold">#{o.nro}</td>
                  <td className="py-3 px-3">
                    {o.cliente.calle}, {o.cliente.ciudad} (CP {o.cliente.cp})
                  </td>
                  <td className="py-3 px-3 cifra">{o.envio.kg ? `${o.envio.kg.toFixed(1).replace(".", ",")} kg` : "Sin dato"}</td>
                  <td className="py-3 px-3">{o.envio.nombre}</td>
                  <td className="py-3 px-3">{o.estado === "Pagado" ? <span className="cifra">Demo {String(360000000 + o.nro * 7)}</span> : <span className="text-aviso font-medium">Espera el pago</span>}</td>
                  <td className="py-3 px-3 text-right">
                    {o.estado === "Pagado" && (
                      <button onClick={() => avisar("Demo: en la versión real descarga la etiqueta PDF de Andreani")} className="presionable h-9 px-3 border border-hierro text-[13px] font-semibold hover:bg-hierro hover:text-white">
                        Etiqueta PDF
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
