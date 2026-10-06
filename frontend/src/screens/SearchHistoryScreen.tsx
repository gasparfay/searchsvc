"use client";

import { useState } from "react";
import type { Screen } from "@/types";

export const HISTORIAL: {
  id: string; query: string; sitio: string; resultados: number; took_ms: number;
  timestamp: string; estado: "exito" | "vacio" | "error"; topResultado?: string;
}[] = [
  { id: "q-0041", query: "índice búsqueda mongodb",            sitio: "Todos los sitios",  resultados: 5, took_ms: 42,  timestamp: "2026-09-04 09:22:11", estado: "exito",  topResultado: "Construyendo un índice de búsqueda con MongoDB Atlas Search" },
  { id: "q-0040", query: "autenticación api key oauth",        sitio: "Wiki Interna",       resultados: 3, took_ms: 31,  timestamp: "2026-09-04 09:18:05", estado: "exito",  topResultado: "Estándares y convenciones de diseño de APIs" },
  { id: "q-0039", query: "configuración profundidad crawl",    sitio: "Todos los sitios",  resultados: 2, took_ms: 28,  timestamp: "2026-09-04 09:10:44", estado: "exito",  topResultado: "Crawling distribuido a escala" },
  { id: "q-0038", query: "precios plan empresarial",           sitio: "Acme Corporativo",   resultados: 1, took_ms: 19,  timestamp: "2026-09-04 08:55:30", estado: "exito",  topResultado: "Suite Empresarial Acme — Vista general del producto" },
  { id: "q-0037", query: "despliegue kubernetes helm chart",   sitio: "Todos los sitios",  resultados: 0, took_ms: 22,  timestamp: "2026-09-04 08:43:12", estado: "vacio" },
  { id: "q-0036", query: "respuesta incidente p0 escalación",  sitio: "Wiki Interna",       resultados: 4, took_ms: 35,  timestamp: "2026-09-04 08:30:01", estado: "exito",  topResultado: "Runbook de Respuesta a Incidentes — P0 y P1" },
  { id: "q-0035", query: "onboarding ingeniero nuevo entorno", sitio: "Wiki Interna",       resultados: 3, took_ms: 29,  timestamp: "2026-09-04 08:15:22", estado: "exito",  topResultado: "Onboarding de Ingeniería — Primeros pasos" },
  { id: "q-0034", query: "portal soporte tickets 24/7",        sitio: "Acme Corporativo",   resultados: 2, took_ms: 24,  timestamp: "2026-09-04 07:58:09", estado: "exito",  topResultado: "Portal de Soporte al Cliente" },
  { id: "q-0033", query: "cola distribuida deduplicación",     sitio: "Red de Blogs Tech",  resultados: 1, took_ms: 18,  timestamp: "2026-09-04 07:44:50", estado: "exito",  topResultado: "Crawling distribuido a escala" },
  { id: "q-0032", query: "scraping javascript cheerio",        sitio: "Todos los sitios",  resultados: 0, took_ms: 401, timestamp: "2026-09-04 07:30:00", estado: "error" },
];

const CONFIG_ESTADO = {
  exito:  { label: "OK",    sym: "◉", color: "#4a8c3f" },
  vacio:  { label: "VACÍO", sym: "◌", color: "#7a5c1e" },
  error:  { label: "ERR",   sym: "✕", color: "#a03020" },
};

const COLOR_SITIO: Record<string, string> = {
  "Todos los sitios":  "#5a3d10",
  "Red de Blogs Tech": "#4a8c3f",
  "Wiki Interna":      "#c8860e",
  "Acme Corporativo":  "#7a5c1e",
  "Documentación":     "#a03020",
};

export default function SearchHistoryScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [filtro, setFiltro] = useState<"all" | "exito" | "vacio" | "error">("all");
  const [busqueda, setBusqueda] = useState("");

  const visible = HISTORIAL.filter((h) => {
    const mf = filtro === "all" || h.estado === filtro;
    const mb = !busqueda || h.query.toLowerCase().includes(busqueda.toLowerCase());
    return mf && mb;
  });

  const stats = {
    total: HISTORIAL.length,
    exito: HISTORIAL.filter((h) => h.estado === "exito").length,
    vacio: HISTORIAL.filter((h) => h.estado === "vacio").length,
    error: HISTORIAL.filter((h) => h.estado === "error").length,
    avgMs: Math.round(HISTORIAL.reduce((a, h) => a + h.took_ms, 0) / HISTORIAL.length),
  };

  const FILTROS = [
    { key: "all",   label: `TODAS (${stats.total})` },
    { key: "exito", label: `OK (${stats.exito})` },
    { key: "vacio", label: `VACÍO (${stats.vacio})` },
    { key: "error", label: `ERROR (${stats.error})` },
  ] as const;

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#0d0b08" }}>
      <div className="max-w-4xl mx-auto px-10 py-10">

        <div className="text-xs mb-1" style={{ color: "#5a3d10", letterSpacing: "0.1em" }}>░ MÓDULO 03 ░</div>
        <h1 className="text-xl font-bold mb-1" style={{ color: "#f0a500", letterSpacing: "0.05em" }}>HISTORIAL DE BÚSQUEDAS</h1>
        <div className="text-xs mb-8" style={{ color: "#5a3d10" }}>Todas las consultas ejecutadas contra el endpoint de búsqueda.</div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "TOTAL",    valor: stats.total,          color: "#f0a500" },
            { label: "EXITOSAS", valor: stats.exito,          color: "#4a8c3f" },
            { label: "VACÍAS",   valor: stats.vacio,          color: "#7a5c1e" },
            { label: "LAT. PROM", valor: `${stats.avgMs}ms`, color: "#c8860e" },
          ].map((s) => (
            <div key={s.label} className="px-5 py-4" style={{ background: "#100d06", border: "1px solid #2a1f08" }}>
              <div className="text-xs mb-2" style={{ color: "#3a2a0a", letterSpacing: "0.1em" }}>{s.label}</div>
              <div className="text-3xl font-bold" style={{ color: s.color }}>{s.valor}</div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center" style={{ background: "#100d06", border: "1px solid #2a1f08", maxWidth: "260px" }}>
            <span className="pl-3 text-xs" style={{ color: "#3a2a0a" }}>⌕</span>
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="FILTRAR CONSULTAS..."
              className="flex-1 bg-transparent px-2 py-2.5 text-xs focus:outline-none"
              style={{ color: "#c8860e" }}
            />
          </div>
          <div className="flex gap-1">
            {FILTROS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                className="px-3 py-1.5 text-xs transition-all"
                style={{
                  background:   filtro === f.key ? "#f0a500" : "transparent",
                  color:        filtro === f.key ? "#0a0804" : "#5a3d10",
                  border:       filtro === f.key ? "1px solid #f0a500" : "1px solid #2a1f08",
                  letterSpacing: "0.06em",
                  fontWeight:   filtro === f.key ? 700 : 400,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div style={{ border: "1px solid #2a1f08" }}>
          <div className="flex items-center px-5 py-2.5" style={{ background: "#100d06", borderBottom: "1px solid #2a1f08" }}>
            <div className="text-xs font-bold" style={{ color: "#3a2a0a", letterSpacing: "0.08em" }}>
              ▶ {visible.length} REGISTROS ENCONTRADOS
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #1a1208" }}>
                {["CONSULTA", "SITIO", "RESULTADOS", "LATENCIA", "ESTADO", "HORA", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-2.5 text-xs" style={{ color: "#3a2a0a", letterSpacing: "0.08em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((h, i) => {
                const ec = CONFIG_ESTADO[h.estado];
                const cs = COLOR_SITIO[h.sitio] ?? "#5a3d10";
                return (
                  <tr
                    key={h.id}
                    onClick={() => onNavigate({ type: "search-detail", id: h.id })}
                    className="cursor-pointer transition-colors group"
                    style={{ borderBottom: i < visible.length - 1 ? "1px solid #130f05" : "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#100d06")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-5 py-4">
                      <div className="text-xs font-medium" style={{ color: "#c8860e" }}>{h.query}</div>
                      {h.topResultado && (
                        <div className="text-xs mt-0.5 truncate max-w-xs" style={{ color: "#3a2a0a" }}>↳ {h.topResultado}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: cs }}>{h.sitio}</td>
                    <td className="px-5 py-4 text-xs font-bold" style={{ color: h.resultados > 0 ? "#f0a500" : "#2a1f08" }}>{h.resultados}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: h.took_ms > 100 ? "#a03020" : "#5a3d10" }}>{h.took_ms}ms</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: ec.color, letterSpacing: "0.06em" }}>
                        <span>{ec.sym}</span>{ec.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: "#3a2a0a" }}>{h.timestamp.split(" ")[1]}</td>
                    <td className="px-5 py-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#f0a500" }}>
                      VER →
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {visible.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <div className="text-2xl" style={{ color: "#2a1f08" }}>⊘</div>
              <div className="text-xs" style={{ color: "#3a2a0a" }}>SIN REGISTROS QUE COINCIDAN CON EL FILTRO.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
