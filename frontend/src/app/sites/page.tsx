"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import SitesStats from "@/components/SitesStats";
import { Button } from "@/components/ui/button";
import SiteTable from "@/components/SiteTable";
import ConfirmModal from "@/components/ConfirmModal";
import { IconTrash } from "@/components/icons";

export default function SitesPage() {
  const { sites, jobs } = useApp();
  const [siteToDelete, setSiteToDelete] = useState<{ id: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "docs">("recent");

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
    <PageContainer>
      {/* Page Header Component */}
      <PageHeader
        breadcrumb="MIS SITIOS / RESUMEN"
        title="Sitios Registrados"
        action={
          <Link href="/sites/new">
            <Button size="lg">+ Registrar Nuevo Sitio</Button>
          </Link>
        }
      />

      {/* Stats Widgets */}
      <SitesStats sites={sites} jobs={jobs} />

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

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={Boolean(siteToDelete)}
        title="¿Eliminar sitio definitivamente?"
        icon={
          <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <IconTrash />
          </div>
        }
        description={
          <span>
            Se eliminará el sitio <strong className="text-slate-900 font-semibold">{siteToDelete?.name}</strong> y todos sus snapshots y documentos extraídos asociados de forma irreversible.
          </span>
        }
        confirmLabel="Sí, Eliminar Sitio"
        cancelLabel="Cancelar"
        confirmVariant="destructive"
        onConfirm={() => setSiteToDelete(null)}
        onCancel={() => setSiteToDelete(null)}
      />
    </PageContainer>
  );
}
