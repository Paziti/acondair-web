"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CONTACTO } from "@/data/sitio";

// Demo: el formulario arma el mail y lo abre en el programa de correo.
// En producción se envía desde el servidor (por ejemplo con Resend) y queda registrado en el panel.
const TEMAS = ["Presupuesto de instalación", "Consulta por un producto", "Service o garantía", "Obra o proyecto", "Otro"];

export function FormularioContacto() {
  const [f, setF] = useState({ nombre: "", email: "", tel: "", tema: TEMAS[0], mensaje: "" });
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviado, setEnviado] = useState(false);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.nombre.trim().length < 3) er.nombre = "Escribí tu nombre.";
    if (!/^\S+@\S+\.\S+$/.test(f.email) && f.tel.replace(/\D/g, "").length < 8) er.email = "Dejanos un email o un celular para responderte.";
    if (f.mensaje.trim().length < 10) er.mensaje = "Contanos un poco más (al menos 10 caracteres).";
    setErrores(er);
    if (Object.keys(er).length) return;
    const cuerpo = `${f.mensaje}\n\n${f.nombre}\n${f.email}\n${f.tel}`;
    window.location.href = `mailto:${CONTACTO.email}?subject=${encodeURIComponent(`${f.tema} (web)`)}&body=${encodeURIComponent(cuerpo)}`;
    setEnviado(true);
  };

  if (enviado)
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} className="placa p-8" role="status">
        <span className="remaches" />
        <p className="display text-[24px]">Listo, {f.nombre.split(" ")[0]}</p>
        <p className="mt-3 text-[16px] leading-relaxed">Se abrió tu programa de correo con el mensaje armado. Envialo y te respondemos en horario de atención.</p>
        <button onClick={() => setEnviado(false)} className="mt-6 underline underline-offset-4 font-semibold hover:text-acento">
          Escribir otro mensaje
        </button>
      </motion.div>
    );

  const campo = "w-full border bg-white px-3 text-[15.5px] outline-none";
  return (
    <form onSubmit={enviar} noValidate className="placa p-6 md:p-8">
      <span className="remaches" />
      <h2 className="display text-[24px] mb-6">Dejanos un mensaje</h2>
      <div className="mb-4">
        <label htmlFor="c-nombre" className="block text-[14px] font-semibold mb-1.5">
          Nombre y apellido
        </label>
        <input id="c-nombre" autoComplete="name" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} aria-invalid={!!errores.nombre} className={`${campo} h-12 ${errores.nombre ? "border-acento" : "border-chapa focus:border-hierro"}`} />
        {errores.nombre && <p className="mt-1 text-[13.5px] text-error">{errores.nombre}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-x-4">
        <div className="mb-4">
          <label htmlFor="c-email" className="block text-[14px] font-semibold mb-1.5">
            Email
          </label>
          <input id="c-email" type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-invalid={!!errores.email} className={`${campo} h-12 ${errores.email ? "border-acento" : "border-chapa focus:border-hierro"}`} />
        </div>
        <div className="mb-4">
          <label htmlFor="c-tel" className="block text-[14px] font-semibold mb-1.5">
            Celular
          </label>
          <input id="c-tel" type="tel" autoComplete="tel" value={f.tel} onChange={(e) => setF({ ...f, tel: e.target.value })} className={`${campo} h-12 border-chapa focus:border-hierro`} />
        </div>
      </div>
      {errores.email && <p className="-mt-2 mb-4 text-[13.5px] text-error">{errores.email}</p>}
      <div className="mb-4">
        <label htmlFor="c-tema" className="block text-[14px] font-semibold mb-1.5">
          Motivo
        </label>
        <select id="c-tema" value={f.tema} onChange={(e) => setF({ ...f, tema: e.target.value })} className={`${campo} h-12 border-chapa focus:border-hierro`}>
          {TEMAS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="mb-5">
        <label htmlFor="c-msg" className="block text-[14px] font-semibold mb-1.5">
          Mensaje
        </label>
        <textarea id="c-msg" rows={5} value={f.mensaje} onChange={(e) => setF({ ...f, mensaje: e.target.value })} aria-invalid={!!errores.mensaje} placeholder="Ej.: casa de 120 m² en Bahía Blanca, quiero radiadores con caldera doble servicio" className={`${campo} py-3 ${errores.mensaje ? "border-acento" : "border-chapa focus:border-hierro"}`} />
        {errores.mensaje && <p className="mt-1 text-[13.5px] text-error">{errores.mensaje}</p>}
      </div>
      <button className="presionable w-full h-[54px] bg-acento text-white font-semibold text-[16px] hover:bg-acento-oscuro">Enviar mensaje</button>
    </form>
  );
}
