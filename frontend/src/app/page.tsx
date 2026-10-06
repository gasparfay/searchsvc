"use client";

import { useState } from "react";
import type { Screen } from "@/types";
import Sidebar from "@/components/Sidebar";
import DashboardScreen from "@/screens/DashboardScreen";
import NewSiteScreen from "@/screens/NewSiteScreen";
import SiteDetailScreen from "@/screens/SiteDetailScreen";
import MonitorScreen from "@/screens/MonitorScreen";
import ConfigScreen from "@/screens/ConfigScreen";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("dashboard");

  const current = typeof screen === "object" ? "dashboard" : screen;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar current={current} onNavigate={setScreen} />
      <main className="flex-1 overflow-hidden h-full">
        {screen === "dashboard" && <DashboardScreen onNavigate={setScreen} />}
        {screen === "new-site" && <NewSiteScreen onNavigate={setScreen} />}
        {screen === "monitor" && <MonitorScreen />}
        {screen === "config" && <ConfigScreen />}
        {typeof screen === "object" && screen.type === "detail" && (
          <SiteDetailScreen
            siteId={screen.siteId}
            onBack={() => setScreen("dashboard")}
          />
        )}
      </main>
    </div>
  );
}
