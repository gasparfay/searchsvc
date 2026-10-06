import type {
  Site,
  CrawlSnapshot,
  ExtractedDocument,
  CrawlJob,
  Account,
} from "@/types";

export const INITIAL_ACCOUNT: Account = {
  _id: "65f1a2b3c4d5e6f7a8b9c001",
  name: "Gaspar Fay",
  email: "gasparfay@gmail.com",
  apiKey: "123e4567-e89b-12d3-a456-426614174000",
  auth0Id: "google-oauth2|10928374651928374",
};

// Initial state starts empty so the application initializes clean
export const INITIAL_SITES: Site[] = [];
export const INITIAL_SNAPSHOTS: CrawlSnapshot[] = [];
export const INITIAL_DOCUMENTS: ExtractedDocument[] = [];
export const INITIAL_JOBS: CrawlJob[] = [];

// Aliases
export const MOCK_ACCOUNT = INITIAL_ACCOUNT;
export const MOCK_SITES = INITIAL_SITES;
export const MOCK_SNAPSHOTS = INITIAL_SNAPSHOTS;
export const MOCK_DOCUMENTS = INITIAL_DOCUMENTS;
export const MOCK_JOBS = INITIAL_JOBS;

/**
 * Generates sample snapshots, documents, and a completed job
 * tailored to a newly registered site.
 */
export function createSampleCrawlData(site: { _id: string; name: string; url: string }) {
  const cleanUrl = site.url.replace(/\/+$/, "");
  const snap1Id = `snap-${Math.floor(100 + Math.random() * 900)}`;
  const snap2Id = `snap-${Math.floor(100 + Math.random() * 900)}`;

  const snapshots: CrawlSnapshot[] = [
    {
      id: snap1Id,
      siteId: site._id,
      fecha: "Hoy, recién",
      docs: 4,
      estado: "ok",
      duracion: "1m 12s",
      pagesVisited: 6,
    },
    {
      id: snap2Id,
      siteId: site._id,
      fecha: "Ayer · 18:30",
      docs: 2,
      estado: "ok",
      duracion: "0m 48s",
      pagesVisited: 4,
    },
  ];

  const docBase = Math.floor(100 + Math.random() * 800);
  const documents: ExtractedDocument[] = [
    {
      id: `doc-${docBase}`,
      siteId: site._id,
      snapshotId: snap1Id,
      name: `Portada Principal — ${site.name}`,
      url: `${cleanUrl}/`,
      description: `Página de inicio de ${site.name}. Información general y accesos principales.`,
      content: `Bienvenido a ${site.name}. Explora las diferentes secciones y productos disponibles.`,
      crawledAt: "Hoy, recién",
      httpStatus: 200,
    },
    {
      id: `doc-${docBase + 1}`,
      siteId: site._id,
      snapshotId: snap1Id,
      name: `Catálogo de Productos y Servicios — ${site.name}`,
      url: `${cleanUrl}/catalogo`,
      description: `Listado completo de productos, inventario y especificaciones ofrecidas por ${site.name}.`,
      content: `Catálogo general de ${site.name}. Artículos destacados, novedades y promociones activas.`,
      crawledAt: "Hoy, recién",
      httpStatus: 200,
    },
    {
      id: `doc-${docBase + 2}`,
      siteId: site._id,
      snapshotId: snap1Id,
      name: `Contacto y Atención al Cliente — ${site.name}`,
      url: `${cleanUrl}/contacto`,
      description: `Canales de atención, soporte técnico y formularios de comunicación directa.`,
      content: `Centro de contacto de ${site.name}. Soporte técnico y atención al usuario disponibles.`,
      crawledAt: "Hoy, recién",
      httpStatus: 200,
    },
    {
      id: `doc-${docBase + 3}`,
      siteId: site._id,
      snapshotId: snap1Id,
      name: `Preguntas Frecuentes y Políticas — ${site.name}`,
      url: `${cleanUrl}/faq`,
      description: `Respuestas a dudas comunes, términos de servicio y políticas de privacidad.`,
      content: `Preguntas frecuentes sobre envíos, garantías y condiciones del servicio en ${site.name}.`,
      crawledAt: "Hoy, recién",
      httpStatus: 200,
    },
    {
      id: `doc-${docBase + 4}`,
      siteId: site._id,
      snapshotId: snap2Id,
      name: `Portada Anterior — ${site.name}`,
      url: `${cleanUrl}/`,
      description: `Versión archivada de la portada en la corrida anterior del crawler.`,
      content: `Registro histórico de la portada correspondiente al snapshot ${snap2Id}.`,
      crawledAt: "Ayer · 18:30",
      httpStatus: 200,
    },
    {
      id: `doc-${docBase + 5}`,
      siteId: site._id,
      snapshotId: snap2Id,
      name: `Productos (Histórico) — ${site.name}`,
      url: `${cleanUrl}/catalogo`,
      description: `Versión archivada del catálogo de la corrida anterior.`,
      content: `Registro histórico de productos indexados previamente.`,
      crawledAt: "Ayer · 18:30",
      httpStatus: 200,
    },
  ];

  const jobs: CrawlJob[] = [
    {
      id: `job-${Math.floor(100 + Math.random() * 900)}`,
      siteId: site._id,
      sitio: site.name,
      inicio: "Hoy, recién",
      duracion: "1m 12s",
      paginas: 6,
      docs: 4,
      errores: 0,
      estado: "completado",
    },
    {
      id: `job-${Math.floor(100 + Math.random() * 900)}`,
      siteId: site._id,
      sitio: site.name,
      inicio: "Ayer · 18:30",
      duracion: "0m 48s",
      paginas: 4,
      docs: 2,
      errores: 0,
      estado: "completado",
    },
  ];

  return { snapshots, documents, jobs };
}

/**
 * Generates sample data for a manual crawl trigger in the UI.
 */
export function createMockCrawlRun(site: Site) {
  const snapId = `snap-${Math.floor(100 + Math.random() * 900)}`;
  const cleanUrl = site.url.replace(/\/+$/, "");

  const newSnap: CrawlSnapshot = {
    id: snapId,
    siteId: site._id,
    fecha: "Hoy, recién",
    docs: 2,
    estado: "ok",
    duracion: "0m 35s",
    pagesVisited: 5,
  };

  const docBase = Math.floor(100 + Math.random() * 800);
  const newDocs: ExtractedDocument[] = [
    {
      id: `doc-${docBase}`,
      siteId: site._id,
      snapshotId: snapId,
      name: `Novedades Indexadas — ${site.name}`,
      url: `${cleanUrl}/novedades`,
      description: `Contenido extraído durante la última ejecución del crawler en ${site.name}.`,
      content: `Actualización de índice para ${site.name}. Nuevas secciones y páginas procesadas.`,
      crawledAt: "Hoy, recién",
      httpStatus: 200,
    },
    {
      id: `doc-${docBase + 1}`,
      siteId: site._id,
      snapshotId: snapId,
      name: `Artículos y Documentación — ${site.name}`,
      url: `${cleanUrl}/docs`,
      description: `Recursos y guías indexadas en la corrida reciente.`,
      content: `Material y guías técnicas extraídas por los selectores Cheerio configurados.`,
      crawledAt: "Hoy, recién",
      httpStatus: 200,
    },
  ];

  const newJob: CrawlJob = {
    id: `job-${Math.floor(100 + Math.random() * 900)}`,
    siteId: site._id,
    sitio: site.name,
    inicio: "Hoy, recién",
    duracion: "0m 35s",
    paginas: 5,
    docs: 2,
    errores: 0,
    estado: "completado",
  };

  return { snapshot: newSnap, documents: newDocs, job: newJob };
}
