# Acondair: web nueva (etapa 2)

Sitio en Next.js 16 + Tailwind 4 + Motion que reemplaza el WordPress/PHP 7.4 actual.

Demo publicada: https://paziti.github.io/acondair-web/ (versión estática: sin redirecciones 301 ni optimización de imágenes; se publica sola con cada push a `main`, ver `.github/workflows/pages.yml`).

## Correr
```
npm install
npm run build
npm start        # http://localhost:3000
```

## Qué tiene
- Inicio con calculadora de kcal/h y frigorías que recomienda equipos de la tienda.
- 10 páginas de sistemas con el texto real de la web actual.
- Diseño fiel a la web actual (colores, Montserrat, slider, bandas azules, pie de 3 columnas). Ver DESIGN.md.
- Tienda con los 55 productos, búsqueda, categorías, ficha con cotizador de envío.
- Precios en dólares (lista) mostrados en pesos con el dólar BNA venta, que se refresca cada 10 minutos
  (demo: dolarapi.com; en producción lo escribe el módulo que José ya tiene conectado al ERP).
- Checkout en 3 pasos: datos, entrega (Andreani domicilio/sucursal, instalación en Bahía, retiro), pago.
- Panel oculto en /panel: cotización del dólar (actualizar o fijar a mano), precio en US$, stock, peso y medidas editables, aumento de precios por categoría, pedidos y envíos.
- SEO: metadatos por página, JSON-LD (HVACBusiness y Product), sitemap.xml, robots.txt y redirecciones 301/308 desde todas las URLs viejas de WordPress.

## Simulado en esta demo (para producción)
- Envío: `src/lib/envio.ts` usa tarifas de ejemplo. Reemplazar por la API de Andreani (necesita contrato y credenciales).
- Pago: el botón de Mercado Pago no cobra. Integrar Checkout Pro + webhook de pago acreditado.
- Carrito, pedidos y cambios del panel viven en localStorage. Pasar a base de datos (Supabase/Postgres) con login real del panel.
- Formulario de contacto: abre el mail del usuario. Pasar a envío desde servidor (Resend o similar).

## Pendiente de datos reales
- Descripción de la obra Colegio El Solar (en la web actual es texto de ejemplo).
- Puestos y fotos del equipo.
- Fotos de obras en mejor resolución (las actuales son de 800 px).
- Pesos y medidas reales de los 55 productos (los de la demo son estimados por tipo).
