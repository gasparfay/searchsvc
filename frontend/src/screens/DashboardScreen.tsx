"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function DashboardScreen() {
  const { sites, jobs, deleteSite } = useApp();
  const [siteToDelete, setSiteToDelete] = useState<{ id: string; name: string } | null>(null);

  const totalSites = sites.length;
  const totalDocs = sites.reduce((a, s) => a + (s.docsCount || 0), 0);
  const totalRunsToday = jobs.filter((j) => j.inicio.includes("Hoy")).length;

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#f0f2f6" }}>
      <div className="px-10 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs mb-1.5" style={{ color: "#94a3b8", letterSpacing: "0.08em" }}>
              MIS SITIOS / RESUMEN
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#0f172a", letterSpacing: "-0.01em" }}>
              Sitios Registrados
            </h1>
          </div>
          <Link
            href="/sites/new"
            className="flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all rounded"
            style={{ background: "#3ddc84", color: "#0a1f14", letterSpacing: "0.04em" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2bc971")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3ddc84")}
          >
            + Registrar Nuevo Sitio
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Sitios registrados",     valor: totalSites,                    color: "#166534", bg: "#dcfce7", border: "#bbf7d0" },
            { label: "Documentos indexados",  valor: totalDocs.toLocaleString("es"), color: "#1e3a6e", bg: "#dbeafe", border: "#bfdbfe" },
            { label: "Corridas registradas",   valor: totalRunsToday,                 color: "#475569", bg: "#f1f5f9", border: "#e2e8f0" },
          ].map((s) => (
            <div key={s.label} className="px-6 py-5 rounded-lg" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <div className="text-xs mb-2" style={{ color: s.color, opacity: 0.8, letterSpacing: "0.06em" }}>{s.label.toUpperCase()}</div>
              <div className="text-3xl font-bold" style={{ color: s.color }}>{s.valor}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold" style={{ color: "#0f172a", letterSpacing: "0.06em" }}>
              LISTADO DE SITIOS ({sites.length})
            </div>
            <div className="text-xs" style={{ color: "#94a3b8" }}>
              MongoDB Collection: sites
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#fafbfc" }}>
                {["Sitio / ID", "URL Base", "Profundidad", "Frecuencia", "Última Foto", "Docs", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-6 py-3.5 text-xs font-medium" style={{ color: "#94a3b8", letterSpacing: "0.06em" }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sites.map((s, i) => {
                const isOk = s.lastRunStatus === "ok";
                return (
                  <tr
                    key={s._id}
                    style={{ borderBottom: i < sites.length - 1 ? "1px solid #f8fafc" : "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfd")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-6 py-4">
                      <Link href={`/sites/${s._id}`} className="text-sm font-semibold hover:underline block" style={{ color: "#0f172a" }}>
                        {s.name}
                      </Link>
                      <div className="text-xs mt-0.5 font-mono" style={{ color: "#94a3b8" }}>{s._id}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono" style={{ color: "#475569" }}>{s.url}</td>
                    <td className="px-6 py-4 text-xs" style={{ color: "#64748b" }}>
                      <span className="font-semibold text-slate-700">{s.maxDepth}</span> {s.maxDepth === 1 ? "nivel" : "niveles"}
                    </td>
                    <td className="px-6 py-4 text-xs" style={{ color: "#64748b" }}>{s.frequency}</td>
                    <td className="px-6 py-4 text-xs">
                      <div className="text-slate-800">{s.lastRunDate || "Sin corridas"}</div>
                      {s.lastRunStatus && (
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                          isOk ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isOk ? "bg-emerald-500" : "bg-red-500"}`} />
                          {isOk ? "Foto OK" : "Con errores"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#0f172a" }}>
                      {(s.docsCount || 0).toLocaleString("es")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* Ver Detalle */}
                        <Link
                          href={`/sites/${s._id}`}
                          title="Ver fotos y documentos"
                          className="p-2.5 rounded transition-all inline-flex items-center justify-center"
                          style={{ color: "#3ddc84", background: "rgba(61,220,132,0.1)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(61,220,132,0.2)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(61,220,132,0.1)")}
                        >
                          <IconEye />
                        </Link>

                        {/* Editar Configuración de ESTE sitio */}
                        <Link
                          href={`/sites/${s._id}/edit`}
                          title="Editar configuración del sitio"
                          className="p-2.5 rounded transition-all inline-flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                          style={{ background: "#f1f5f9" }}
                        >
                          <IconEdit />
                        </Link>

                        {/* Eliminar Sitio */}
                        <button
                          type="button"
                          onClick={() => setSiteToDelete({ id: s._id, name: s.name })}
                          title="Eliminar sitio"
                          className="p-2.5 rounded transition-all inline-flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-100"
                          style={{ background: "#fee2e2" }}
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {sites.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-slate-400">
                    No tienes sitios registrados. Haz clic en "+ Registrar Nuevo Sitio" para comenzar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal de confirmación para eliminar */}
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
