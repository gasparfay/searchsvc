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

  const site = sites.find((s) => s._id === siteId) || sites[0];

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
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlSuccessMessage, setCrawlSuccessMessage] = useState("");
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

  if (!site) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center" style={{ background: "#f0f2f6" }}>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Sitio no encontrado</h2>
        <Link href="/sites" className="text-xs text-emerald-600 font-bold hover:underline">
          Volver a Mis Sitios
        </Link>
      </div>
    );
  }

  async function handleTriggerCrawl() {
    try {
      setIsCrawling(true);
      setCrawlSuccessMessage("");
      const newSnap = await triggerCrawl(site._id);
      setSelectedSnapshotId(newSnap.id);
      setCrawlSuccessMessage(`Corrida completada con éxito. Se capturó una nueva foto (${newSnap.id}) con ${newSnap.docs} documentos.`);
      setTimeout(() => setCrawlSuccessMessage(""), 5000);
    } catch {
      // ignore
    } finally {
      setIsCrawling(false);
    }
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
              disabled={isCrawling}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer ${
                isCrawling ? "bg-slate-400 text-slate-900 cursor-not-allowed" : "bg-[#3ddc84] hover:bg-[#2bc971] text-[#0a1f14]"
              }`}
            >
              {isCrawling ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-slate-900" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Ejecutando Crawl...
                </>
              ) : (
                <>
                  <IconPlay />
                  Ejecutar Crawl Ahora
                </>
              )}
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

        {/* Feedback message */}
        {crawlSuccessMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-emerald-700">
                <IconCheck />
              </span>
              <span>{crawlSuccessMessage}</span>
            </div>
            <button onClick={() => setCrawlSuccessMessage("")} className="text-emerald-700 font-bold hover:underline cursor-pointer">
              Cerrar
            </button>
          </div>
        )}

        {/* Panel 1: Historical Snapshots */}
        <div className="rounded-xl mb-6 bg-white border border-slate-200 shadow-xs">
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
            <div>
              <div className="text-xs font-bold text-slate-900 tracking-wider">
                FOTOS / SNAPSHOTS HISTÓRICOS DEL SITIO ({siteSnapshots.length})
              </div>
              <div className="text-xs mt-0.5 text-slate-500">
                Seleccioná una foto para navegar los documentos extraídos por el crawler en esa corrida.
              </div>
            </div>
            {activeSnapshot && (
              <span className="text-xs font-mono text-slate-500">
                Foto activa:{" "}
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

        {/* Panel 2: Documents Grid */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="px-6 py-4 flex items-center justify-between gap-4 border-b border-slate-100 flex-wrap">
            <div>
              <div className="text-xs font-bold text-slate-900 tracking-wider">
                DOCUMENTOS EXTRAÍDOS DE LA FOTO ({activeSnapshot ? activeSnapshot.id : "—"})
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
          <div className="p-6 grid grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <DocumentCard key={doc.id} document={doc} siteId={site._id} />
            ))}

            {filteredDocs.length === 0 && (
              <div className="col-span-3 py-16 text-center text-slate-400 text-xs">
                {activeDocs.length === 0
                  ? "Esta foto no tiene documentos extraídos asociados."
                  : `Sin documentos que coincidan con "${querySearch}".`}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        siteName={site.name}
        onConfirm={() => {
          deleteSite(site._id);
          setShowDeleteModal(false);
          router.push("/sites");
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
