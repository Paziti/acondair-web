// Solo para la versión estática de GitHub Pages: sirve las imágenes tal cual, con el prefijo /acondair-web.
export default function cargadorImagen({ src, width }: { src: string; width: number }) {
  if (/^https?:/.test(src)) return src;
  return `${process.env.NEXT_PUBLIC_BASE ?? ""}${src}?w=${width}`;
}
