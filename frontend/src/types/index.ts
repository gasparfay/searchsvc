export interface Site {
  _id: string;
  accountId: string;
  name: string;
  url: string;
  maxDepth: number;
  frequency: string;
  extractorSnippet: string;
  pageResolverSnippet?: string;
  docsCount: number;
  lastRunDate?: string;
  lastRunStatus?: "ok" | "error";
  createdAt?: string;
  updatedAt?: string;
}

export interface CrawlSnapshot {
  id: string;
  siteId: string;
  fecha: string;
  docs: number;
  estado: "ok" | "parcial" | "error";
  duracion: string;
  pagesVisited: number;
}

export interface ExtractedDocument {
  id: string;
  siteId: string;
  snapshotId: string;
  name: string;
  url: string;
  description: string;
  content: string;
  crawledAt: string;
  httpStatus?: number;
}

export interface Account {
  _id: string;
  name: string;
  email: string;
  apiKey: string;
  auth0Id?: string;
}

export interface CrawlJob {
  id: string;
  siteId: string;
  sitio: string;
  inicio: string;
  duracion: string;
  paginas: number;
  docs: number;
  errores: number;
  estado: "completado" | "corriendo" | "error";
}
