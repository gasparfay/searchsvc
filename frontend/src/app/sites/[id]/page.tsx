"use client";

import { useState, useMemo, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  IconArrowLeft,
  IconPlay,
  IconEdit,
  IconTrash,
  IconSearch,
  IconClose,
  IconCheck,
} from "@/components/icons";
import SnapshotBar from "@/components/SnapshotBar";
import DocumentCard from "@/components/DocumentCard";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function SiteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: siteId } = use(params);
  const router = useRouter();
  const { sites, snapshots, documents, triggerCrawl, deleteSite } = useApp();

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
        <div className="flex items-start justify-between mb-6">
          <div>
            <Link
              href="/sites"
              className="text-xs mb-2 inline-flex items-center gap-1.5 transition-colors text-slate-400 hover:text-slate-700"
            >
              <IconArrowLeft />
              Volver a Mis Sitios
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{site.name}</h1>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Programado: {site.frequency}
              </span>
            </div>
            <div className="text-xs mt-1.5 font-mono text-slate-500 flex items-center gap-3">
              <span>URL: <strong className="text-slate-800">{site.url}</strong></span>
              <span>·</span>
              <span>Profundidad: <strong className="text-slate-800">{site.maxDepth} niveles</strong></span>
              <span>·</span>
              <span>ID: {site._id}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTriggerCrawl}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer bg-[#3ddc84] hover:bg-[#2bc971] active:scale-95 text-[#0a1f14]"
            >
              <IconPlay />
              Ejecutar Crawl Ahora
            </button>

            <Link
              href={`/sites/${site._id}/edit`}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <IconEdit />
              Editar Configuración
            </Link>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              title="Eliminar sitio"
              className="p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
            >
              <IconTrash />
            </button>
          </div>
        </div>


        {/* Panel 1: Historical Snapshots */}
        <div className="rounded-xl mb-6 bg-white border border-slate-200 shadow-xs">
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
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
          </div>

          <div className="p-4">
            <SnapshotBar
              snapshots={siteSnapshots}
              activeSnapshotId={selectedSnapshotId}
              onSelect={setSelectedSnapshotId}
            />
          </div>
        </div>

        {/* Panel 2: Documents Grid or Zero-Snapshot Empty State */}
        {siteSnapshots.length === 0 ? (
          <div className="rounded-xl p-10 text-center bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <IconPlay />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Este sitio aún no tiene documentos indexados
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
              Aún no se ha realizado ninguna corrida de crawler para {site.name}. Presioná el botón a continuación para iniciar la primera indexación.
            </p>
            <button
              type="button"
              onClick={handleTriggerCrawl}
              className="px-5 py-2.5 text-xs font-bold rounded-lg bg-[#3ddc84] hover:bg-[#2bc971] active:scale-95 text-[#0a1f14] transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
            >
              <IconPlay />
              Iniciar Primera Indexación
            </button>
          </div>
        ) : (
          <div className="rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="px-6 py-4 flex items-center justify-between gap-4 border-b border-slate-100 flex-wrap">
              <div>
                <div className="text-xs font-bold text-slate-900 tracking-wider">
                  DOCUMENTOS EXTRAÍDOS DEL SNAPSHOT ({activeSnapshot ? activeSnapshot.id : "—"})
                </div>
                <div className="text-xs mt-0.5 text-slate-500">
                  Mostrando {filteredDocs.length} de {activeDocs.length} documentos.
                </div>
              </div>

              {/* Filter input */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs min-w-[280px]">
                <span className="text-slate-400">
                  <IconSearch />
                </span>
                <input
                  value={querySearch}
                  onChange={(e) => setQuerySearch(e.target.value)}
                  placeholder="Filtrar por título, url o descripción..."
                  className="flex-1 bg-transparent text-xs focus:outline-none text-slate-700"
                />
                {querySearch && (
                  <button onClick={() => setQuerySearch("")} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <IconClose />
                  </button>
                )}
              </div>
            </div>

            {/* Cards Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>
          </div>
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
