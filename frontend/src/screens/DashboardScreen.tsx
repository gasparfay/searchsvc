"use client";

import Link from "next/link";
import { MOCK_SITES } from "@/data/mock-data";

const ESTADO_CFG: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  activo:  { label: "Activo",   dot: "#3ddc84", text: "#166534", bg: "#dcfce7" },
  pausado: { label: "Pausado",  dot: "#94a3b8", text: "#475569", bg: "#f1f5f9" },
  error:   { label: "Error",    dot: "#f87171", text: "#991b1b", bg: "#fee2e2" },
};

const IconGear = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/>
    <line x1="9.2" y1="9.2" x2="12.5" y2="12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

export default function DashboardScreen() {
  const activos = MOCK_SITES.filter((s) => s.status === "activo").length;
  const totalDocs = MOCK_SITES.reduce((a, s) => a + s.docsCount, 0);
  const errores = MOCK_SITES.filter((s) => s.status === "error").length;

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#f0f2f6" }}>
      <div className="px-10 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs mb-1.5" style={{ color: "#94a3b8", letterSpacing: "0.08em" }}>MIS SITIOS / RESUMEN</div>
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
            { label: "Sitios activos",        valor: activos,                        color: "#166534", bg: "#dcfce7", border: "#bbf7d0" },
            { label: "Documentos indexados",  valor: totalDocs.toLocaleString("es"), color: "#1e3a6e", bg: "#dbeafe", border: "#bfdbfe" },
            { label: "Sitios con error",      valor: errores,                        color: "#991b1b", bg: "#fee2e2", border: "#fecaca" },
          ].map((s) => (
            <div key={s.label} className="px-6 py-5 rounded-lg" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <div className="text-xs mb-2" style={{ color: s.color, opacity: 0.7, letterSpacing: "0.06em" }}>{s.label.toUpperCase()}</div>
              <div className="text-3xl font-bold" style={{ color: s.color }}>{s.valor}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold" style={{ color: "#0f172a", letterSpacing: "0.06em" }}>
              LISTADO DE SITIOS ({MOCK_SITES.length})
            </div>
            <div className="text-xs" style={{ color: "#94a3b8" }}>
              MongoDB Collection: sites
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#fafbfc" }}>
                {["Sitio / ID", "URL Base", "Frecuencia", "Última corrida", "Docs", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-6 py-3.5 text-xs font-medium" style={{ color: "#94a3b8", letterSpacing: "0.06em" }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_SITES.map((s, i) => {
                const ec = ESTADO_CFG[s.status];
                return (
                  <tr
                    key={s._id}
                    style={{ borderBottom: i < MOCK_SITES.length - 1 ? "1px solid #f8fafc" : "none" }}
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
                    <td className="px-6 py-4 text-xs" style={{ color: "#64748b" }}>{s.frequency}</td>
                    <td className="px-6 py-4 text-xs" style={{ color: "#64748b" }}>{s.lastRun}</td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#0f172a" }}>
                      {s.docsCount.toLocaleString("es")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: ec.bg, color: ec.text }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ec.dot }} />
                        {ec.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href="/config"
                          title="Configuración"
                          className="p-2.5 rounded transition-all inline-flex items-center justify-center"
                          style={{ color: "#94a3b8", background: "#f1f5f9" }}
                        >
                          <IconGear />
                        </Link>
                        <Link
                          href={`/sites/${s._id}`}
                          title="Ver documentos"
                          className="p-2.5 rounded transition-all inline-flex items-center justify-center"
                          style={{ color: "#3ddc84", background: "rgba(61,220,132,0.1)" }}
                        >
                          <IconSearch />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
