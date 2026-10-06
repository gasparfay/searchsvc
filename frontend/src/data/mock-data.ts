import type { Site, CrawlSnapshot, ExtractedDocument, CrawlJob, Account } from "@/types";

export const MOCK_ACCOUNT: Account = {
  _id: "65f1a2b3c4d5e6f7a8b9c001",
  name: "Jason Sweet",
  email: "jason.sweet@acme.corp",
  apiKey: "123e4567-e89b-12d3-a456-426614174000",
  auth0Id: "google-oauth2|10928374651928374",
};

export const MOCK_SITES: Site[] = [
  {
    _id: "65f1a2b3c4d5e6f7a8b9c011",
    accountId: "65f1a2b3c4d5e6f7a8b9c001",
    name: "Tienda Ejemplo",
    url: "https://example.com",
    maxDepth: 2,
    frequency: "Cada 6 horas",
    status: "activo",
    docsCount: 1842,
    lastRun: "Hace 2 horas",
    extractorSnippet: `function extract(request, response) {\n  const $ = response.body;\n  return [{\n    name: $('title').text(),\n    url: request.url,\n    description: $('meta[name="description"]').attr('content') || $('p').first().text()\n  }];\n}`,
    pageResolverSnippet: `function pageResolver(request, response) {\n  const $ = response.body;\n  const links = [];\n  $('a[href]').each(function() {\n    const href = $(this).attr('href');\n    if (href && href.startsWith('/')) links.push(request.baseUrl + href);\n  });\n  return links;\n}`,
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c012",
    accountId: "65f1a2b3c4d5e6f7a8b9c001",
    name: "Blog Corporativo",
    url: "https://techblog.acme.io",
    maxDepth: 3,
    frequency: "Cada 12 horas",
    status: "activo",
    docsCount: 4391,
    lastRun: "Hace 3 horas",
    extractorSnippet: `function extract(request, response) {\n  const $ = response.body;\n  return [{\n    name: $('h1').first().text(),\n    url: request.url,\n    description: $('article p').first().text()\n  }];\n}`,
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c013",
    accountId: "65f1a2b3c4d5e6f7a8b9c001",
    name: "Wiki Interna",
    url: "https://wiki.internal.acme.corp",
    maxDepth: 2,
    frequency: "Cada 12 horas",
    status: "activo",
    docsCount: 3104,
    lastRun: "Hace 1 hora",
    extractorSnippet: `function extract(request, response) {\n  const $ = response.body;\n  return [{\n    name: $('title').text(),\n    url: request.url,\n    description: $('.wiki-content p').first().text()\n  }];\n}`,
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c014",
    accountId: "65f1a2b3c4d5e6f7a8b9c001",
    name: "Documentación Dev",
    url: "https://docs.product.dev",
    maxDepth: 3,
    frequency: "Cada 24 horas",
    status: "pausado",
    docsCount: 782,
    lastRun: "Hace 1 día",
    extractorSnippet: `function extract(request, response) {\n  const $ = response.body;\n  return [{\n    name: $('title').text(),\n    url: request.url,\n    description: $('main p').first().text()\n  }];\n}`,
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c015",
    accountId: "65f1a2b3c4d5e6f7a8b9c001",
    name: "Repositorio Legal",
    url: "https://legal.acme.corp",
    maxDepth: 2,
    frequency: "Cada 48 horas",
    status: "error",
    docsCount: 229,
    lastRun: "Hace 2 días",
    extractorSnippet: `function extract(request, response) {\n  const $ = response.body;\n  return [{\n    name: $('title').text(),\n    url: request.url,\n    description: $('p').first().text()\n  }];\n}`,
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c016",
    accountId: "65f1a2b3c4d5e6f7a8b9c001",
    name: "Portal de Soporte",
    url: "https://support.acme.corp",
    maxDepth: 2,
    frequency: "Cada 6 horas",
    status: "activo",
    docsCount: 956,
    lastRun: "Hace 30 min",
    extractorSnippet: `function extract(request, response) {\n  const $ = response.body;\n  return [{\n    name: $('title').text(),\n    url: request.url,\n    description: $('.faq-summary').text()\n  }];\n}`,
  },
];

export const MOCK_SNAPSHOTS: CrawlSnapshot[] = [
  { id: "snap-019", fecha: "04 sep · 09:12", docs: 1842, estado: "ok", duracion: "21m 08s" },
  { id: "snap-018", fecha: "04 sep · 03:12", docs: 1839, estado: "ok", duracion: "20m 44s" },
  { id: "snap-017", fecha: "03 sep · 21:12", docs: 1835, estado: "ok", duracion: "22m 01s" },
  { id: "snap-016", fecha: "03 sep · 15:12", docs: 1301, estado: "parcial", duracion: "14m 32s" },
  { id: "snap-015", fecha: "03 sep · 09:12", docs: 1828, estado: "ok", duracion: "19m 55s" },
];

export const MOCK_DOCUMENTS: ExtractedDocument[] = [
  { id: "doc-001", titulo: "Página de Contacto", url: "https://example.com/contacto", desc: "Información de contacto, formularios de soporte y canales de atención al cliente disponibles." },
  { id: "doc-002", titulo: "Catálogo de Productos", url: "https://example.com/productos", desc: "Listado completo de productos disponibles con precios, descripciones y disponibilidad de stock." },
  { id: "doc-003", titulo: "Quiénes Somos", url: "https://example.com/nosotros", desc: "Historia de la empresa, misión, visión y el equipo detrás de la tienda. Fundada en 2014." },
  { id: "doc-004", titulo: "Preguntas Frecuentes", url: "https://example.com/faq", desc: "Respuestas a las consultas más comunes sobre envíos, devoluciones, garantías y métodos de pago." },
  { id: "doc-005", titulo: "Política de Devoluciones", url: "https://example.com/devoluciones", desc: "Procedimiento detallado para solicitar devoluciones y reembolsos. Plazo máximo de 30 días." },
  { id: "doc-006", titulo: "Blog: Novedades", url: "https://example.com/blog", desc: "Últimas noticias, lanzamientos de productos y artículos de interés para nuestros clientes." },
];

export const MOCK_JOBS: CrawlJob[] = [
  { id: "job-041", sitio: "Tienda Ejemplo", inicio: "04 sep · 09:12", duracion: "21m 08s", paginas: 1842, docs: 1842, errores: 2, estado: "completado" },
  { id: "job-040", sitio: "Wiki Interna", inicio: "04 sep · 08:50", duracion: "18m 44s", paginas: 3104, docs: 3098, errores: 0, estado: "completado" },
  { id: "job-039", sitio: "Blog Corporativo", inicio: "04 sep · 08:30", duracion: "en curso", paginas: 2103, docs: 2091, errores: 5, estado: "corriendo" },
  { id: "job-038", sitio: "Portal de Soporte", inicio: "04 sep · 07:45", duracion: "9m 22s", paginas: 956, docs: 956, errores: 0, estado: "completado" },
  { id: "job-037", sitio: "Repositorio Legal", inicio: "04 sep · 07:00", duracion: "2m 03s", paginas: 32, docs: 28, errores: 47, estado: "error" },
  { id: "job-036", sitio: "Documentación Dev", inicio: "03 sep · 14:30", duracion: "9m 57s", paginas: 782, docs: 780, errores: 1, estado: "completado" },
];
