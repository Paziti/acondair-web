import type { NextConfig } from "next";
import redirecciones from "./src/data/redirecciones.json";

const nextConfig: NextConfig = {
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
