"use client";

import { HISTORIAL } from "./SearchHistoryScreen";

const DOCS_POR_QUERY: Record<string, { id: string; sitio: string; nombre: string; url: string; descripcion: string; score: number }[]> = {
  "q-0041": [
    { id: "doc-04113", sitio: "Red de Blogs Tech", nombre: "Construyendo un índice de búsqueda con MongoDB Atlas Search",  url: "https://techblog.io/posts/mongodb-atlas-search-guide",    descripcion: "Guía paso a paso para configurar búsqueda de texto completo con MongoDB Atlas. Cubre índices, operadores $search y puntuación de relevancia.", score: 0.97 },
    { id: "doc-04112", sitio: "Red de Blogs Tech", nombre: "Crawling distribuido a escala — Arquitectura en profundidad",   url: "https://techblog.io/posts/distributed-crawling-2026",     descripcion: "Cómo los crawlers modernos procesan miles de millones de páginas usando colas distribuidas, hashing de deduplicación y políticas de cortesía.", score: 0.84 },
    { id: "doc-02872", sitio: "Wiki Interna",       nombre: "Estándares y convenciones de diseño de APIs",                  url: "https://wiki.internal.acme.corp/eng/api-standards",        descripcion: "Todas las APIs REST en Acme deben seguir estas convenciones: versionado por prefijo de ruta, envoltorios de error y OAuth 2.0.",                score: 0.71 },
    { id: "doc-00193", sitio: "Acme Corporativo",   nombre: "Suite Empresarial Acme — Vista general del producto",          url: "https://acme.corp/products/enterprise",                    descripcion: "La Suite Empresarial provee herramientas integrales: CRM, ERP, analytics e integraciones de API.",                                              score: 0.63 },
    { id: "doc-00192", sitio: "Acme Corporativo",   nombre: "Sobre Acme — Nuestra misión y valores",                       url: "https://acme.corp/about",                                  descripcion: "Acme Corporation es líder global en soluciones empresariales. Fundada en 1998, servimos a más de 12.000 clientes en todo el mundo.",             score: 0.51 },
  ],
};

const DOCS_DEFAULT = DOCS_POR_QUERY["q-0041"];

const COLORES_SITIO: Record<string, { texto: string; fondo: string }> = {
  "Red de Blogs Tech": { texto: "#0284c7", fondo: "#e0f2fe" },
  "Wiki Interna":      { texto: "#059669", fondo: "#d1fae5" },
  "Acme Corporativo":  { texto: "#b45309", fondo: "#fef3c7" },
};

const CONFIG_ESTADO = {
  exito:  { label: "Exitosa",          texto: "#059669", fondo: "#d1fae5" },
  vacio:  { label: "Sin resultados",   texto: "#b45309", fondo: "#fef3c7" },
  error:  { label: "Error",            texto: "#dc2626", fondo: "#fee2e2" },
};

function BarraScore({ score }: { score: number }) {
  const color = score >= 0.9 ? "#059669" : score >= 0.7 ? "#0284c7" : score >= 0.5 ? "#b45309" : "#dc2626";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 rounded-full" style={{ background: "#f3f4f6" }}>
        <div className="h-full rounded-full" style={{ width: `${score * 100}%`, background: color }} />
      </div>
      <span className="text-xs font-medium" style={{ color, fontFamily: "JetBrains Mono, monospace" }}>
        {(score * 100).toFixed(0)}%
      </span>
    </div>
  );
}

export default function SearchDetailScreen({ id, onBack }: { id: string; onBack: () => void }) {
  const entrada = HISTORIAL.find((h) => h.id === id) ?? HISTORIAL[0];
  const docs = DOCS_POR_QUERY[id] ?? DOCS_DEFAULT;
  const ec = CONFIG_ESTADO[entrada.estado];

  const jsonRespuesta = JSON.stringify({
    query: entrada.query,
    total: entrada.resultados,
    took_ms: entrada.took_ms,
    results: docs.slice(0, 2).map((r) => ({ id: r.id, nombre: r.nombre, score: r.score })),
  }, null, 2);

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#f5f5f7" }}>
      <div className="max-w-5xl mx-auto px-10 py-10">

        {/* Volver */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm mb-6 transition-colors"
          style={{ color: "#9ca3af" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
        >
          ← Volver al historial
        </button>

        {/* Header de la consulta */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: "#ffffff", border: "1px solid #f3f4f6" }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: "#e0f2fe", color: "#0284c7", fontFamily: "JetBrains Mono, monospace" }}>GET</span>
                <code className="text-xs" style={{ color: "#9ca3af", fontFamily: "JetBrains Mono, monospace" }}>
                  /search?q={entrada.query.replace(/\s+/g, "+")}
                </code>
              </div>
              <h1 className="text-lg font-semibold" style={{ color: "#111827", fontFamily: "JetBrains Mono, monospace" }}>
                "{entrada.query}"
              </h1>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0" style={{ background: ec.fondo, color: ec.texto }}>
              {ec.label}
            </span>
          </div>

          <div className="flex items-center gap-8 mt-5 pt-5" style={{ borderTop: "1px solid #f3f4f6" }}>
            {[
              { label: "ID",         valor: entrada.id },
              { label: "Sitio",      valor: entrada.sitio },
              { label: "Resultados", valor: String(entrada.resultados) },
              { label: "Latencia",   valor: `${entrada.took_ms}ms` },
              { label: "Fecha",      valor: entrada.timestamp },
            ].map((m) => (
              <div key={m.label}>
                <div className="text-xs mb-0.5" style={{ color: "#9ca3af" }}>{m.label}</div>
                <div className="text-xs font-medium" style={{ color: "#374151", fontFamily: "JetBrains Mono, monospace" }}>{m.valor}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dos columnas */}
        <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 320px" }}>
          {/* Documentos */}
          <div>
            <h2 className="text-sm font-semibold mb-4" style={{ color: "#374151" }}>
              {docs.length} documentos retornados
            </h2>
            <div className="flex flex-col gap-3">
              {docs.map((doc, idx) => {
                const cs = COLORES_SITIO[doc.sitio] ?? { texto: "#6b7280", fondo: "#f3f4f6" };
                return (
                  <div key={doc.id} className="rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #f3f4f6" }}>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5"
                        style={{ background: idx === 0 ? "#e0f2fe" : "#f9fafb", color: idx === 0 ? "#0284c7" : "#9ca3af", fontFamily: "JetBrains Mono, monospace" }}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: cs.fondo, color: cs.texto }}>{doc.sitio}</span>
                          <span className="text-xs" style={{ color: "#d1d5db" }}>{doc.id}</span>
                        </div>
                        <div className="text-sm font-medium mb-1" style={{ color: "#111827" }}>{doc.nombre}</div>
                        <div className="text-xs mb-2 truncate" style={{ color: "#0284c7", fontFamily: "JetBrains Mono, monospace" }}>{doc.url}</div>
                        <div className="text-xs leading-relaxed mb-3" style={{ color: "#6b7280" }}>{doc.descripcion}</div>
                        <BarraScore score={doc.score} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel lateral */}
          <div className="flex flex-col gap-4">
            {/* Solicitud */}
            <div className="rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #f3f4f6" }}>
              <div className="text-xs font-medium mb-3" style={{ color: "#6b7280" }}>Solicitud</div>
              <pre className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "#0284c7", fontFamily: "JetBrains Mono, monospace" }}>{`GET /search?q=${entrada.query.replace(/\s+/g, "+")}
Authorization: Bearer sk-a1b2...
Content-Type: application/json`}</pre>
            </div>

            {/* Respuesta JSON */}
            <div className="rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #f3f4f6" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium" style={{ color: "#6b7280" }}>Respuesta JSON</span>
                <button className="text-xs" style={{ color: "#9ca3af" }}>Copiar</button>
              </div>
              <pre className="text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap" style={{ color: "#059669", fontFamily: "JetBrains Mono, monospace" }}>{jsonRespuesta}</pre>
            </div>

            {/* Distribución de scores */}
            <div className="rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #f3f4f6" }}>
              <div className="text-xs font-medium mb-4" style={{ color: "#6b7280" }}>Distribución de scores</div>
              <div className="flex flex-col gap-3">
                {docs.map((r, i) => {
                  const color = r.score >= 0.9 ? "#059669" : r.score >= 0.7 ? "#0284c7" : r.score >= 0.5 ? "#b45309" : "#dc2626";
                  return (
                    <div key={r.id} className="flex items-center gap-2">
                      <span className="text-xs w-4 text-right shrink-0" style={{ color: "#9ca3af", fontFamily: "JetBrains Mono, monospace" }}>{i + 1}</span>
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "#f3f4f6" }}>
                        <div className="h-full rounded-full" style={{ width: `${r.score * 100}%`, background: color }} />
                      </div>
                      <span className="text-xs w-7 text-right shrink-0" style={{ color, fontFamily: "JetBrains Mono, monospace" }}>
                        {(r.score * 100).toFixed(0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
