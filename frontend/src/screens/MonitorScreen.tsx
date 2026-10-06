"use client";

const JOBS = [
  { id: "job-041", sitio: "Tienda Ejemplo",      inicio: "04 sep · 09:12", duracion: "21m 08s", paginas: 1842, docs: 1842, errores: 2,  estado: "completado" },
  { id: "job-040", sitio: "Wiki Interna",         inicio: "04 sep · 08:50", duracion: "18m 44s", paginas: 3104, docs: 3098, errores: 0,  estado: "completado" },
  { id: "job-039", sitio: "Blog Corporativo",     inicio: "04 sep · 08:30", duracion: "en curso", paginas: 2103, docs: 2091, errores: 5,  estado: "corriendo"  },
  { id: "job-038", sitio: "Portal de Soporte",    inicio: "04 sep · 07:45", duracion: "9m 22s",  paginas: 956,  docs: 956,  errores: 0,  estado: "completado" },
  { id: "job-037", sitio: "Repositorio Legal",    inicio: "04 sep · 07:00", duracion: "2m 03s",  paginas: 32,   docs: 28,   errores: 47, estado: "error"      },
  { id: "job-036", sitio: "Documentación Dev",    inicio: "03 sep · 14:30", duracion: "9m 57s",  paginas: 782,  docs: 780,  errores: 1,  estado: "completado" },
];

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
            { label: "Corridas hoy",     valor: JOBS.length,                                         color: "#1e3a6e", bg: "#dbeafe", border: "#bfdbfe" },
            { label: "Completadas",      valor: JOBS.filter(j => j.estado === "completado").length,  color: "#166534", bg: "#dcfce7", border: "#bbf7d0" },
            { label: "En curso",         valor: JOBS.filter(j => j.estado === "corriendo").length,   color: "#1e40af", bg: "#dbeafe", border: "#bfdbfe" },
            { label: "Con errores",      valor: JOBS.filter(j => j.estado === "error").length,       color: "#991b1b", bg: "#fee2e2", border: "#fecaca" },
          ].map((s) => (
            <div key={s.label} className="px-5 py-4 rounded-lg" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <div className="text-xs mb-1.5" style={{ color: s.color, opacity: 0.7, letterSpacing: "0.06em" }}>{s.label.toUpperCase()}</div>
              <div className="text-3xl font-bold" style={{ color: s.color }}>{s.valor}</div>
            </div>
          ))}
        </div>

        <div className="rounded-lg overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold" style={{ color: "#0f172a", letterSpacing: "0.06em" }}>ÚLTIMAS CORRIDAS</div>
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
              {JOBS.map((j, i) => {
                const ec = ESTADO_CFG[j.estado];
                return (
                  <tr key={j.id}
                    style={{ borderBottom: i < JOBS.length - 1 ? "1px solid #f8fafc" : "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfd")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-6 py-4 text-xs" style={{ color: "#94a3b8" }}>{j.id}</td>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "#0f172a" }}>{j.sitio}</td>
                    <td className="px-6 py-4 text-xs" style={{ color: "#64748b" }}>{j.inicio}</td>
                    <td className="px-6 py-4 text-xs" style={{ color: j.estado === "corriendo" ? "#1e40af" : "#64748b" }}>{j.duracion}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#475569" }}>{j.paginas.toLocaleString("es")}</td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#0f172a" }}>{j.docs.toLocaleString("es")}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: j.errores > 0 ? "#dc2626" : "#94a3b8" }}>{j.errores}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: ec.bg, color: ec.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: ec.dot,
                          animation: j.estado === "corriendo" ? "pulse 1.5s infinite" : "none" }} />
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
