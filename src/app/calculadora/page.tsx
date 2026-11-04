import type { Metadata } from "next";
import { Calculadora } from "@/components/Calculadora";

export const metadata: Metadata = {
  title: "Calculadora de calefacción y frigorías",
  description: "Calculá cuántas kcal/h necesita tu casa o cuántas frigorías tu ambiente, y qué caldera, radiadores o aire acondicionado te sirven.",
  alternates: { canonical: "/calculadora" },
};

export default function PaginaCalculadora() {
  return (
    <section className="mx-auto max-w-[1100px] px-4 md:px-6 pt-10 md:pt-16 pb-20">
      <h1 className="display text-[40px] sm:text-[52px] md:text-[60px] max-w-3xl">¿Qué equipo necesito?</h1>
      <p className="mt-5 text-[18px] leading-relaxed text-[#3b4552] max-w-2xl mb-10">
        Mové la superficie y la altura del techo. Te mostramos la potencia aproximada y los equipos de la tienda que alcanzan. Para el número exacto hacemos el balance térmico sin cargo.
      </p>
      <Calculadora />
    </section>
  );
}
