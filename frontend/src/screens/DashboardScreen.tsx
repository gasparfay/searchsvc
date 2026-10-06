"use client";

import type { Screen } from "@/types";

const SITIOS = [
  { id: "s-001", nombre: "Tienda Ejemplo",      url: "example.com",              estado: "activo",  ultimaCorrida: "Hace 2 horas",  docs: 1842, frecuencia: "Cada 6 horas" },
  { id: "s-002", nombre: "Blog Corporativo",    url: "techblog.acme.io",         estado: "activo",  ultimaCorrida: "Hace 3 horas",  docs: 4391, frecuencia: "Cada 12 horas" },
  { id: "s-005", nombre: "Wiki Interna",        url: "wiki.internal.acme.corp",  estado: "activo",  ultimaCorrida: "Hace 1 hora",   docs: 3104, frecuencia: "Cada 12 horas" },
  { id: "s-003", nombre: "Documentación Dev",   url: "docs.product.dev",         estado: "pausado", ultimaCorrida: "Hace 1 día",    docs: 782,  frecuencia: "Cada 24 horas" },
  { id: "s-004", nombre: "Repositorio Legal",   url: "legal.acme.corp",          estado: "error",   ultimaCorrida: "Hace 2 días",   docs: 229,  frecuencia: "Cada 48 horas" },
  { id: "s-006", nombre: "Portal de Soporte",   url: "support.acme.corp",        estado: "activo",  ultimaCorrida: "Hace 30 min",   docs: 956,  frecuencia: "Cada 6 horas" },
];

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

export default function DashboardScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const activos = SITIOS.filter((s) => s.estado === "activo").length;
  const totalDocs = SITIOS.reduce((a, s) => a + s.docs, 0);
  const errores = SITIOS.filter((s) => s.estado === "error").length;

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
          <button
            onClick={() => onNavigate("new-site")}
            className="flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all"
            style={{ background: "#3ddc84", color: "#0a1f14", letterSpacing: "0.04em" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2bc971")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3ddc84")}
          >
            + Registrar Nuevo Sitio
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Sitios activos",        valor: activos,                      color: "#166534",  bg: "#dcfce7", border: "#bbf7d0" },
            { label: "Documentos indexados",  valor: totalDocs.toLocaleString("es"), color: "#1e3a6e",  bg: "#dbeafe", border: "#bfdbfe" },
            { label: "Sitios con error",      valor: errores,                       color: "#991b1b",  bg: "#fee2e2", border: "#fecaca" },
          ].map((s) => (
            <div key={s.label} className="px-6 py-5 rounded-lg" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <div className="text-xs mb-2" style={{ color: s.color, opacity: 0.7, letterSpacing: "0.06em" }}>{s.label.toUpperCase()}</div>
              <div className="text-3xl font-bold" style={{ color: s.color }}>{s.valor}</div>
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div className="rounded-lg overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          {/* Tabla header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold" style={{ color: "#0f172a", letterSpacing: "0.06em" }}>
              {SITIOS.length} SITIOS REGISTRADOS
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded px-3 py-1.5 gap-2" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <IconSearch />
                <input
                  placeholder="Buscar sitio..."
                  className="bg-transparent text-xs focus:outline-none w-36"
                  style={{ color: "#64748b" }}
                />
              </div>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#fafbfc" }}>
                {["Sitio", "URL", "Frecuencia", "Última corrida", "Documentos", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium" style={{ color: "#94a3b8", letterSpacing: "0.06em" }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SITIOS.map((s, i) => {
                const ec = ESTADO_CFG[s.estado];
                return (
                  <tr
                    key={s.id}
                    style={{ borderBottom: i < SITIOS.length - 1 ? "1px solid #f8fafc" : "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfd")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold" style={{ color: "#0f172a" }}>{s.nombre}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{s.id}</div>
                    </td>
                    <td className="px-6 py-4 text-xs" style={{ color: "#475569" }}>{s.url}</td>
                    <td className="px-6 py-4 text-xs" style={{ color: "#64748b" }}>{s.frecuencia}</td>
                    <td className="px-6 py-4 text-xs" style={{ color: "#64748b" }}>{s.ultimaCorrida}</td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#0f172a" }}>
                      {s.docs.toLocaleString("es")}
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
                        <button
                          title="Configuración"
                          className="p-2.5 rounded transition-all"
                          style={{ color: "#94a3b8", background: "#f1f5f9" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#94a3b8"; }}
                        >
                          <IconGear />
                        </button>
                        <button
                          title="Ver documentos"
                          onClick={() => onNavigate({ type: "detail", siteId: s.id })}
                          className="p-2.5 rounded transition-all"
                          style={{ color: "#3ddc84", background: "rgba(61,220,132,0.1)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(61,220,132,0.2)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(61,220,132,0.1)"; }}
                        >
                          <IconSearch />
                        </button>
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
