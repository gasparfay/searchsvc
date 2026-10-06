"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import StatCard from "@/components/StatCard";
import SiteTable from "@/components/SiteTable";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function SitesPage() {
  const { sites, jobs, deleteSite } = useApp();
  const [siteToDelete, setSiteToDelete] = useState<{ id: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "docs">("recent");

  const totalSites = sites.length;
  const totalDocs = sites.reduce((a, s) => a + (s.docsCount || 0), 0);
  const totalRunsToday = jobs.filter((j) => j.inicio.includes("Hoy")).length;

  const filteredSites = useMemo(() => {
    let result = sites.filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q) ||
        s._id.toLowerCase().includes(q)
      );
    });

    if (sortBy === "docs") {
      result = [...result].sort((a, b) => (b.docsCount || 0) - (a.docsCount || 0));
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [sites, searchQuery, sortBy]);

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#f0f2f6" }}>
      <div className="px-10 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs mb-1.5 text-slate-400 tracking-wider">
              MIS SITIOS / RESUMEN
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Sitios Registrados
            </h1>
          </div>
          <Link
            href="/sites/new"
            className="flex items-center gap-2 px-5 py-3 text-sm font-bold rounded bg-[#3ddc84] hover:bg-[#2bc971] text-[#0a1f14] transition-all cursor-pointer shadow-xs"
          >
            + Registrar Nuevo Sitio
          </Link>
        </div>

        {/* Stats Widgets */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Sitios registrados"
            value={totalSites}
            color="#166534"
            bg="#dcfce7"
            border="#bbf7d0"
          />
          <StatCard
            label="Documentos indexados"
            value={totalDocs.toLocaleString("es")}
            color="#1e3a6e"
            bg="#dbeafe"
            border="#bfdbfe"
          />
          <StatCard
            label="Corridas registradas"
            value={totalRunsToday}
            color="#475569"
            bg="#f1f5f9"
            border="#e2e8f0"
          />
        </div>

        {/* Sites Table */}
        <SiteTable
          sites={sites}
          filteredSites={filteredSites}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onRequestDelete={setSiteToDelete}
        />

      </div>

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(siteToDelete)}
        siteName={siteToDelete?.name || ""}
        onConfirm={() => {
          if (siteToDelete) {
            deleteSite(siteToDelete.id);
            setSiteToDelete(null);
          }
        }}
        onCancel={() => setSiteToDelete(null)}
      />
    </div>
  );
}
