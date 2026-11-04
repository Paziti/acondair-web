import type { Bloque } from "@/lib/catalogo";

// Convierte los bloques de texto de la web actual (títulos, párrafos, listas) en HTML semántico.
export function Articulo({ bloques }: { bloques: Bloque[] }) {
  const out: React.ReactNode[] = [];
  let lista: string[] = [];
  const cerrarLista = (k: number) => {
    if (lista.length) {
      out.push(
        <ul key={`ul-${k}`}>
          {lista.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>,
      );
      lista = [];
    }
  };
  bloques.forEach(([t, x], i) => {
    if (t === "li") {
      lista.push(x);
      return;
    }
    cerrarLista(i);
    if (t === "h")
      out.push(
        <h2 key={i} className="display text-[22px] md:text-[26px]">
          {x}
        </h2>,
      );
    else out.push(<p key={i}>{x}</p>);
  });
  cerrarLista(bloques.length);
  return <div className="articulo text-[16.5px] max-w-[68ch]">{out}</div>;
}
