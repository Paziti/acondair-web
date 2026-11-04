import type { NextConfig } from "next";
import redirecciones from "./src/data/redirecciones.json";

// GITHUB_PAGES=true arma la versión estática para https://paziti.github.io/acondair-web/
// (sin servidor: no hay redirecciones 301 ni optimización de imágenes).
const paginas = process.env.GITHUB_PAGES === "true";
const base = paginas ? "/acondair-web" : "";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_BASE: base },
  ...(paginas
    ? {
        output: "export",
        basePath: base,
        trailingSlash: true,
        images: { loader: "custom", loaderFile: "./src/lib/cargador-imagen.ts" },
      }
    : {
        // URLs de la web WordPress anterior -> nuevas, con 301 para no perder posicionamiento
        async redirects() {
          return [
            ...(redirecciones as [string, string][]).flatMap(([desde, hacia]) => [
              { source: desde, destination: hacia, permanent: true },
              { source: `${desde}/`, destination: hacia, permanent: true },
            ]),
            { source: "/portfolio/:slug*", destination: "/obras", permanent: true },
            { source: "/tienda/", destination: "/tienda", permanent: true },
          ];
        },
      }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
