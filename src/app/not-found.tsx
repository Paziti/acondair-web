import Link from "next/link";

export default function NoEncontrada() {
  return (
    <section className="mx-auto max-w-[760px] px-4 py-24 md:py-32">
      <p className="cifra text-[96px] font-extrabold leading-none text-acento">404</p>
      <h1 className="display text-[34px] md:text-[44px] mt-4">Esta página no existe o cambió de dirección</h1>
      <p className="mt-4 text-[17px] text-[#3b4552]">Si venías de la web anterior, los sistemas y los productos ahora están en secciones nuevas.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/tienda" className="presionable inline-flex h-12 items-center px-6 bg-hierro text-white font-semibold">
          Ir a la tienda
        </Link>
        <Link href="/sistemas" className="presionable inline-flex h-12 items-center px-6 border border-hierro font-semibold">
          Ver los sistemas
        </Link>
      </div>
    </section>
  );
}
