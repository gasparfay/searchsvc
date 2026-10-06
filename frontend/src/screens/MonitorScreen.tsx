"use client";

import { MOCK_JOBS } from "@/data/mock-data";

const ESTADO_CFG: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  completado: { label: "Completado", dot: "#3ddc84", text: "#166534", bg: "#dcfce7" },
  corriendo:  { label: "En curso",   dot: "#60a5fa", text: "#1e40af", bg: "#dbeafe" },
  error:      { label: "Error",      dot: "#f87171", text: "#991b1b", bg: "#fee2e2" },
};

export default function MonitorScreen() {
  return (
    <div className="h-full overflow-y-auto" style={{ background: "#f0f2f6" }}>
      <div className="px-10 py-8">

        <div className="text-xs mb-1.5" style={{ color: "#94a3b8", letterSpacing: "0.08em" }}>MONITOREO / CORRIDAS</div>
        <h1 className="text-2xl font-bold mb-8" style={{ color: "#0f172a" }}>Monitoreo de Corridas</h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Corridas hoy",     valor: MOCK_JOBS.length,                                         color: "#1e3a6e", bg: "#dbeafe", border: "#bfdbfe" },
            { label: "Completadas",      valor: MOCK_JOBS.filter(j => j.estado === "completado").length,  color: "#166534", bg: "#dcfce7", border: "#bbf7d0" },
            { label: "En curso",         valor: MOCK_JOBS.filter(j => j.estado === "corriendo").length,   color: "#1e40af", bg: "#dbeafe", border: "#bfdbfe" },
            { label: "Con errores",      valor: MOCK_JOBS.filter(j => j.estado === "error").length,       color: "#991b1b", bg: "#fee2e2", border: "#fecaca" },
          ].map((s) => (
            <div key={s.label} className="px-5 py-4 rounded-lg" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <div className="text-xs mb-1.5" style={{ color: s.color, opacity: 0.7, letterSpacing: "0.06em" }}>{s.label.toUpperCase()}</div>
              <div className="text-3xl font-bold" style={{ color: s.color }}>{s.valor}</div>
            </div>
          ))}
        </div>

        <div className="rounded-lg overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold" style={{ color: "#0f172a", letterSpacing: "0.06em" }}>ÚLTIMAS CORRIDAS DEL CRAWLER</div>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#fafbfc" }}>
                {["Job ID", "Sitio", "Inicio", "Duración", "Páginas", "Documentos", "Errores", "Estado"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium" style={{ color: "#94a3b8", letterSpacing: "0.06em" }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_JOBS.map((j, i) => {
                const ec = ESTADO_CFG[j.estado];
                return (
                  <tr key={j.id}
                    style={{ borderBottom: i < MOCK_JOBS.length - 1 ? "1px solid #f8fafc" : "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfd")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td className="px-6 py-4 text-xs font-mono font-bold" style={{ color: "#0f172a" }}>{j.id}</td>
                    <td className="px-6 py-4 text-xs font-medium" style={{ color: "#0f172a" }}>{j.sitio}</td>
                    <td className="px-6 py-4 text-xs" style={{ color: "#64748b" }}>{j.inicio}</td>
                    <td className="px-6 py-4 text-xs" style={{ color: "#64748b" }}>{j.duracion}</td>
                    <td className="px-6 py-4 text-xs font-semibold" style={{ color: "#0f172a" }}>{j.paginas.toLocaleString("es")}</td>
                    <td className="px-6 py-4 text-xs font-semibold" style={{ color: "#0f172a" }}>{j.docs.toLocaleString("es")}</td>
                    <td className="px-6 py-4 text-xs font-bold" style={{ color: j.errores > 0 ? "#f87171" : "#94a3b8" }}>{j.errores}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: ec.bg, color: ec.text }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ec.dot }} />
                        {ec.label}
                      </span>
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
