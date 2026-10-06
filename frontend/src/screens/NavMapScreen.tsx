"use client";

import type { Screen } from "@/types";

const SCREENS = [
  // Columna 0 — Login
  { id: "login",    col: 0, row: 0, label: "Login / Auth",         sub: "Google SSO via Auth0",      accent: "#94a3b8" },

  // Columna 1 — Dashboard
  { id: "dashboard", col: 1, row: 0, label: "Mis Sitios",           sub: "Listado de sitios",         accent: "#3ddc84" },

  // Columna 2 — Acciones desde Mis Sitios
  { id: "new-site",  col: 2, row: 0, label: "Registrar Sitio",      sub: "Formulario + code editors", accent: "#60a5fa" },
  { id: "detail",    col: 2, row: 1, label: "Detalle del Sitio",    sub: "API key · corridas · docs", accent: "#60a5fa" },
  { id: "monitor",   col: 2, row: 2, label: "Monitoreo",            sub: "Historial de jobs",         accent: "#a78bfa" },
  { id: "config",    col: 2, row: 3, label: "Configuración",        sub: "Perfil · parámetros · key", accent: "#f9a825" },

  // Columna 3 — Sub-acciones desde Detalle
  { id: "search",    col: 3, row: 0, label: "Búsqueda (API)",       sub: "GET /search?q=keyphrase",   accent: "#f87171" },
  { id: "snapshot",  col: 3, row: 1, label: "Explorador de Docs",   sub: "Grilla de documentos",      accent: "#34d399" },
];

const COL_X: Record<number, number> = { 0: 60, 1: 280, 2: 520, 3: 760 };
const ROW_Y: Record<number, number> = { 0: 60, 1: 200, 2: 340, 3: 480 };
const W = 170;
const H = 72;

const EDGES: { from: string; to: string; label?: string }[] = [
  { from: "login",    to: "dashboard" },
  { from: "dashboard",to: "new-site",  label: "+ Registrar" },
  { from: "dashboard",to: "detail",    label: "Ver docs" },
  { from: "dashboard",to: "monitor",   label: "Monitoreo" },
  { from: "dashboard",to: "config",    label: "Configuración" },
  { from: "detail",   to: "search",    label: "Probar búsqueda" },
  { from: "detail",   to: "snapshot",  label: "Ver snapshot" },
];

function getCenter(id: string) {
  const s = SCREENS.find((s) => s.id === id)!;
  return {
    x: COL_X[s.col] + W / 2,
    y: ROW_Y[s.row] + H / 2,
  };
}

function EdgeLine({ from, to, label }: { from: string; to: string; label?: string }) {
  const a = getCenter(from);
  const b = getCenter(to);
  const mx = (a.x + b.x) / 2;

  const path = `M ${a.x + W / 2 - 5} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x - W / 2 + 5} ${b.y}`;
  const midX = (a.x + W / 2 + b.x - W / 2) / 2;
  const midY = (a.y + b.y) / 2;

  return (
    <g>
      <path d={path} stroke="#2a3a52" strokeWidth="1.5" fill="none" strokeDasharray={from === "login" ? "none" : "none"} markerEnd="url(#arrow)" />
      {label && (
        <text x={midX} y={midY - 7} textAnchor="middle" fontSize="9" fill="#3a5570" fontFamily="JetBrains Mono, monospace">
          {label}
        </text>
      )}
    </g>
  );
}

function ScreenNode({ id, col, row, label, sub, accent, onClick }: {
  id: string; col: number; row: number; label: string; sub: string; accent: string; onClick?: () => void;
}) {
  const x = COL_X[col];
  const y = ROW_Y[row];
  return (
    <g onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <rect x={x} y={y} width={W} height={H} rx="8"
        fill="#111e30" stroke={accent} strokeWidth="1.5"
      />
      {/* accent bar izquierda */}
      <rect x={x} y={y + 10} width="3" height={H - 20} rx="1.5" fill={accent} />
      <text x={x + 16} y={y + 27} fontSize="11" fontWeight="600" fill="#e2e8f4" fontFamily="JetBrains Mono, monospace">
        {label}
      </text>
      <text x={x + 16} y={y + 46} fontSize="9" fill="#3a5570" fontFamily="JetBrains Mono, monospace">
        {sub}
      </text>
      {/* badge id */}
      <rect x={x + W - 40} y={y + 8} width={32} height={14} rx="4" fill={`${accent}22`} />
      <text x={x + W - 24} y={y + 19} fontSize="7" textAnchor="middle" fill={accent} fontFamily="JetBrains Mono, monospace">
        {id.toUpperCase().slice(0, 6)}
      </text>
    </g>
  );
}

const COL_LABELS: Record<number, string> = {
  0: "AUTENTICACIÓN",
  1: "PRINCIPAL",
  2: "MÓDULOS",
  3: "ACCIONES",
};

export default function NavMapScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const svgW = 980;
  const svgH = 620;

  return (
    <div className="h-full overflow-auto" style={{ background: "#0a1120" }}>
      <div className="px-10 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="text-xs mb-1.5" style={{ color: "#3a5570", letterSpacing: "0.08em" }}>DOCUMENTACIÓN / FLUJO</div>
            <h1 className="text-2xl font-bold" style={{ color: "#e2e8f4" }}>Mapa de Navegación</h1>
            <div className="text-xs mt-1" style={{ color: "#3a5570" }}>
              Flujo de pantallas y conexiones del sistema SearchSvc Admin.
            </div>
          </div>
          <div className="flex items-center gap-4">
            {[
              { color: "#3ddc84", label: "Pantalla principal" },
              { color: "#60a5fa", label: "Gestión de sitios" },
              { color: "#a78bfa", label: "Monitoreo" },
              { color: "#f87171", label: "API / Búsqueda" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                <span className="text-xs" style={{ color: "#3a5570" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="rounded-xl overflow-hidden" style={{ background: "#0d1829", border: "1px solid #1e2d42" }}>

          {/* Column headers */}
          <div className="flex" style={{ borderBottom: "1px solid #1a2840" }}>
            {[0, 1, 2, 3].map((col) => (
              <div key={col} className="flex-1 px-6 py-3 text-xs font-bold"
                style={{ color: "#3a5570", letterSpacing: "0.1em", borderRight: col < 3 ? "1px solid #1a2840" : "none" }}>
                {COL_LABELS[col]}
              </div>
            ))}
          </div>

          {/* SVG diagram */}
          <div className="p-6">
            <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: "visible" }}>
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#2a3a52" />
                </marker>
                {/* Grid dots */}
                <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.8" fill="#1a2840" />
                </pattern>
              </defs>

              {/* Background dots */}
              <rect width={svgW} height={svgH} fill="url(#dots)" />

              {/* Column separators */}
              {[1, 2, 3].map((col) => (
                <line key={col} x1={COL_X[col] - 25} y1={0} x2={COL_X[col] - 25} y2={svgH}
                  stroke="#1a2840" strokeWidth="1" strokeDasharray="4,4" />
              ))}

              {/* Edges */}
              {EDGES.map((e) => (
                <EdgeLine key={`${e.from}-${e.to}`} {...e} />
              ))}

              {/* Nodes */}
              {SCREENS.map((s) => (
                <ScreenNode key={s.id} {...s}
                  onClick={
                    s.id === "dashboard" ? () => onNavigate("dashboard")
                    : s.id === "new-site" ? () => onNavigate("new-site")
                    : s.id === "detail"   ? () => onNavigate({ type: "detail", siteId: "s-001" })
                    : s.id === "monitor"  ? () => onNavigate("monitor")
                    : s.id === "config"   ? () => onNavigate("config")
                    : s.id === "search"   ? () => onNavigate("search")
                    : s.id === "snapshot" ? () => onNavigate("explorer")
                    : undefined
                  }
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Tabla de pantallas */}
        <div className="mt-6 rounded-xl overflow-hidden" style={{ border: "1px solid #1e2d42" }}>
          <div className="px-6 py-4" style={{ background: "#0d1829", borderBottom: "1px solid #1a2840" }}>
            <div className="text-xs font-bold" style={{ color: "#e2e8f4", letterSpacing: "0.06em" }}>INVENTARIO DE PANTALLAS</div>
          </div>
          <table className="w-full" style={{ background: "#0a1120" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1a2840" }}>
                {["ID", "Pantalla", "Descripción", "Acceso desde", "Tipo"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium" style={{ color: "#3a5570", letterSpacing: "0.06em" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { id: "LOGIN",    name: "Login / Auth",       desc: "Autenticación con Google via Auth0",          from: "—",                     tipo: "Auth"      },
                { id: "DASH",     name: "Mis Sitios",         desc: "Listado y gestión de sitios registrados",     from: "Login",                 tipo: "Principal" },
                { id: "NEW",      name: "Registrar Sitio",    desc: "Formulario con URL, profundidad y extractores",from: "Mis Sitios",            tipo: "Formulario"},
                { id: "DETAIL",   name: "Detalle del Sitio",  desc: "API key, historial de corridas, documentos",  from: "Mis Sitios",            tipo: "Detalle"   },
                { id: "MONITOR",  name: "Monitoreo",          desc: "Historial de jobs y estado de corridas",      from: "Sidebar",               tipo: "Listado"   },
                { id: "CONFIG",   name: "Configuración",      desc: "Perfil, parámetros globales y API key",       from: "Sidebar",               tipo: "Settings"  },
                { id: "SEARCH",   name: "Búsqueda (API)",     desc: "Endpoint GET /search?q= para consumidores",   from: "Detalle del Sitio",     tipo: "API"       },
                { id: "SNAPSHOT", name: "Explorador de Docs", desc: "Grilla de documentos de una corrida",         from: "Detalle del Sitio",     tipo: "Detalle"   },
              ].map((row, i, arr) => (
                <tr key={row.id} style={{ borderBottom: i < arr.length - 1 ? "1px solid #0f1a2a" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#0d1829")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="px-6 py-3.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#1a2840", color: "#3ddc84" }}>{row.id}</span>
                  </td>
                  <td className="px-6 py-3.5 text-sm font-medium" style={{ color: "#c8d8ec" }}>{row.name}</td>
                  <td className="px-6 py-3.5 text-xs" style={{ color: "#3a5570" }}>{row.desc}</td>
                  <td className="px-6 py-3.5 text-xs" style={{ color: "#3a5570" }}>{row.from}</td>
                  <td className="px-6 py-3.5">
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#1a2840", color: "#60a5fa" }}>{row.tipo}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
