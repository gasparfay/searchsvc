"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import type { ExtractedDocument } from "@/types";
import DocumentDetailModal from "@/components/DocumentDetailModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function SiteDetailScreen({ siteId }: { siteId: string }) {
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

  const activeSnapshot = siteSnapshots.find((s) => s.id === selectedSnapshotId) || siteSnapshots[0];

  const [querySearch, setQuerySearch] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlSuccessMessage, setCrawlSuccessMessage] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<ExtractedDocument | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Documents for the currently active snapshot
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
          ← Volver a Mis Sitios
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
      setCrawlSuccessMessage(`¡Corrida completada con éxito! Se capturó una nueva foto (${newSnap.id}) con ${newSnap.docs} documentos.`);
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

        {/* Header con migas de pan y acciones */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Link
              href="/sites"
              className="text-xs mb-2 inline-flex items-center gap-1 transition-colors"
              style={{ color: "#94a3b8" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              ← Volver a Mis Sitios
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>{site.name}</h1>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                ● Programado: {site.frequency}
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

          {/* Botones de acción del sitio */}
          <div className="flex items-center gap-3">
            {/* Ejecutar Crawl Ahora */}
            <button
              type="button"
              onClick={handleTriggerCrawl}
              disabled={isCrawling}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all shadow-xs"
              style={{
                background: isCrawling ? "#94a3b8" : "#3ddc84",
                color: "#0a1f14",
                cursor: isCrawling ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => !isCrawling && (e.currentTarget.style.background = "#2bc971")}
              onMouseLeave={(e) => !isCrawling && (e.currentTarget.style.background = "#3ddc84")}
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Ejecutar Crawl Ahora
                </>
              )}
            </button>

            {/* Editar Configuración */}
            <Link
              href={`/sites/${site._id}/edit`}
              className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              ✏️ Editar Configuración
            </Link>

            {/* Eliminar Sitio */}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-3.5 py-2.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Mensaje de confirmación de corrida */}
        {crawlSuccessMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-700">✓</span>
              <span>{crawlSuccessMessage}</span>
            </div>
            <button onClick={() => setCrawlSuccessMessage("")} className="text-emerald-700 font-bold hover:underline">
              Cerrar
            </button>
          </div>
        )}

        {/* Panel: Selector de Fotos / Snapshots Históricos */}
        <div className="rounded-xl mb-6" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div>
              <div className="text-xs font-bold" style={{ color: "#0f172a", letterSpacing: "0.06em" }}>
                FOTOS / SNAPSHOTS HISTÓRICOS DEL SITIO ({siteSnapshots.length})
              </div>
              <div className="text-xs mt-0.5 text-slate-500">
                Seleccioná una foto para inspeccionar los documentos extraídos por el job en esa corrida.
              </div>
            </div>
            {activeSnapshot && (
              <span className="text-xs font-mono text-slate-500">
                Foto activa: <strong className="text-slate-800">{activeSnapshot.id}</strong>
              </span>
            )}
          </div>

          {/* Lista horizontal de Snapshots */}
          <div className="p-4 overflow-x-auto">
            <div className="flex items-center gap-3">
              {siteSnapshots.map((snap) => {
                const isSelected = (activeSnapshot?.id === snap.id);
                const isOk = snap.estado === "ok";
                return (
                  <button
                    key={snap.id}
                    type="button"
                    onClick={() => setSelectedSnapshotId(snap.id)}
                    className="flex-shrink-0 text-left p-3.5 rounded-lg border transition-all text-xs"
                    style={{
                      minWidth: "200px",
                      background: isSelected ? "#f0fdf4" : "#f8fafc",
                      borderColor: isSelected ? "#3ddc84" : "#e2e8f0",
                      boxShadow: isSelected ? "0 0 0 2px rgba(61,220,132,0.2)" : "none",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold font-mono text-slate-900">{snap.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isOk ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {isOk ? "OK" : "Parcial"}
                      </span>
                    </div>
                    <div className="text-slate-600 font-medium mb-1">{snap.fecha}</div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>{snap.docs.toLocaleString("es")} docs</span>
                      <span>{snap.duracion}</span>
                    </div>
                  </button>
                );
              })}

              {siteSnapshots.length === 0 && (
                <div className="py-6 px-4 text-xs text-slate-400">
                  No hay fotos registradas para este sitio aún. Haz clic en "Ejecutar Crawl Ahora" para generar la primera foto.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel: Documentos extraídos de la foto seleccionada */}
        <div className="rounded-xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="px-6 py-4 flex items-center justify-between gap-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div>
              <div className="text-xs font-bold" style={{ color: "#0f172a", letterSpacing: "0.06em" }}>
                DOCUMENTOS EXTRAÍDOS DE LA FOTO ({activeSnapshot ? activeSnapshot.id : "—"})
              </div>
              <div className="text-xs mt-0.5 text-slate-500">
                Mostrando {filteredDocs.length} de {activeDocs.length} documentos. Haz clic en cualquier tarjeta para ver el contenido completo.
              </div>
            </div>

            {/* Buscador de documentos */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", minWidth: "300px" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4" stroke="#94a3b8" strokeWidth="1.3"/>
                <line x1="9.2" y1="9.2" x2="12.5" y2="12.5" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
                placeholder="Filtrar por título, url o descripción..."
                className="flex-1 bg-transparent text-xs focus:outline-none text-slate-700"
              />
              {querySearch && (
                <button onClick={() => setQuerySearch("")} className="text-xs text-slate-400 hover:text-slate-600">✕</button>
              )}
            </div>
          </div>

          {/* Grilla de Documentos */}
          <div className="p-6 grid grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="rounded-lg p-4 transition-all cursor-pointer hover:shadow-xs group"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#3ddc84";
                  e.currentTarget.style.background = "#f0fdf4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.background = "#f8fafc";
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold leading-snug text-slate-900 group-hover:text-emerald-900 line-clamp-2">
                    {doc.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {doc.id}
                  </span>
                </div>
                <div className="text-xs mb-2.5 truncate font-mono text-emerald-600">
                  {doc.url}
                </div>
                <p className="text-xs leading-relaxed text-slate-500 line-clamp-3">
                  {doc.description || "Sin descripción."}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{doc.crawledAt?.split(" ")[0]}</span>
                  <span className="text-emerald-700 font-medium group-hover:underline">
                    Ver detalle →
                  </span>
                </div>
              </div>
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

      {/* Modal de Detalle de Documento */}
      <DocumentDetailModal
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />

      {/* Modal de confirmación para eliminar sitio */}
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
