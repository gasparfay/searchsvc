"use client";

import { useState } from "react";

const SITIOS: Record<string, { nombre: string; url: string }> = {
  "s-001": { nombre: "Tienda Ejemplo",    url: "example.com" },
  "s-002": { nombre: "Blog Corporativo",  url: "techblog.acme.io" },
  "s-005": { nombre: "Wiki Interna",      url: "wiki.internal.acme.corp" },
  "s-003": { nombre: "Documentación Dev", url: "docs.product.dev" },
  "s-004": { nombre: "Repositorio Legal", url: "legal.acme.corp" },
  "s-006": { nombre: "Portal de Soporte", url: "support.acme.corp" },
};

const CORRIDAS = [
  { id: "run-019", fecha: "04 sep · 09:12", docs: 1842, estado: "ok",      duracion: "21m 08s" },
  { id: "run-018", fecha: "04 sep · 03:12", docs: 1839, estado: "ok",      duracion: "20m 44s" },
  { id: "run-017", fecha: "03 sep · 21:12", docs: 1835, estado: "ok",      duracion: "22m 01s" },
  { id: "run-016", fecha: "03 sep · 15:12", docs: 1301, estado: "parcial", duracion: "14m 32s" },
  { id: "run-015", fecha: "03 sep · 09:12", docs: 1828, estado: "ok",      duracion: "19m 55s" },
];

const DOCUMENTOS = [
  { id: "doc-001", titulo: "Página de Contacto",       url: "example.com/contacto",      desc: "Información de contacto, formularios de soporte y canales de atención al cliente disponibles." },
  { id: "doc-002", titulo: "Catálogo de Productos",    url: "example.com/productos",     desc: "Listado completo de productos disponibles con precios, descripciones y disponibilidad de stock." },
  { id: "doc-003", titulo: "Quiénes Somos",            url: "example.com/nosotros",      desc: "Historia de la empresa, misión, visión y el equipo detrás de la tienda. Fundada en 2014." },
  { id: "doc-004", titulo: "Preguntas Frecuentes",     url: "example.com/faq",           desc: "Respuestas a las consultas más comunes sobre envíos, devoluciones, garantías y métodos de pago." },
  { id: "doc-005", titulo: "Política de Devoluciones", url: "example.com/devoluciones",  desc: "Procedimiento detallado para solicitar devoluciones y reembolsos. Plazo máximo de 30 días." },
  { id: "doc-006", titulo: "Blog: Novedades",          url: "example.com/blog",          desc: "Últimas noticias, lanzamientos de productos y artículos de interés para nuestros clientes." },
];

const API_KEY = "123e4567-e89b-12d3-a456-426614174000";

export default function SiteDetailScreen({ siteId, onBack }: { siteId: string; onBack: () => void }) {
  const sitio = SITIOS[siteId] ?? SITIOS["s-001"];
  const [corrida, setCorrida] = useState("run-019");
  const [copiado, setCopiado] = useState(false);
  const [querySearch, setQuerySearch] = useState("");

  function copiar() {
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const docsFiltrados = DOCUMENTOS.filter((d) =>
    !querySearch || d.titulo.toLowerCase().includes(querySearch.toLowerCase()) || d.desc.toLowerCase().includes(querySearch.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#f0f2f6" }}>
      <div className="px-10 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={onBack}
              className="text-xs mb-2 flex items-center gap-1 transition-colors"
              style={{ color: "#94a3b8" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              ← Volver a Mis Sitios
            </button>
            <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>{sitio.nombre}</h1>
            <div className="text-xs mt-1" style={{ color: "#94a3b8" }}>{sitio.url}</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
            style={{ background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#3ddc84" }} />
            Activo · corrida automática cada 6h
          </div>
        </div>

        {/* Panel 1: API Key */}
        <div className="rounded-xl p-6 mb-5 flex items-center justify-between gap-6"
          style={{ background: "#0e1525", border: "1px solid #1e3a5f" }}>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold mb-2" style={{ color: "#3ddc84", letterSpacing: "0.08em" }}>
              🔑 API KEY PARA ESTE SITIO
            </div>
            <div className="text-sm" style={{ color: "#94a3b8", marginBottom: "6px" }}>
              Incluí esta clave en el header <span style={{ color: "#3ddc84" }}>Authorization</span> para realizar búsquedas.
            </div>
            <div className="text-sm font-bold tracking-wider" style={{ color: "#e2e8f4" }}>{API_KEY}</div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={copiar}
              className="px-5 py-2.5 text-xs font-bold rounded-lg transition-all"
              style={{ background: copiado ? "#2bc971" : "#3ddc84", color: "#0a1f14", minWidth: "100px" }}
            >
              {copiado ? "✓ Copiado" : "Copiar"}
            </button>
            <div className="text-xs text-center" style={{ color: "#3a5570" }}>
              GET /search?q=...
            </div>
          </div>
        </div>

        {/* Panel 2: Historial de corridas */}
        <div className="rounded-xl mb-5" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold" style={{ color: "#0f172a", letterSpacing: "0.06em" }}>
              HISTORIAL DE CORRIDAS
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
              Seleccioná una corrida para explorar los documentos extraídos.
            </div>
          </div>

          {/* Timeline horizontal */}
          <div className="px-6 py-5">
            <div className="flex items-start gap-0">
              {CORRIDAS.map((r, i) => {
                const selected = corrida === r.id;
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
                        onClick={() => setCorrida(r.id)}
                        className="w-4 h-4 rounded-full shrink-0 transition-all z-10"
                        style={{
                          background: selected ? dotColor : "#e2e8f0",
                          border: selected ? `3px solid ${dotColor}` : "2px solid #cbd5e1",
                          boxShadow: selected ? `0 0 0 3px ${dotColor}22` : "none",
                        }}
                      />
                      {i < CORRIDAS.length - 1 && <div className="flex-1 h-px" style={{ background: "#e2e8f0" }} />}
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
                  DOCUMENTOS EXTRAÍDOS
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                  Corrida {corrida} · {DOCUMENTOS.length} documentos
                </div>
              </div>

              {/* Search bar */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", minWidth: "280px" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4" stroke="#94a3b8" strokeWidth="1.3"/>
                  <line x1="9.2" y1="9.2" x2="12.5" y2="12.5" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <input
                  value={querySearch}
                  onChange={(e) => setQuerySearch(e.target.value)}
                  placeholder="Probar búsqueda por keyphrase..."
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
                className="rounded-lg p-4 transition-all cursor-pointer"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3ddc84"; e.currentTarget.style.background = "#f0fdf4"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
              >
                <div className="text-sm font-semibold mb-1.5 leading-snug" style={{ color: "#0f172a" }}>
                  {doc.titulo}
                </div>
                <div className="text-xs mb-3 truncate" style={{ color: "#3ddc84" }}>
                  {doc.url}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: "#64748b" }}>
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
