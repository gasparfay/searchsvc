"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function DocumentDetailScreen({
  siteId,
  docId,
}: {
  siteId: string;
  docId: string;
}) {
  const { sites, documents, snapshots } = useApp();

  const site = sites.find((s) => s._id === siteId) || sites[0];
  const document = documents.find((d) => d.id === docId);

  if (!document) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center" style={{ background: "#f0f2f6" }}>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Documento no encontrado</h2>
        <p className="text-xs text-slate-500 mb-4">No se encontró ningún documento con el ID {docId}.</p>
        <Link href={`/sites/${siteId}`} className="text-xs text-emerald-600 font-bold hover:underline">
          Volver al Sitio
        </Link>
      </div>
    );
  }

  const snapshot = snapshots.find((s) => s.id === document.snapshotId);
  const snapshotDocs = documents.filter((d) => d.snapshotId === document.snapshotId && d.siteId === site?._id);
  const currentIndex = snapshotDocs.findIndex((d) => d.id === document.id);
  const prevDoc = currentIndex > 0 ? snapshotDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < snapshotDocs.length - 1 ? snapshotDocs[currentIndex + 1] : null;

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#f0f2f6" }}>
      <div className="px-10 py-8 max-w-5xl mx-auto">

        {/* Breadcrumb / Back button */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/sites/${siteId}`}
            className="text-xs inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Volver a {site?.name || "Mis Sitios"}
          </Link>

          <div className="flex items-center gap-2">
            {prevDoc && (
              <Link
                href={`/sites/${siteId}/docs/${prevDoc.id}`}
                className="px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                Anterior
              </Link>
            )}
            {nextDoc && (
              <Link
                href={`/sites/${siteId}/docs/${nextDoc.id}`}
                className="px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                Siguiente
              </Link>
            )}
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-xl overflow-hidden shadow-xs" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>

          {/* Header */}
          <div className="p-8 border-b border-slate-100">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                HTTP {document.httpStatus || 200} OK
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Doc ID: {document.id}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-mono">
                Snapshot: {document.snapshotId}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 leading-snug mb-3">
              {document.name}
            </h1>

            <div className="flex items-center gap-3">
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1.5 break-all"
              >
                {document.url}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6v6m-11 5L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-8 space-y-6">

            {/* Description */}
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Descripción Extraída (OG / Meta / Párrafo)
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                {document.description || "Sin descripción extraída para este documento."}
              </div>
            </div>

            {/* Full text content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Contenido de Texto Indexado
                </h2>
                <span className="text-[11px] text-slate-400 font-mono">
                  {document.content?.length || 0} caracteres
                </span>
              </div>
              <div
                className="text-xs text-slate-300 bg-slate-950 p-5 rounded-lg font-mono leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto"
                style={{ border: "1px solid #1e293b" }}
              >
                {document.content || "Sin contenido de texto indexado."}
              </div>
            </div>

            {/* Metadata grid */}
            <div className="pt-6 border-t border-slate-100">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Metadatos del Documento y Rastreo
              </h2>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Sitio Asociado</span>
                  <span className="font-semibold text-slate-800">{site?.name}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Fecha de Captura</span>
                  <span className="font-mono text-slate-800">{document.crawledAt}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Foto / Snapshot</span>
                  <span className="font-mono font-semibold text-emerald-700">{document.snapshotId}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <Link
              href={`/sites/${siteId}`}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Volver a la lista de documentos
            </Link>
            <span className="text-xs text-slate-400 font-mono">
              Documento {currentIndex + 1} de {snapshotDocs.length} en este snapshot
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
