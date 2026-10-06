"use client";

import { useState } from "react";

const SITIOS = [
  { id: "all",   label: "TODOS LOS SITIOS" },
  { id: "s-001", label: "Acme Corporativo" },
  { id: "s-002", label: "Red de Blogs Tech" },
  { id: "s-005", label: "Wiki Interna" },
  { id: "s-003", label: "Documentación" },
];

const RESULTADOS = [
  { id: "doc-04113", sitio: "Red de Blogs Tech", nombre: "Construyendo un índice de búsqueda con MongoDB Atlas Search", url: "https://techblog.io/posts/mongodb-atlas-search-guide", descripcion: "Guía paso a paso para configurar búsqueda de texto completo con MongoDB Atlas. Cubre configuración de índices, operadores $search y puntuación de relevancia con Lucene.", score: 0.97 },
  { id: "doc-04112", sitio: "Red de Blogs Tech", nombre: "Crawling distribuido a escala — Arquitectura en profundidad", url: "https://techblog.io/posts/distributed-crawling-2026", descripcion: "Cómo los crawlers modernos procesan miles de millones de páginas usando colas distribuidas, hashing de deduplicación y políticas de cortesía.", score: 0.84 },
  { id: "doc-02872", sitio: "Wiki Interna", nombre: "Estándares y convenciones de diseño de APIs", url: "https://wiki.internal.acme.corp/eng/api-standards", descripcion: "Todas las APIs REST en Acme deben seguir estas convenciones: versionado por prefijo de ruta, envoltorios de error consistentes y OAuth 2.0.", score: 0.71 },
  { id: "doc-00193", sitio: "Acme Corporativo", nombre: "Suite Empresarial Acme — Vista general del producto", url: "https://acme.corp/products/enterprise", descripcion: "La Suite Empresarial Acme provee herramientas integrales para grandes organizaciones incluyendo CRM, ERP, analytics e integraciones de API.", score: 0.63 },
];

const COLOR_SITIO: Record<string, string> = {
  "Red de Blogs Tech": "#4a8c3f",
  "Wiki Interna":      "#c8860e",
  "Acme Corporativo":  "#7a5c1e",
  "Documentación":     "#a03020",
};

function resaltar(texto: string, query: string) {
  if (!query.trim()) return texto;
  const partes = texto.split(new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return partes.map((p, i) =>
    p.toLowerCase() === query.trim().toLowerCase() ? (
      <mark key={i} style={{ background: "#3a2800", color: "#f0a500", padding: "0 2px" }}>{p}</mark>
    ) : p
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 0.9 ? "#4a8c3f" : score >= 0.7 ? "#f0a500" : score >= 0.5 ? "#7a5c1e" : "#a03020";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1" style={{ background: "#2a1f08" }}>
        <div className="h-full" style={{ width: `${score * 100}%`, background: color }} />
      </div>
      <span className="text-xs" style={{ color, minWidth: "2.5rem" }}>{(score * 100).toFixed(0)}%</span>
    </div>
  );
}

export default function SearchScreen() {
  const [query, setQuery] = useState("índice búsqueda mongodb");
  const [sitio, setSitio] = useState("all");
  const [buscado, setBuscado] = useState(true);
  const [cargando, setCargando] = useState(false);

  const resultados = RESULTADOS.filter(
    (r) => sitio === "all" || SITIOS.find((s) => s.id === sitio)?.label === r.sitio
  );

  function handleBuscar() {
    if (!query.trim()) return;
    setCargando(true);
    setTimeout(() => { setCargando(false); setBuscado(true); }, 500);
  }

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#0d0b08" }}>
      <div className="max-w-3xl mx-auto px-10 py-10">

        <div className="text-xs mb-1" style={{ color: "#5a3d10", letterSpacing: "0.1em" }}>░ MÓDULO 02 ░</div>
        <h1 className="text-xl font-bold mb-1" style={{ color: "#f0a500", letterSpacing: "0.05em" }}>PLAYGROUND DE BÚSQUEDA</h1>
        <div className="text-xs mb-8" style={{ color: "#5a3d10" }}>Ejecutá consultas por frase clave contra los documentos indexados.</div>

        {/* Panel de búsqueda */}
        <div className="p-5 mb-6" style={{ background: "#100d06", border: "1px solid #2a1f08" }}>
          <div className="text-xs mb-4" style={{ color: "#3a2a0a", letterSpacing: "0.08em" }}>▶ NUEVA CONSULTA</div>
          <div className="flex gap-3 mb-3">
            <div
              className="flex-1 flex items-center"
              style={{ background: "#0d0b08", border: "1px solid #2a1f08" }}
            >
              <span className="pl-3 text-xs shrink-0" style={{ color: "#3a2a0a" }}>q=</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                placeholder="frase clave a buscar..."
                className="flex-1 bg-transparent px-2 py-2.5 text-xs focus:outline-none"
                style={{ color: "#c8860e" }}
                onFocus={(e) => (e.target.parentElement!.style.borderColor = "#f0a500")}
                onBlur={(e) => (e.target.parentElement!.style.borderColor = "#2a1f08")}
              />
              {query && <button onClick={() => setQuery("")} className="px-3 text-xs" style={{ color: "#3a2a0a" }}>✕</button>}
            </div>

            <select
              value={sitio}
              onChange={(e) => setSitio(e.target.value)}
              className="px-3 text-xs focus:outline-none"
              style={{ background: "#0d0b08", border: "1px solid #2a1f08", color: "#c8860e", minWidth: "170px" }}
            >
              {SITIOS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>

            <button
              onClick={handleBuscar}
              className="px-5 py-2.5 text-xs font-bold transition-all"
              style={{ background: "#f0a500", color: "#0a0804", letterSpacing: "0.08em" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#c8860e")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#f0a500")}
            >
              {cargando ? "BUSCANDO..." : "▶ BUSCAR"}
            </button>
          </div>

          <div className="flex items-center gap-2 pt-3" style={{ borderTop: "1px solid #1a1208" }}>
            <span className="text-xs px-1.5 py-0.5" style={{ background: "#1a1208", color: "#f0a500", letterSpacing: "0.06em" }}>GET</span>
            <span className="text-xs" style={{ color: "#3a2a0a" }}>
              /search?q={query.replace(/\s+/g, "+") || "..."}{sitio !== "all" ? `&site=${sitio}` : ""}
            </span>
          </div>
        </div>

        {/* Resultados */}
        {buscado && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs" style={{ color: "#5a3d10" }}>
                <span style={{ color: "#f0a500" }}>{resultados.length}</span> RESULTADOS · 42ms
              </div>
              <select className="text-xs px-2 py-1 focus:outline-none" style={{ background: "#100d06", border: "1px solid #2a1f08", color: "#5a3d10" }}>
                <option>RELEVANCIA</option>
                <option>FECHA</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              {resultados.map((doc, idx) => {
                const colorSitio = COLOR_SITIO[doc.sitio] ?? "#5a3d10";
                return (
                  <div
                    key={doc.id}
                    className="p-5 transition-all"
                    style={{ background: "#100d06", border: "1px solid #1a1208" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3a2a0a")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1a1208")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold" style={{ color: colorSitio, letterSpacing: "0.06em" }}>{doc.sitio}</span>
                          <span className="text-xs" style={{ color: "#2a1f08" }}>#{String(idx + 1).padStart(2, "0")}</span>
                        </div>
                        <div className="text-sm font-bold mb-1 leading-snug" style={{ color: "#c8860e" }}>
                          {resaltar(doc.nombre, query)}
                        </div>
                        <div className="text-xs mb-2 truncate" style={{ color: "#3a2a0a" }}>{doc.url}</div>
                        <div className="text-xs leading-relaxed" style={{ color: "#5a3d10" }}>
                          {resaltar(doc.descripcion, query)}
                        </div>
                      </div>
                      <div className="shrink-0 pt-1">
                        <ScoreBar score={doc.score} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* JSON */}
            <div className="p-5" style={{ background: "#100d06", border: "1px solid #2a1f08" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs" style={{ color: "#3a2a0a", letterSpacing: "0.08em" }}>▶ RESPUESTA JSON</div>
                <button className="text-xs" style={{ color: "#3a2a0a" }}>COPIAR</button>
              </div>
              <pre className="text-xs leading-relaxed overflow-x-auto" style={{ color: "#4a8c3f" }}>{`{
  "query": "${query}",
  "total": ${resultados.length},
  "took_ms": 42,
  "results": [
    { "id": "${resultados[0]?.id}", "score": ${resultados[0]?.score} },
    ...
  ]
}`}</pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
