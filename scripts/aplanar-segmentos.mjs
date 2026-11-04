// GitHub Pages no reescribe URLs. Next exporta los segmentos de prefetch como carpetas
// (empresa/__next.empresa/__PAGE__.txt) pero el navegador los pide con puntos
// (empresa/__next.empresa.__PAGE__.txt). Este script deja una copia con el nombre que se pide.
import { cpSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

let copias = 0;
function archivos(dir, prefijo) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) archivos(p, `${prefijo}.${n}`);
    else cpSync(p, join(raizActual, `${prefijo}.${n}`)), copias++;
  }
}
let raizActual = "";
function recorrer(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (!statSync(p).isDirectory()) continue;
    if (n.startsWith("__next.")) {
      raizActual = dir;
      archivos(p, n);
    } else recorrer(p);
  }
}
recorrer("out");
console.log(`aplanar-segmentos: ${copias} archivos copiados`);
