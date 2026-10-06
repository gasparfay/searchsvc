"use client";

import type { ExtractedDocument } from "@/types";

interface DocumentDetailModalProps {
  document: ExtractedDocument | null;
  onClose: () => void;
}

export default function DocumentDetailModal({
  document,
  onClose,
}: DocumentDetailModalProps) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 flex items-start justify-between gap-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                HTTP {document.httpStatus ?? 200} OK
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {document.id}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {document.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Cerrar modal"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* URL */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              URL de la Página Visitada
            </div>
            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-mono inline-flex items-center gap-1.5 break-all"
            >
              {document.url}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6v6m-11 5L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* Description */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Descripción Extraída (OG / Meta / P)
            </div>
            <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              {document.description || "Sin descripción extraída para este documento."}
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Contenido de Texto Indexado
            </div>
            <div
              className="text-xs text-slate-300 bg-slate-950 p-4 rounded-lg font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto"
              style={{ border: "1px solid #1e293b" }}
            >
              {document.content || "Sin contenido de texto indexado."}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400">Snapshot: </span>
              <span className="font-mono text-slate-700 font-semibold">{document.snapshotId}</span>
            </div>
            <div>
              <span className="text-slate-400">Fecha de rastreo: </span>
              <span className="font-mono text-slate-700">{document.crawledAt}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
