"use client";

import { useState } from "react";
import type { Screen } from "@/types";
import Sidebar from "@/components/Sidebar";
import DashboardScreen from "@/screens/DashboardScreen";
import NewSiteScreen from "@/screens/NewSiteScreen";
import SiteDetailScreen from "@/screens/SiteDetailScreen";
import MonitorScreen from "@/screens/MonitorScreen";
import CrawlMonitorScreen from "@/screens/CrawlMonitorScreen";
import ConfigScreen from "@/screens/ConfigScreen";
import NavMapScreen from "@/screens/NavMapScreen";
import SearchScreen from "@/screens/SearchScreen";
import SearchHistoryScreen from "@/screens/SearchHistoryScreen";
import SearchDetailScreen from "@/screens/SearchDetailScreen";
import DocumentExplorerScreen from "@/screens/DocumentExplorerScreen";
import SitesScreen from "@/screens/SitesScreen";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("dashboard");

  const current =
    typeof screen === "object"
      ? screen.type === "detail"
        ? "dashboard"
        : "search"
      : screen;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar current={current} onNavigate={setScreen} />
      <main className="flex-1 overflow-hidden h-full">
        {screen === "dashboard" && <DashboardScreen onNavigate={setScreen} />}
        {screen === "new-site" && <NewSiteScreen onNavigate={setScreen} />}
        {screen === "monitor" && <MonitorScreen />}
        {screen === "crawl-monitor" && <CrawlMonitorScreen />}
        {screen === "config" && <ConfigScreen />}
        {screen === "navmap" && <NavMapScreen onNavigate={setScreen} />}
        {screen === "search" && <SearchScreen />}
        {screen === "history" && <SearchHistoryScreen onNavigate={setScreen} />}
        {screen === "explorer" && <DocumentExplorerScreen />}
        {screen === "sites-table" && <SitesScreen />}
        {typeof screen === "object" && screen.type === "detail" && (
          <SiteDetailScreen
            siteId={screen.siteId}
            onBack={() => setScreen("dashboard")}
          />
        )}
        {typeof screen === "object" && screen.type === "search-detail" && (
          <SearchDetailScreen
            id={screen.id}
            onBack={() => setScreen("history")}
          />
        )}
      </main>
    </div>
  );
}
