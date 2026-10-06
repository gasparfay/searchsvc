"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function EditSiteScreen({ siteId }: { siteId: string }) {
  const router = useRouter();
  const { sites, updateSite } = useApp();

  const site = sites.find((s) => s._id === siteId);

  const [form, setForm] = useState({
    name: "",
    url: "",
    maxDepth: 2,
    frequency: "Cada 24 horas",
  });
  const [extractorSnippet, setExtractorSnippet] = useState("");
  const [pageResolverSnippet, setPageResolverSnippet] = useState("");

  useEffect(() => {
    if (site) {
      setForm({
        name: site.name,
        url: site.url,
        maxDepth: site.maxDepth,
        frequency: site.frequency,
      });
      setExtractorSnippet(site.extractorSnippet || "");
      setPageResolverSnippet(site.pageResolverSnippet || "");
    }
  }, [site]);

  if (!site) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center" style={{ background: "#f0f2f6" }}>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Sitio no encontrado</h2>
        <p className="text-xs text-slate-500 mb-4">No se encontró ningún sitio con el identificador {siteId}.</p>
        <Link href="/sites" className="text-xs text-emerald-600 font-bold hover:underline">
          ← Volver a Mis Sitios
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateSite(siteId, {
      name: form.name.trim(),
      url: form.url.trim(),
      maxDepth: form.maxDepth,
      frequency: form.frequency,
      extractorSnippet,
      pageResolverSnippet: pageResolverSnippet.trim() ? pageResolverSnippet : undefined,
    });
    router.push(`/sites/${siteId}`);
  }

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#f0f2f6" }}>
      <div className="px-10 py-8 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs mb-1.5" style={{ color: "#94a3b8", letterSpacing: "0.08em" }}>
              MIS SITIOS / EDITAR CONFIGURACIÓN
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
              Editar {site.name}
            </h1>
            <div className="text-xs text-slate-400 font-mono mt-0.5">ID: {site._id}</div>
          </div>
          <Link
            href={`/sites/${siteId}`}
            className="text-xs transition-colors"
            style={{ color: "#94a3b8" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
          >
            ← Cancelar
          </Link>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="rounded-xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>

          {/* Sección 1: Parámetros del sitio */}
          <div className="p-8" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold mb-1" style={{ color: "#0f172a", letterSpacing: "0.06em" }}>
              PARÁMETROS DEL SITIO
            </div>
            <div className="text-xs mb-6" style={{ color: "#94a3b8" }}>
              Modificá la URL base y las directivas de exploración del crawler.
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "#475569" }}>
                  NOMBRE DEL SITIO *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                  onFocus={(e) => (e.target.style.borderColor = "#3ddc84")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "#475569" }}>
                  URL BASE DEL SITIO (HOME) *
                </label>
                <input
                  type="url"
                  required
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors font-mono"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                  onFocus={(e) => (e.target.style.borderColor = "#3ddc84")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "#475569" }}>
                  NIVELES DE HOJAS (MAXDEPTH) *
                </label>
                <select
                  value={form.maxDepth}
                  onChange={(e) => setForm({ ...form, maxDepth: Number(e.target.value) })}
                  className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                >
                  <option value={1}>1 nivel — Solo Home</option>
                  <option value={2}>2 niveles — Home + enlaces directos</option>
                  <option value={3}>3 niveles — Home + enlaces + subpáginas</option>
                  <option value={4}>4 niveles — Exploración profunda</option>
                </select>
                <div className="text-xs mt-1.5" style={{ color: "#94a3b8" }}>
                  Límite de tags &lt;a/&gt; anidados a seguir por el job del crawler.
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "#475569" }}>
                  FRECUENCIA DE VISITA *
                </label>
                <select
                  value={form.frequency}
                  onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                >
                  <option value="Cada 1 hora">Cada 1 hora</option>
                  <option value="Cada 6 horas">Cada 6 horas</option>
                  <option value="Cada 12 horas">Cada 12 horas</option>
                  <option value="Cada 24 horas">Cada 24 horas (diaria)</option>
                  <option value="Cada 48 horas">Cada 48 horas</option>
                  <option value="Semanal">Semanal</option>
                </select>
                <div className="text-xs mt-1.5" style={{ color: "#94a3b8" }}>
                  Intervalo en el que el scheduler ejecutará el job de extracción.
                </div>
              </div>
            </div>
          </div>

          {/* Sección 2: Snippets de JavaScript */}
          <div className="p-8" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold mb-1" style={{ color: "#0f172a", letterSpacing: "0.06em" }}>
              SNIPPETS JAVASCRIPT (CHEERIO)
            </div>
            <div className="text-xs mb-6" style={{ color: "#94a3b8" }}>
              Modificá los scripts ejecutados en el sandbox para parsear y resolver enlaces.
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Document Extractor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium" style={{ color: "#475569" }}>
                    DOCUMENT EXTRACTOR *
                  </label>
                  <span className="text-xs font-medium text-emerald-500">Requerido</span>
                </div>
                <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1e2d42" }}>
                  <div className="flex items-center gap-2 px-4 py-2" style={{ background: "#162032" }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f87171" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#fbbf24" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3ddc84" }} />
                    <span className="text-xs ml-2 font-mono" style={{ color: "#3a5570" }}>extractor.js</span>
                  </div>
                  <textarea
                    value={extractorSnippet}
                    onChange={(e) => setExtractorSnippet(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-4 text-xs focus:outline-none resize-none leading-relaxed font-mono"
                    style={{ background: "#0e1525", color: "#a0bcd8" }}
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Page Resolver */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium" style={{ color: "#475569" }}>
                    PAGE RESOLVER
                  </label>
                  <span className="text-xs text-slate-400">Opcional</span>
                </div>
                <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1e2d42" }}>
                  <div className="flex items-center gap-2 px-4 py-2" style={{ background: "#162032" }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f87171" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#fbbf24" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3ddc84" }} />
                    <span className="text-xs ml-2 font-mono" style={{ color: "#3a5570" }}>resolver.js</span>
                  </div>
                  <textarea
                    value={pageResolverSnippet}
                    onChange={(e) => setPageResolverSnippet(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-4 text-xs focus:outline-none resize-none leading-relaxed font-mono"
                    style={{ background: "#0e1525", color: "#a0bcd8" }}
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-between px-8 py-5 bg-slate-50 rounded-b-xl">
            <Link
              href={`/sites/${siteId}`}
              className="text-sm transition-colors text-slate-500 hover:text-slate-800"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-bold rounded-lg transition-all"
              style={{ background: "#3ddc84", color: "#0a1f14", letterSpacing: "0.04em" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2bc971")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#3ddc84")}
            >
              Guardar Cambios →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
