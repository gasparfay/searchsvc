"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Site, CrawlSnapshot, ExtractedDocument, CrawlJob, Account } from "@/types";
import {
  INITIAL_ACCOUNT,
  INITIAL_SITES,
  INITIAL_SNAPSHOTS,
  INITIAL_DOCUMENTS,
  INITIAL_JOBS,
} from "@/data/mock-data";

interface AppContextType {
  sites: Site[];
  account: Account;
  snapshots: CrawlSnapshot[];
  documents: ExtractedDocument[];
  jobs: CrawlJob[];
  addSite: (siteData: {
    name: string;
    url: string;
    maxDepth: number;
    frequency: string;
    extractorSnippet: string;
    pageResolverSnippet?: string;
  }) => Site;
  updateSite: (id: string, siteData: Partial<Site>) => void;
  deleteSite: (id: string) => void;
  triggerCrawl: (siteId: string) => Promise<CrawlSnapshot>;
  regenerateApiKey: () => string;
  updateAccount: (data: Partial<Account>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sites, setSites] = useState<Site[]>(INITIAL_SITES);
  const [account, setAccount] = useState<Account>(INITIAL_ACCOUNT);
  const [snapshots, setSnapshots] = useState<CrawlSnapshot[]>(INITIAL_SNAPSHOTS);
  const [documents, setDocuments] = useState<ExtractedDocument[]>(INITIAL_DOCUMENTS);
  const [jobs, setJobs] = useState<CrawlJob[]>(INITIAL_JOBS);

  const addSite = (siteData: {
    name: string;
    url: string;
    maxDepth: number;
    frequency: string;
    extractorSnippet: string;
    pageResolverSnippet?: string;
  }) => {
    // Generate valid 24-char hex MongoDB ObjectId
    const hexTimestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, "0");
    const hexRandom = Math.random().toString(16).substring(2, 18).padEnd(16, "0");
    const newId = (hexTimestamp + hexRandom).substring(0, 24);

    const newSite: Site = {
      _id: newId,
      accountId: account._id,
      name: siteData.name,
      url: siteData.url,
      maxDepth: siteData.maxDepth,
      frequency: siteData.frequency,
      extractorSnippet: siteData.extractorSnippet,
      pageResolverSnippet: siteData.pageResolverSnippet,
      docsCount: 0,
      lastRunDate: "Sin ejecuciones previas",
      lastRunStatus: "ok",
      createdAt: new Date().toISOString(),
    };

    setSites((prev) => [newSite, ...prev]);
    return newSite;
  };

  const updateSite = (id: string, siteData: Partial<Site>) => {
    setSites((prev) =>
      prev.map((s) => (s._id === id ? { ...s, ...siteData, updatedAt: new Date().toISOString() } : s))
    );
  };

  const deleteSite = (id: string) => {
    setSites((prev) => prev.filter((s) => s._id !== id));
    setSnapshots((prev) => prev.filter((snap) => snap.siteId !== id));
    setDocuments((prev) => prev.filter((doc) => doc.siteId !== id));
  };

  const triggerCrawl = async (siteId: string): Promise<CrawlSnapshot> => {
    const site = sites.find((s) => s._id === siteId);
    const siteName = site ? site.name : "Sitio";

    // Simulate async crawler execution
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const snapId = `snap-${Date.now().toString().slice(-4)}`;
    const nowStr = new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    const docsFound = Math.floor(Math.random() * 20) + 5;

    const newSnapshot: CrawlSnapshot = {
      id: snapId,
      siteId,
      fecha: `Hoy · ${nowStr}`,
      docs: docsFound,
      estado: "ok",
      duracion: "42s",
      pagesVisited: docsFound,
    };

    const newJob: CrawlJob = {
      id: `job-${Date.now().toString().slice(-4)}`,
      siteId,
      sitio: siteName,
      inicio: `Hoy · ${nowStr}`,
      duracion: "42s",
      paginas: docsFound,
      docs: docsFound,
      errores: 0,
      estado: "completado",
    };

    const newSampleDocs: ExtractedDocument[] = [
      {
        id: `doc-${Date.now()}-1`,
        siteId,
        snapshotId: snapId,
        name: `${siteName} — Página Principal Actualizada`,
        url: site ? `${site.url}/` : "https://example.com/",
        description: "Contenido capturado por la corrida manual del crawler ejecutada a demanda.",
        content: `Documento extraído de ${site ? site.url : "URL"} con niveles de profundidad maxDepth. Procesado con Cheerio extractorSnippet.`,
        crawledAt: new Date().toISOString().replace("T", " ").slice(0, 19),
        httpStatus: 200,
      },
      {
        id: `doc-${Date.now()}-2`,
        siteId,
        snapshotId: snapId,
        name: `${siteName} — Novedades y Artículos`,
        url: site ? `${site.url}/novedades` : "https://example.com/novedades",
        description: "Artículos y novedades extraídas siguiendo enlaces descubiertos por el resolver.",
        content: "Texto extraído de la sección de novedades. Contenido parseado estructuradamente en MongoDB.",
        crawledAt: new Date().toISOString().replace("T", " ").slice(0, 19),
        httpStatus: 200,
      },
    ];

    setSnapshots((prev) => [newSnapshot, ...prev]);
    setJobs((prev) => [newJob, ...prev]);
    setDocuments((prev) => [...newSampleDocs, ...prev]);

    setSites((prev) =>
      prev.map((s) =>
        s._id === siteId
          ? {
              ...s,
              docsCount: (s.docsCount || 0) + docsFound,
              lastRunDate: `Hoy, ${nowStr}`,
              lastRunStatus: "ok",
            }
          : s
      )
    );

    return newSnapshot;
  };

  const regenerateApiKey = (): string => {
    const newKey = crypto.randomUUID();
    setAccount((prev) => ({ ...prev, apiKey: newKey }));
    return newKey;
  };

  const updateAccount = (data: Partial<Account>) => {
    setAccount((prev) => ({ ...prev, ...data }));
  };

  return (
    <AppContext.Provider
      value={{
        sites,
        account,
        snapshots,
        documents,
        jobs,
        addSite,
        updateSite,
        deleteSite,
        triggerCrawl,
        regenerateApiKey,
        updateAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
