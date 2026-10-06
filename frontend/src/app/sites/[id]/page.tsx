"use client";

import { useState, useMemo, useEffect, use } from "react";
import { useApp } from "@/context/AppContext";
import { IconTrash } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import PageContainer from "@/components/PageContainer";
import SiteHeader from "@/components/SiteHeader";
import SnapshotBar from "@/components/SnapshotBar";
import SiteDocumentsPanel from "@/components/SiteDocumentsPanel";
import ConfirmModal from "@/components/ConfirmModal";

export default function SiteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: siteId } = use(params);
  const { sites, snapshots, documents } = useApp();

  const site = sites.find((s) => s._id === siteId) || sites[0] || {
    _id: siteId || "65f1a2b3c4d5e6f7a8b9c011",
    name: "Tienda Ejemplo",
    url: "https://example.com",
    maxDepth: 2,
    frequency: "Cada 6 horas",
    extractorSnippet: "",
    pageResolverSnippet: "",
    docsCount: 0,
    lastRunDate: "Sin ejecuciones",
    lastRunStatus: "ok" as const,
    accountId: "65f1a2b3c4d5e6f7a8b9c001",
    createdAt: new Date().toISOString(),
  };

  const siteSnapshots = useMemo(() => {
    if (!site) return [];
    return snapshots.filter((snap) => snap.siteId === site._id);
  }, [snapshots, site]);

  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>(() => {
    return siteSnapshots[0]?.id || "";
  });

  useEffect(() => {
    if (siteSnapshots.length > 0 && !siteSnapshots.some((s) => s.id === selectedSnapshotId)) {
      setSelectedSnapshotId(siteSnapshots[0].id);
    }
  }, [siteSnapshots, selectedSnapshotId]);

  const activeSnapshot = useMemo(() => {
    return siteSnapshots.find((s) => s.id === selectedSnapshotId) || siteSnapshots[0];
  }, [siteSnapshots, selectedSnapshotId]);

  const [querySearch, setQuerySearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const activeDocs = useMemo(() => {
    if (!site || !activeSnapshot) return [];
    return documents.filter(
      (doc) => doc.siteId === site._id && doc.snapshotId === activeSnapshot.id
    );
  }, [documents, site, activeSnapshot]);

  const filteredDocs = useMemo(() => {
    if (!querySearch.trim()) return activeDocs;
    const q = querySearch.toLowerCase();
    return activeDocs.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.url.toLowerCase().includes(q)
    );
  }, [activeDocs, querySearch]);

  function handleTriggerCrawl() {
    // Modo maquetado: el botón no realiza acción
  }

  return (
    <PageContainer>
      {/* Encabezado del Sitio */}
      <SiteHeader
        site={site}
        onCrawl={handleTriggerCrawl}
        onDelete={() => setShowDeleteModal(true)}
      />

      {/* Panel 1: Snapshots Históricos */}
      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between p-4 px-6 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <CardTitle className="text-xs uppercase tracking-wider">
              Snapshots Históricos del Sitio ({siteSnapshots.length})
            </CardTitle>
            <CardDescription>
              Seleccioná un snapshot para navegar los documentos extraídos por el crawler en esa corrida.
            </CardDescription>
          </div>
          {activeSnapshot && (
            <Badge variant="outline" className="font-mono text-slate-600 bg-slate-50">
              Snapshot activo:{" "}
              <strong className="text-emerald-700 ml-1">
                {activeSnapshot.id}
              </strong>
            </Badge>
          )}
        </CardHeader>

        <div className="p-4">
          <SnapshotBar
            snapshots={siteSnapshots}
            activeSnapshotId={selectedSnapshotId}
            onSelect={setSelectedSnapshotId}
          />
        </div>
      </Card>

      {/* Panel 2: Documentos Extraídos */}
      <SiteDocumentsPanel
        site={site}
        hasSnapshots={siteSnapshots.length > 0}
        activeSnapshot={activeSnapshot}
        filteredDocs={filteredDocs}
        activeDocsCount={activeDocs.length}
        querySearch={querySearch}
        onQuerySearchChange={setQuerySearch}
        onTriggerCrawl={handleTriggerCrawl}
      />

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="¿Eliminar sitio definitivamente?"
        icon={
          <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <IconTrash />
          </div>
        }
        description={
          <span>
            Se eliminará el sitio <strong className="text-slate-900 font-semibold">{site.name}</strong> y todos sus snapshots y documentos extraídos asociados de forma irreversible.
          </span>
        }
        confirmLabel="Sí, Eliminar Sitio"
        cancelLabel="Cancelar"
        confirmVariant="destructive"
        onConfirm={() => setShowDeleteModal(false)}
        onCancel={() => setShowDeleteModal(false)}
      />
    </PageContainer>
  );
}
