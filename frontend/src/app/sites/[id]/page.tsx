"use client";

import { useState, useMemo, useEffect, use } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  IconArrowLeft,
  IconPlay,
  IconEdit,
  IconTrash,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import SnapshotBar from "@/components/SnapshotBar";
import DocumentCard from "@/components/DocumentCard";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";

export default function SiteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: siteId } = use(params);
  const { sites, snapshots, documents } = useApp();

  const site = sites.find((s) => s._id === siteId) || {
    _id: siteId || "65f1a2b3c4d5e6f7a8b9c011",
    name: "Tienda Ejemplo",
    url: "https://example.com",
    maxDepth: 2,
    frequency: "Cada 6 horas",
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
    <div className="h-full overflow-y-auto" style={{ background: "#f0f2f6" }}>
      <div className="px-10 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <Link
              href="/sites"
              className="text-xs mb-2 inline-flex items-center gap-1.5 transition-colors text-slate-400 hover:text-slate-700 font-medium"
            >
              <IconArrowLeft />
              Volver a Mis Sitios
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{site.name}</h1>
              <Badge variant="success" dot>
                Programado: {site.frequency}
              </Badge>
            </div>
            <div className="text-xs mt-1.5 font-mono text-slate-500 flex items-center gap-3 flex-wrap">
              <span>URL: <strong className="text-slate-800">{site.url}</strong></span>
              <span>·</span>
              <span>Profundidad: <strong className="text-slate-800">{site.maxDepth} niveles</strong></span>
              <span>·</span>
              <span>ID: {site._id}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Button onClick={handleTriggerCrawl}>
              <IconPlay />
              Ejecutar Crawl Ahora
            </Button>

            <Link href={`/sites/${site._id}/edit`}>
              <Button variant="outline">
                <IconEdit />
                Editar Configuración
              </Button>
            </Link>

            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowDeleteModal(true)}
              title="Eliminar sitio"
            >
              <IconTrash />
            </Button>
          </div>
        </div>

        {/* Panel 1: Historical Snapshots */}
        <Card className="mb-6">
          <CardHeader className="flex-row items-center justify-between p-4 px-6 border-b border-slate-100 flex-wrap gap-2">
            <div>
              <div className="text-xs font-bold text-slate-900 tracking-wider">
                SNAPSHOTS HISTÓRICOS DEL SITIO ({siteSnapshots.length})
              </div>
              <div className="text-xs mt-0.5 text-slate-500">
                Seleccioná un snapshot para navegar los documentos extraídos por el crawler en esa corrida.
              </div>
            </div>
            {activeSnapshot && (
              <span className="text-xs font-mono text-slate-500">
                Snapshot activo:{" "}
                <strong className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {activeSnapshot.id}
                </strong>
              </span>
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

        {/* Panel 2: Documents Grid or Zero-Snapshot Empty State */}
        {siteSnapshots.length === 0 ? (
          <EmptyState
            icon={<IconPlay />}
            title="Este sitio aún no tiene documentos indexados"
            description={`Aún no se ha realizado ninguna corrida de crawler para ${site.name}. Presioná el botón a continuación para iniciar la primera indexación.`}
            action={
              <Button onClick={handleTriggerCrawl}>
                <IconPlay />
                Iniciar Primera Indexación
              </Button>
            }
          />
        ) : (
          <Card>
            <CardHeader className="flex-row items-center justify-between p-4 px-6 border-b border-slate-100 flex-wrap gap-4">
              <div>
                <div className="text-xs font-bold text-slate-900 tracking-wider">
                  DOCUMENTOS EXTRAÍDOS DEL SNAPSHOT ({activeSnapshot ? activeSnapshot.id : "—"})
                </div>
                <div className="text-xs mt-0.5 text-slate-500">
                  Mostrando {filteredDocs.length} de {activeDocs.length} documentos.
                </div>
              </div>

              {/* Reusable SearchInput */}
              <SearchInput
                value={querySearch}
                onChange={setQuerySearch}
                placeholder="Filtrar por título, url o descripción..."
                className="min-w-[280px]"
              />
            </CardHeader>

            {/* Cards Grid */}
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <DocumentCard key={doc.id} document={doc} siteId={site._id} />
              ))}

              {filteredDocs.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-400 text-xs">
                  {activeDocs.length === 0
                    ? "Este snapshot no tiene documentos extraídos asociados."
                    : `Sin documentos que coincidan con "${querySearch}".`}
                </div>
              )}
            </CardContent>
          </Card>
        )}

      </div>

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        siteName={site.name}
        onConfirm={() => {
          // Modo maquetado: decorativo
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
