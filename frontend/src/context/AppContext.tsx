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

  // Modo maquetado puramente decorativo: sin mutaciones locales que simulen el backend
  const addSite = (_siteData: {
    name: string;
    url: string;
    maxDepth: number;
    frequency: string;
    extractorSnippet: string;
    pageResolverSnippet?: string;
  }): Site => {
    return {
      _id: "65f1a2b3c4d5e6f7a8b9c099",
      accountId: account._id,
      name: _siteData.name,
      url: _siteData.url,
      maxDepth: _siteData.maxDepth,
      frequency: _siteData.frequency,
      extractorSnippet: _siteData.extractorSnippet,
      pageResolverSnippet: _siteData.pageResolverSnippet,
      docsCount: 0,
      lastRunDate: "Sin ejecuciones previas",
      lastRunStatus: "ok",
      createdAt: new Date().toISOString(),
    };
  };

  const updateSite = (_id: string, _siteData: Partial<Site>) => {
    // Modo maquetado: decorativo
  };

  const deleteSite = (_id: string) => {
    // Modo maquetado: decorativo
  };

  const triggerCrawl = async (_siteId: string): Promise<void> => {
    // Modo maquetado: decorativo
  };

  const regenerateApiKey = (): string => {
    // Modo maquetado: decorativo
    return account.apiKey;
  };

  const updateAccount = (_data: Partial<Account>) => {
    // Modo maquetado: decorativo
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
