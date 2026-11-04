// Datos reales tomados de acondair.com.ar (noviembre 2026)
export const CONTACTO = {
  direccion: "Undiano 460",
  ciudad: "Bahía Blanca",
  cp: "8000",
  provincia: "Buenos Aires",
  telefono: "0800-345-9995",
  telHref: "tel:08003459995",
  whatsapp: "+54 9 291 503-6192",
  waNumero: "5492915036192",
  email: "info@acondair.com.ar",
  horario: "Lunes a viernes de 8:30 a 12:30 y de 15:00 a 18:00",
  instagram: "https://www.instagram.com/acondair.climatizacion/",
};

export const wa = (texto: string) =>
  `https://wa.me/${CONTACTO.waNumero}?text=${encodeURIComponent(texto)}`;

// Cifras publicadas por la empresa en su web actual
export const CIFRAS = [
  { valor: 60, sufijo: "", etiqueta: "años en climatización", nota: "Fundada en 1963" },
  { valor: 800, sufijo: "", etiqueta: "obras realizadas", nota: "Casas, comercios y edificios públicos" },
  { valor: 34000, sufijo: "", etiqueta: "ventas efectuadas", nota: "En el local y en obra" },
];

export const OBRAS = [
  {
    slug: "natatorio-barlovento",
    nombre: "Natatorio Barlovento",
    tipo: "Piscina cubierta",
    img: "/obras/obra-barlovento.jpg",
    texto: "Climatización de la ampliación del natatorio, con climatización de paredes para bajar la condensación por humedad relativa.",
  },
  {
    slug: "hospital-municipal",
    nombre: "Hospital Municipal",
    tipo: "Edificio público",
    img: "/obras/obra-hospital.jpg",
    texto: "Climatización de oficinas y directorio del Hospital Municipal de Bahía Blanca.",
  },
  {
    slug: "oficinas-land",
    nombre: "Oficinas Land",
    tipo: "Oficinas",
    img: "/obras/obra-land.jpg",
    texto: "Climatización de oficinas.",
  },
  {
    slug: "colegio-el-solar",
    nombre: "Colegio El Solar",
    tipo: "Escuela",
    img: "/obras/obra-elsolar.png",
    texto: "[DATO REAL: descripción de la obra, en la web actual figura texto de ejemplo]",
  },
];

export const MARCAS = ["ASUA", "BGH", "Caldaia", "Ferroli", "Flowing", "Fedders", "Gree", "Luxor", "Pluvius", "Runway", "Westric"];

export const GARANTIAS = [
  {
    titulo: "Garantía oficial atendida por nosotros",
    texto: "Somos distribuidores oficiales de lo que vendemos. Las garantías las atiende personal propio, no tercerizado.",
  },
  {
    titulo: "Servicio técnico propio",
    texto: "Todas las instalaciones tienen post-venta propia y stock permanente de repuestos.",
  },
  {
    titulo: "Stock de repuestos",
    texto: "Repuestos de todas las marcas que distribuimos, en el local de Undiano 460.",
  },
];

export const FINANCIACION = [
  { nombre: "Mercado Pago", detalle: "Tarjetas de crédito y débito, en cuotas." },
  { nombre: "Cuota Simple", detalle: "Plan nacional para productos seleccionados." },
  { nombre: "Banco Provincia", detalle: "Promociones vigentes con Cuenta DNI y tarjetas." },
  { nombre: "Banco Nación", detalle: "Promociones vigentes con tarjetas Nación." },
];

// Equipo publicado en la página "La Empresa"
export const EQUIPO = ["José Gallego", "Fabián Soria", "Christian Milazzo", "Pablo Scopettuolo", "Damián Martín"];

export const SERVICIOS = [
  "Venta de insumos para calefacción y aire acondicionado.",
  "Instalación y mantenimiento de sistemas de climatización.",
  "Servicio técnico propio para atender las garantías oficiales de los productos ofrecidos.",
  "Diseño y consultoría para proyectos de climatización.",
  "Soluciones de eficiencia energética.",
];
