import type { Metadata } from "next";
import { FormularioContacto } from "@/components/FormularioContacto";
import { AbiertoAhora } from "@/components/AbiertoAhora";
import { CONTACTO, wa } from "@/data/sitio";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Acondair Climatización: Undiano 460, Bahía Blanca. Teléfono 0800-345-9995, WhatsApp 291 503-6192. Lunes a viernes de 8:30 a 12:30 y de 15 a 18.",
  alternates: { canonical: "/contacto" },
};

export default function Contacto() {
  return (
    <section className="mx-auto max-w-[1240px] px-4 md:px-6 pt-10 md:pt-16 pb-20 grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16">
      <div>
        <h1 className="display text-[40px] sm:text-[52px] md:text-[60px]">Contacto</h1>
        <p className="mt-5 text-[18px] leading-relaxed text-[#3b4552] max-w-lg">Contanos qué querés climatizar. Si es una casa, con los metros cuadrados y la ciudad ya podemos darte una primera idea.</p>
        <dl className="mt-10 divide-y divide-chapa border-y border-chapa text-[16.5px]">
          <div className="py-4 grid grid-cols-[130px_1fr] gap-4">
            <dt className="text-acero">Casa central</dt>
            <dd>
              {CONTACTO.direccion}, ({CONTACTO.cp}) {CONTACTO.ciudad}, Pcia. de Buenos Aires
            </dd>
          </div>
          <div className="py-4 grid grid-cols-[130px_1fr] gap-4">
            <dt className="text-acero">Horario</dt>
            <dd>
              <AbiertoAhora oscuro={false} />
            </dd>
          </div>
          <div className="py-4 grid grid-cols-[130px_1fr] gap-4">
            <dt className="text-acero">Teléfono</dt>
            <dd>
              <a href={CONTACTO.telHref} className="underline underline-offset-2 hover:text-acento">
                {CONTACTO.telefono}
              </a>
            </dd>
          </div>
          <div className="py-4 grid grid-cols-[130px_1fr] gap-4">
            <dt className="text-acero">WhatsApp</dt>
            <dd>
              <a href={wa("Hola Acondair")} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-acento">
                {CONTACTO.whatsapp}
              </a>
            </dd>
          </div>
          <div className="py-4 grid grid-cols-[130px_1fr] gap-4">
            <dt className="text-acero">Email</dt>
            <dd>
              <a href={`mailto:${CONTACTO.email}`} className="underline underline-offset-2 hover:text-acento">
                {CONTACTO.email}
              </a>
            </dd>
          </div>
        </dl>
        <div className="mt-8 placa h-[300px]">
          <span className="remaches" />
          <iframe title="Mapa de Acondair" loading="lazy" className="absolute inset-[18px] w-[calc(100%-36px)] h-[calc(100%-36px)] border-0" src="https://maps.google.com/maps?q=Undiano%20460%2C%20Bah%C3%ADa%20Blanca&z=15&output=embed" />
        </div>
      </div>
      <div className="lg:pt-4">
        <FormularioContacto />
      </div>
    </section>
  );
}
