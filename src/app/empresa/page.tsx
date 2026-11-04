import type { Metadata } from "next";
import { EQUIPO, SERVICIOS } from "@/data/sitio";

export const metadata: Metadata = {
  title: "La empresa",
  description: "Acondair Climatización: empresa de Bahía Blanca fundada en 1963, dedicada a la ingeniería termomecánica, la venta, instalación y servicio técnico de sistemas de climatización.",
  alternates: { canonical: "/empresa" },
};

const iniciales = (n: string) =>
  n
    .split(" ")
    .map((x) => x[0])
    .join("");

export default function Empresa() {
  return (
    <>
      <section className="mx-auto max-w-[1240px] px-4 md:px-6 pt-10 md:pt-16 pb-16 md:pb-24">
        <p className="cifra text-[96px] md:text-[180px] font-extrabold leading-[0.85] text-acento" aria-hidden>
          1963
        </p>
        <h1 className="display text-[36px] sm:text-[48px] md:text-[58px] mt-4 max-w-4xl">Más de seis décadas haciendo confort en Bahía Blanca.</h1>
        <div className="mt-10 grid md:grid-cols-2 gap-8 md:gap-14 text-[17px] leading-relaxed text-[#3b4552]">
          <p>
            Acondair fue fundada en 1963 y desde entonces se dedica a la ingeniería termomecánica: diseña y proyecta la solución más conveniente para cada necesidad. Con lo logrado en más de seis décadas acumulamos experiencia y conocimiento para desarrollar soluciones a medida.
          </p>
          <p>
            Hoy se sumaron jóvenes líderes y emprendedores que unen experiencia y juventud. Los pilares siguen siendo los mismos con los que nació la empresa: respeto por el cliente, atención personalizada, excelencia y eficiencia en el trabajo.
          </p>
        </div>
      </section>

      <section className="border-y border-chapa bg-papel">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 py-16 md:py-20 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
          <h2 className="display text-[30px] md:text-[38px]">Qué hacemos</h2>
          <ul className="divide-y divide-chapa border-y border-chapa">
            {SERVICIOS.map((s) => (
              <li key={s} className="py-4 text-[17px]">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 md:px-6 py-16 md:py-24 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
        <div>
          <h2 className="display text-[30px] md:text-[38px]">Qué nos hace diferentes</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-[#3b4552]">
            El servicio personalizado y profesional, y el esfuerzo por entender lo que necesita cada cliente. Eso nos permite ofrecer soluciones a medida que garanticen confort, calidad y la tecnología necesaria.
          </p>
          <p className="mt-4 text-[17px] leading-relaxed text-[#3b4552]">Nuestro objetivo es seguir innovando para ofrecer climatización sostenible y eficiente.</p>
        </div>
        <div>
          <h2 className="display text-[22px] mb-5">Equipo</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {EQUIPO.map((n) => (
              <li key={n} className="flex items-center gap-4 border border-chapa p-4">
                <span aria-hidden className="w-12 h-12 grid place-items-center bg-hierro text-white display text-[15px]">
                  {iniciales(n)}
                </span>
                <span>
                  <span className="block font-semibold">{n}</span>
                  <span className="block text-[13.5px] text-aviso">[DATO REAL: puesto]</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13.5px] text-acero">Faltan las fotos y los puestos: los pedimos al equipo antes de publicar.</p>
        </div>
      </section>
    </>
  );
}
