"use client";

import { useState } from "react";
import type { Screen } from "@/types";

const CODE_EXTRACTOR = `function extract(request, response) {
  const $ = response.body;

  return [{
    name: $('title').text(),
    url: request.url,
    description:
      $('meta[property="og:description"]')
        .attr('content') ||
      $('meta[name="description"]')
        .attr('content') ||
      $('p').first().text().slice(0, 200)
  }];
}`;

const CODE_RESOLVER = `function pageResolver(request, response) {
  const $ = response.body;
  const links = [];

  $('a[href]').each(function () {
    const href = $(this).attr('href');
    if (href && href.startsWith('/')) {
      links.push(request.baseUrl + href);
    }
  });

  return links;
}`;

export default function NewSiteScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [form, setForm] = useState({
    nombre: "",
    url: "",
    profundidad: "2",
    frecuencia: "Cada 24 horas",
  });

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#f0f2f6" }}>
      <div className="px-10 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs mb-1.5" style={{ color: "#94a3b8", letterSpacing: "0.08em" }}>
              MIS SITIOS / REGISTRAR NUEVO
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
              Registrar Nuevo Sitio
            </h1>
          </div>
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-xs transition-colors"
            style={{ color: "#94a3b8" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
          >
            ← Cancelar
          </button>
        </div>

        {/* Card formulario */}
        <div className="rounded-xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>

          {/* Sección 1: Datos básicos */}
          <div className="px-8 pt-8 pb-6" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold mb-5" style={{ color: "#3ddc84", letterSpacing: "0.1em" }}>
              01 / INFORMACIÓN BÁSICA
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "#475569", letterSpacing: "0.04em" }}>
                  NOMBRE DEL SITIO
                </label>
                <input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Tienda Ejemplo"
                  className="w-full px-4 py-3 text-sm focus:outline-none rounded-lg"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                  onFocus={(e) => (e.target.style.borderColor = "#3ddc84")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "#475569", letterSpacing: "0.04em" }}>
                  URL A CRAWLEAR
                </label>
                <input
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 text-sm focus:outline-none rounded-lg"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                  onFocus={(e) => (e.target.style.borderColor = "#3ddc84")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
            </div>
          </div>

          {/* Sección 2: Configuración crawl */}
          <div className="px-8 py-6" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold mb-5" style={{ color: "#3ddc84", letterSpacing: "0.1em" }}>
              02 / PARÁMETROS DE CRAWLING
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "#475569", letterSpacing: "0.04em" }}>
                  NIVELES DE PROFUNDIDAD
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={form.profundidad}
                    onChange={(e) => setForm({ ...form, profundidad: e.target.value })}
                    min="1" max="10"
                    className="w-24 px-4 py-3 text-sm focus:outline-none rounded-lg text-center"
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                    onFocus={(e) => (e.target.style.borderColor = "#3ddc84")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                  <span className="text-xs" style={{ color: "#94a3b8" }}>
                    Nivel {form.profundidad} = se visitarán páginas a {form.profundidad} clics de profundidad.
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "#475569", letterSpacing: "0.04em" }}>
                  FRECUENCIA DE CRAWL
                </label>
                <select
                  value={form.frecuencia}
                  onChange={(e) => setForm({ ...form, frecuencia: e.target.value })}
                  className="w-full px-4 py-3 text-sm focus:outline-none rounded-lg"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                >
                  {["Cada 1 hora", "Cada 6 horas", "Cada 12 horas", "Cada 24 horas", "Cada 48 horas", "Cada 7 días"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sección 3: Code editors */}
          <div className="px-8 py-6" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold mb-5" style={{ color: "#3ddc84", letterSpacing: "0.1em" }}>
              03 / EXTRACTORES DE DATOS
            </div>
            <div className="grid grid-cols-2 gap-5">

              {/* Document extractor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium" style={{ color: "#475569", letterSpacing: "0.04em" }}>
                    DOCUMENT EXTRACTOR <span style={{ color: "#3ddc84" }}>(JavaScript)</span>
                  </label>
                  <span className="text-xs" style={{ color: "#94a3b8" }}>Requerido</span>
                </div>
                <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1e2d42" }}>
                  {/* Editor top bar */}
                  <div className="flex items-center gap-2 px-4 py-2" style={{ background: "#162032" }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f87171" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#fbbf24" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3ddc84" }} />
                    <span className="text-xs ml-2" style={{ color: "#3a5570" }}>extractor.js</span>
                  </div>
                  <textarea
                    defaultValue={CODE_EXTRACTOR}
                    rows={12}
                    className="w-full px-4 py-4 text-xs focus:outline-none resize-none leading-relaxed"
                    style={{ background: "#0e1525", color: "#a0bcd8", fontFamily: "JetBrains Mono, monospace" }}
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Page resolver */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium" style={{ color: "#475569", letterSpacing: "0.04em" }}>
                    PAGE RESOLVER <span style={{ color: "#94a3b8" }}>(Opcional)</span>
                  </label>
                  <span className="text-xs" style={{ color: "#94a3b8" }}>Opcional</span>
                </div>
                <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1e2d42" }}>
                  <div className="flex items-center gap-2 px-4 py-2" style={{ background: "#162032" }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f87171" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#fbbf24" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3ddc84" }} />
                    <span className="text-xs ml-2" style={{ color: "#3a5570" }}>resolver.js</span>
                  </div>
                  <textarea
                    defaultValue={CODE_RESOLVER}
                    rows={12}
                    className="w-full px-4 py-4 text-xs focus:outline-none resize-none leading-relaxed"
                    style={{ background: "#0e1525", color: "#a0bcd8", fontFamily: "JetBrains Mono, monospace" }}
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-between px-8 py-5">
            <button
              onClick={() => onNavigate("dashboard")}
              className="text-sm transition-colors"
              style={{ color: "#94a3b8" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              Cancelar
            </button>
            <button
              onClick={() => onNavigate("dashboard")}
              className="px-6 py-3 text-sm font-bold rounded-lg transition-all"
              style={{ background: "#3ddc84", color: "#0a1f14", letterSpacing: "0.04em" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2bc971")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#3ddc84")}
            >
              Guardar Configuración →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
