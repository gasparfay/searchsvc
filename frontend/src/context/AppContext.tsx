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
  triggerCrawl: (siteId: string) => Promise<void>;
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

  const triggerCrawl = async (_siteId: string): Promise<void> => {
    // Modo maquetado: sin acción hasta integración con microservicio de backend
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
