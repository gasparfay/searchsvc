"use client";

import React, { createContext, useContext, useState } from "react";
import type { Site, CrawlSnapshot, ExtractedDocument, CrawlJob, Account } from "@/types";
import {
  INITIAL_ACCOUNT,
  INITIAL_SITES,
  INITIAL_SNAPSHOTS,
  INITIAL_DOCUMENTS,
  INITIAL_JOBS,
  createSampleCrawlData,
  createMockCrawlRun,
} from "@/data/mock-data";

export interface CreateSiteInput {
  name: string;
  url: string;
  maxDepth: number;
  frequency: string;
  extractorSnippet: string;
  pageResolverSnippet?: string;
}

interface AppContextType {
  sites: Site[];
  account: Account;
  snapshots: CrawlSnapshot[];
  documents: ExtractedDocument[];
  jobs: CrawlJob[];
  addSite: (data: CreateSiteInput) => Site;
  updateSite: (id: string, data: Partial<CreateSiteInput>) => void;
  deleteSite: (id: string) => void;
  triggerCrawl: (siteId: string) => void;
  updateAccount: (data: Partial<Account>) => void;
  regenerateApiKey: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, "0");
  const randomHex = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  return timestamp + randomHex;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sites, setSites] = useState<Site[]>(INITIAL_SITES);
  const [account, setAccount] = useState<Account>(INITIAL_ACCOUNT);
  const [snapshots, setSnapshots] = useState<CrawlSnapshot[]>(INITIAL_SNAPSHOTS);
  const [documents, setDocuments] = useState<ExtractedDocument[]>(INITIAL_DOCUMENTS);
  const [jobs, setJobs] = useState<CrawlJob[]>(INITIAL_JOBS);

  function addSite(data: CreateSiteInput): Site {
    const siteId = generateObjectId();
    const cleanUrl = data.url.replace(/\/+$/, "");
    const now = new Date().toISOString();

    const sample = createSampleCrawlData({ _id: siteId, name: data.name, url: cleanUrl });

    const newSite: Site = {
      _id: siteId,
      accountId: account._id,
      name: data.name,
      url: cleanUrl,
      maxDepth: data.maxDepth,
      frequency: data.frequency,
      extractorSnippet: data.extractorSnippet,
      pageResolverSnippet: data.pageResolverSnippet,
      docsCount: sample.documents.length,
      lastRunDate: "Hoy, recién",
      lastRunStatus: "ok",
      createdAt: now,
      updatedAt: now,
    };

    setSites((prev) => [newSite, ...prev]);
    setSnapshots((prev) => [...sample.snapshots, ...prev]);
    setDocuments((prev) => [...sample.documents, ...prev]);
    setJobs((prev) => [...sample.jobs, ...prev]);

    return newSite;
  }

  function updateSite(id: string, data: Partial<CreateSiteInput>) {
    setSites((prev) =>
      prev.map((s) =>
        s._id === id
          ? {
              ...s,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );

    if (data.name) {
      setJobs((prev) =>
        prev.map((j) => (j.siteId === id ? { ...j, sitio: data.name! } : j))
      );
    }
  }

  function deleteSite(id: string) {
    setSites((prev) => prev.filter((s) => s._id !== id));
    setSnapshots((prev) => prev.filter((snap) => snap.siteId !== id));
    setDocuments((prev) => prev.filter((doc) => doc.siteId !== id));
    setJobs((prev) => prev.filter((job) => job.siteId !== id));
  }

  function triggerCrawl(siteId: string) {
    const targetSite = sites.find((s) => s._id === siteId);
    if (!targetSite) return;

    const run = createMockCrawlRun(targetSite);

    setSnapshots((prev) => [run.snapshot, ...prev]);
    setDocuments((prev) => [...run.documents, ...prev]);
    setJobs((prev) => [run.job, ...prev]);
    setSites((prev) =>
      prev.map((s) =>
        s._id === siteId
          ? {
              ...s,
              docsCount: (s.docsCount || 0) + run.documents.length,
              lastRunDate: "Hoy, recién",
              lastRunStatus: "ok",
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );
  }

  function updateAccount(data: Partial<Account>) {
    setAccount((prev) => ({ ...prev, ...data }));
  }

  function regenerateApiKey() {
    const newKey =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setAccount((prev) => ({ ...prev, apiKey: newKey }));
  }

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
        updateAccount,
        regenerateApiKey,
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
