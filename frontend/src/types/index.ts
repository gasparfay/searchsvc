export interface Site {
  _id: string;
  accountId: string;
  name: string;
  url: string;
  maxDepth: number;
  frequency: string;
  extractorSnippet: string;
  pageResolverSnippet?: string;
  status: "activo" | "pausado" | "error";
  docsCount: number;
  lastRun: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrawlSnapshot {
  id: string;
  fecha: string;
  docs: number;
  estado: "ok" | "parcial" | "error";
  duracion: string;
}

export interface ExtractedDocument {
  id: string;
  titulo: string;
  url: string;
  desc: string;
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
  sitio: string;
  inicio: string;
  duracion: string;
  paginas: number;
  docs: number;
  errores: number;
  estado: "completado" | "corriendo" | "error";
}
