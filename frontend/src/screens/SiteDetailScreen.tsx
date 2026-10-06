"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_SITES, MOCK_ACCOUNT, MOCK_SNAPSHOTS, MOCK_DOCUMENTS } from "@/data/mock-data";

export default function SiteDetailScreen({ siteId }: { siteId: string }) {
  const sitio = MOCK_SITES.find((s) => s._id === siteId) ?? MOCK_SITES[0];
  const [snapshotId, setSnapshotId] = useState(MOCK_SNAPSHOTS[0].id);
  const [copiado, setCopiado] = useState(false);
  const [querySearch, setQuerySearch] = useState("");

  function copiar() {
    navigator.clipboard?.writeText(MOCK_ACCOUNT.apiKey);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const docsFiltrados = MOCK_DOCUMENTS.filter((d) =>
    !querySearch || d.titulo.toLowerCase().includes(querySearch.toLowerCase()) || d.desc.toLowerCase().includes(querySearch.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#f0f2f6" }}>
      <div className="px-10 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/sites"
              className="text-xs mb-2 inline-flex items-center gap-1 transition-colors"
              style={{ color: "#94a3b8" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              ← Volver a Mis Sitios
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>{sitio.name}</h1>
            <div className="text-xs mt-1 font-mono" style={{ color: "#94a3b8" }}>
              {sitio.url} · ID: {sitio._id}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
            style={{ background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#3ddc84" }} />
            {sitio.status === "activo" ? "Activo" : sitio.status} · corrida automática: {sitio.frequency}
          </div>
        </div>

        {/* Panel 1: API Key */}
        <div className="rounded-xl p-6 mb-5 flex items-center justify-between gap-6"
          style={{ background: "#0e1525", border: "1px solid #1e3a5f" }}>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold mb-2" style={{ color: "#3ddc84", letterSpacing: "0.08em" }}>
              🔑 API KEY DE LA CUENTA
            </div>
            <div className="text-sm" style={{ color: "#94a3b8", marginBottom: "6px" }}>
              Incluí esta clave en el header <span style={{ color: "#3ddc84" }}>Authorization</span> para realizar búsquedas en <span style={{ color: "#60a5fa" }}>GET /search?q=...</span>
            </div>
            <div className="text-sm font-bold tracking-wider font-mono" style={{ color: "#e2e8f4" }}>{MOCK_ACCOUNT.apiKey}</div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={copiar}
              className="px-5 py-2.5 text-xs font-bold rounded-lg transition-all"
              style={{ background: copiado ? "#2bc971" : "#3ddc84", color: "#0a1f14", minWidth: "100px" }}
            >
              {copiado ? "✓ Copiado" : "Copiar Key"}
            </button>
            <div className="text-xs text-center font-mono" style={{ color: "#3a5570" }}>
              Bearer Token
            </div>
          </div>
        </div>

        {/* Panel 2: Historial de Snapshots / Corridas */}
        <div className="rounded-xl mb-5" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold" style={{ color: "#0f172a", letterSpacing: "0.06em" }}>
              FOTOS / SNAPSHOTS HISTÓRICOS DEL CRAWLER
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
              Seleccioná una foto para explorar los documentos capturados en esa ejecución del job.
            </div>
          </div>

          {/* Timeline horizontal */}
          <div className="px-6 py-5">
            <div className="flex items-start gap-0">
              {MOCK_SNAPSHOTS.map((r, i) => {
                const selected = snapshotId === r.id;
                const dotColor = r.estado === "ok" ? "#3ddc84" : "#fbbf24";
                return (
                  <div key={r.id} className="flex flex-col items-center" style={{ flex: 1 }}>
                    {/* Info top */}
                    <div className="text-center mb-3 w-full px-1">
                      <div className="text-xs font-medium mb-0.5" style={{ color: selected ? "#0f172a" : "#94a3b8" }}>
                        {r.fecha}
                      </div>
                      <div className="text-xs" style={{ color: selected ? "#3ddc84" : "#cbd5e1" }}>
                        {r.docs.toLocaleString("es")} docs
                      </div>
                    </div>

                    {/* Line + dot */}
                    <div className="flex items-center w-full relative">
                      {i > 0 && <div className="flex-1 h-px" style={{ background: "#e2e8f0" }} />}
                      <button
                        onClick={() => setSnapshotId(r.id)}
                        className="w-4 h-4 rounded-full shrink-0 transition-all z-10"
                        style={{
                          background: selected ? dotColor : "#e2e8f0",
                          border: selected ? `3px solid ${dotColor}` : "2px solid #cbd5e1",
                          boxShadow: selected ? `0 0 0 3px ${dotColor}22` : "none",
                        }}
                      />
                      {i < MOCK_SNAPSHOTS.length - 1 && <div className="flex-1 h-px" style={{ background: "#e2e8f0" }} />}
                    </div>

                    {/* Duration */}
                    <div className="text-center mt-3">
                      <div className="text-xs" style={{ color: "#cbd5e1" }}>{r.duracion}</div>
                      {selected && (
                        <div className="text-xs font-bold mt-0.5 px-2 py-0.5 rounded-full"
                          style={{ background: "#dcfce7", color: "#166534" }}>
                          Seleccionada
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel 3: Documentos extraídos */}
        <div className="rounded-xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold" style={{ color: "#0f172a", letterSpacing: "0.06em" }}>
                  DOCUMENTOS EXTRAÍDOS DE LA FOTO ({snapshotId})
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                  {docsFiltrados.length} documentos encontrados en esta foto
                </div>
              </div>

              {/* Search bar */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", minWidth: "300px" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4" stroke="#94a3b8" strokeWidth="1.3"/>
                  <line x1="9.2" y1="9.2" x2="12.5" y2="12.5" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <input
                  value={querySearch}
                  onChange={(e) => setQuerySearch(e.target.value)}
                  placeholder="Filtrar documentos por palabra..."
                  className="flex-1 bg-transparent text-xs focus:outline-none"
                  style={{ color: "#475569" }}
                />
                {querySearch && (
                  <button onClick={() => setQuerySearch("")} className="text-xs" style={{ color: "#94a3b8" }}>✕</button>
                )}
              </div>
            </div>
          </div>

          {/* Grid de cards */}
          <div className="p-6 grid grid-cols-3 gap-4">
            {docsFiltrados.map((doc) => (
              <div
                key={doc.id}
                className="rounded-lg p-4 transition-all"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3ddc84"; e.currentTarget.style.background = "#f0fdf4"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
              >
                <div className="text-sm font-semibold mb-1.5 leading-snug" style={{ color: "#0f172a" }}>
                  {doc.titulo}
                </div>
                <div className="text-xs mb-3 truncate font-mono" style={{ color: "#3ddc84" }}>
                  {doc.url}
                </div>
                <div className="text-xs leading-relaxed line-clamp-3" style={{ color: "#64748b" }}>
                  {doc.desc}
                </div>
              </div>
            ))}

            {docsFiltrados.length === 0 && (
              <div className="col-span-3 py-12 text-center">
                <div className="text-xs" style={{ color: "#94a3b8" }}>
                  Sin documentos que coincidan con "{querySearch}"
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
