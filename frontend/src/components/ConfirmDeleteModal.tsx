"use client";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  siteName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  siteName,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-md rounded-xl p-6 shadow-2xl transition-all"
        style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "#fee2e2", color: "#dc2626" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">¿Eliminar sitio definitivamente?</h3>
            <p className="text-xs text-slate-500 mt-0.5">Esta acción es irreversible en MongoDB.</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-6 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
          Se eliminará el sitio <strong className="text-slate-900 font-semibold">{siteName}</strong> y todos sus snapshots y documentos extraídos asociados.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors"
            style={{ color: "#475569", background: "#f1f5f9" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 text-xs font-bold rounded-lg transition-colors text-white"
            style={{ background: "#dc2626" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#b91c1c")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#dc2626")}
          >
            Sí, Eliminar Sitio
          </button>
        </div>
      </div>
    </div>
  );
}
