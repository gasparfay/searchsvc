"use client";

import React, { createContext, useContext, useState } from "react";
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sites] = useState<Site[]>(INITIAL_SITES);
  const [account] = useState<Account>(INITIAL_ACCOUNT);
  const [snapshots] = useState<CrawlSnapshot[]>(INITIAL_SNAPSHOTS);
  const [documents] = useState<ExtractedDocument[]>(INITIAL_DOCUMENTS);
  const [jobs] = useState<CrawlJob[]>(INITIAL_JOBS);

  return (
    <AppContext.Provider
      value={{
        sites,
        account,
        snapshots,
        documents,
        jobs,
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
