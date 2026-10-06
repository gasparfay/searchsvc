"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

const IconSend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconCopy = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconTerminal = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <polyline points="4 17 10 11 4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="19" x2="20" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const PRESET_QUERIES = ["catalogo", "productos", "soporte", "hardware", "contacto", "garantia"];

export default function PlaygroundScreen() {
  const { account, documents, sites } = useApp();

  const [query, setQuery] = useState("productos");
  const [selectedSiteId, setSelectedSiteId] = useState<string>("all");
  const [useCustomKey, setUseCustomKey] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(account.apiKey);
  const [activeTab, setActiveTab] = useState<"cards" | "json" | "headers">("cards");
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeLang, setActiveLang] = useState<"curl" | "fetch" | "python">("curl");

  // Effective key being sent
  const currentKey = useCustomKey ? customApiKey : account.apiKey;
  const isAuthorized = Boolean(currentKey && currentKey.trim() === account.apiKey);

  // Endpoint path with query and optional siteId
  const endpointQueryString = useMemo(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedSiteId !== "all") params.set("siteId", selectedSiteId);
    return params.toString() ? `?${params.toString()}` : "";
  }, [query, selectedSiteId]);

  // Simulated search results across indexed documents
  const searchResults = useMemo(() => {
    if (!isAuthorized) return [];
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();
    return documents.filter((doc) => {
      if (selectedSiteId !== "all" && doc.siteId !== selectedSiteId) {
        return false;
      }
      const matchName = doc.name.toLowerCase().includes(q);
      const matchDesc = doc.description.toLowerCase().includes(q);
      const matchContent = doc.content.toLowerCase().includes(q);
      const matchUrl = doc.url.toLowerCase().includes(q);
      return matchName || matchDesc || matchContent || matchUrl;
    });
  }, [documents, query, selectedSiteId, isAuthorized]);

  // Formatted response payload
  const formattedResults = useMemo(() => {
    return searchResults.map((d) => {
      const site = sites.find((s) => s._id === d.siteId);
      return {
        id: d.id,
        name: d.name,
        url: d.url,
        description: d.description,
        crawledAt: d.crawledAt,
        snapshotId: d.snapshotId,
        siteName: site?.name || "Sitio Desconocido",
      };
    });
  }, [searchResults, sites]);

  const jsonString = useMemo(() => {
    if (!isAuthorized) {
      return JSON.stringify(
        {
          statusCode: 401,
          message: "Unauthorized: Invalid API Key in Authorization header",
          error: "Unauthorized",
        },
        null,
        2
      );
    }
    return JSON.stringify(formattedResults, null, 2);
  }, [isAuthorized, formattedResults]);

  const copyToClipboard = async (text: string) => {
    let success = false;
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch {
        // continue
      }
    }
    if (!success && typeof document !== "undefined") {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.top = "0";
        textarea.style.left = "0";
        textarea.style.width = "2em";
        textarea.style.height = "2em";
        textarea.style.padding = "0";
        textarea.style.border = "none";
        textarea.style.outline = "none";
        textarea.style.boxShadow = "none";
        textarea.style.background = "transparent";
        textarea.style.opacity = "0.01";
        textarea.style.zIndex = "99999";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, text.length);
        success = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        // continue
      }
    }
    return success;
  };

  async function handleCopyJson() {
    await copyToClipboard(jsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  }

  async function handleCopyCurl() {
    const curl = `curl -X GET "http://localhost:3000/search${endpointQueryString}" \\\n  -H "Authorization: ${currentKey}" \\\n  -H "Accept: application/json"`;
    await copyToClipboard(curl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  }

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#f0f2f6" }}>
      <div className="px-10 py-8 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="text-xs mb-1.5" style={{ color: "#94a3b8", letterSpacing: "0.08em" }}>
            SEARCHSVC / API PLAYGROUND
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
              Simulador del Endpoint de Búsqueda
            </h1>
            <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
              GET /search?q=...
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Comprobá de forma interactiva cómo las aplicaciones externas consumen el servicio de indexación utilizando la API Key global de tu cuenta.
          </p>
        </div>

        {/* Panel 1: Barra de Petición HTTP */}
        <div className="rounded-xl overflow-hidden shadow-xs mb-6" style={{ background: "#0e1525", border: "1px solid #1e3a5f" }}>
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">
                <IconTerminal />
              </span>
              <span className="text-xs font-bold text-slate-200 tracking-wider">
                REQUEST INSPECTOR
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">Endpoint:</span>
              <span className="font-mono text-emerald-400">http://localhost:3000/search</span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Selector de Ámbito de Búsqueda (Todos los sitios vs un sitio específico) */}
            <div className="flex items-center justify-between gap-4 flex-wrap text-xs bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-slate-300 font-medium">Ámbito de búsqueda:</span>
                <select
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-emerald-400 text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-mono cursor-pointer"
                >
                  <option value="all">Todos los sitios de la cuenta (Global - Spec PDF)</option>
                  {sites.map((s) => (
                    <option key={s._id} value={s._id}>
                      Filtrar solo: {s.name} ({s._id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {selectedSiteId === "all" ? (
                  <span className="text-emerald-400/90">Buscando en todos los sitios de tu cuenta con tu API Key</span>
                ) : (
                  <span>Filtro activo: <code className="text-emerald-400">&amp;siteId={selectedSiteId}</code></span>
                )}
              </div>
            </div>

            {/* Input de URL con método GET */}
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono shrink-0">
                GET
              </span>
              <span className="text-xs text-slate-500 font-mono shrink-0">
                /search{endpointQueryString.split("=")[0] ? endpointQueryString.split("=")[0] + "=" : "?q="}
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ingresá palabras clave o keyphrase..."
                className="flex-1 bg-transparent text-sm text-slate-100 font-mono focus:outline-none placeholder-slate-600"
              />
              <button
                type="button"
                onClick={handleCopyCurl}
                title="Copiar comando cURL equivalente"
                className="px-3 py-1.5 text-xs rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copiedCurl ? <IconCheck /> : <IconCopy />}
                <span>{copiedCurl ? "Copiado" : "Copiar cURL"}</span>
              </button>
            </div>

            {/* Presets de búsqueda rápida */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-slate-500 text-[11px]">Sugerencias de búsqueda:</span>
              {PRESET_QUERIES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setQuery(preset)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    query === preset
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Authorization Header info */}
            <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-4 flex-wrap text-xs">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-slate-500">Header Authorization:</span>
                {!useCustomKey ? (
                  <span className="font-mono text-emerald-400 truncate">
                    {account.apiKey}
                  </span>
                ) : (
                  <input
                    type="text"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="Probar otra API Key..."
                    className="flex-1 max-w-sm px-2.5 py-1 text-xs rounded bg-slate-900 border border-slate-700 text-emerald-400 font-mono focus:outline-none"
                  />
                )}
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                  isAuthorized ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-red-950 text-red-400 border border-red-800"
                }`}>
                  {isAuthorized ? "Válida" : "Inválida (401)"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUseCustomKey(!useCustomKey);
                  if (useCustomKey) setCustomApiKey(account.apiKey);
                }}
                className="text-xs text-slate-400 hover:text-slate-200 underline font-mono"
              >
                {useCustomKey ? "Usar clave de mi cuenta" : "Simular otra clave (probar 401)"}
              </button>
            </div>
          </div>
        </div>

        {/* Panel 2: Respuesta de la API */}
        <div className="rounded-xl overflow-hidden shadow-xs bg-white border border-slate-200 mb-6">
          {/* Status bar */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                isAuthorized ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
              }`}>
                {isAuthorized ? "HTTP 200 OK" : "HTTP 401 Unauthorized"}
              </span>
              <span className="text-xs text-slate-500">
                Latencia: <strong className="text-slate-800 font-mono">{isAuthorized ? "24 ms" : "3 ms"}</strong>
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">
                Documentos encontrados: <strong className="text-emerald-700 font-mono">{searchResults.length}</strong>
              </span>
            </div>

            {/* Selector de pestañas */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab("cards")}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  activeTab === "cards" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Tarjetas ({searchResults.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("json")}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  activeTab === "json" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                JSON Raw
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("headers")}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  activeTab === "headers" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Raw HTTP Request
              </button>
            </div>
          </div>

          {/* Cuerpo de la Respuesta */}
          <div className="p-6">
            {activeTab === "cards" && (
              <div>
                {!isAuthorized ? (
                  <div className="py-12 text-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                      !
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">401 Unauthorized</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      La API Key suministrada no coincide con ninguna cuenta activa. Asegurate de enviar la clave correcta en el header <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Authorization</code>.
                    </p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No se encontraron documentos indexados que contengan &quot;<span className="text-slate-700 font-medium">{query}</span>&quot;.
                    <div className="mt-2 text-slate-500">
                      Probá buscando términos como <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">catalogo</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">productos</code> o <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">soporte</code>.
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {searchResults.map((doc) => {
                      const site = sites.find((s) => s._id === doc.siteId);
                      return (
                        <div
                          key={doc.id}
                          className="p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-50/80 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                              {doc.name}
                            </h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                              {doc.snapshotId}
                            </span>
                          </div>

                          <div className="text-xs font-mono text-emerald-600 truncate mb-2">
                            {doc.url}
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                            {doc.description || "Sin descripción."}
                          </p>

                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                            <span>Sitio: <strong className="text-slate-700">{site?.name || "Desconocido"}</strong></span>
                            <Link
                              href={`/sites/${doc.siteId}/docs/${doc.id}`}
                              className="text-emerald-700 font-semibold hover:underline"
                            >
                              Ver documento →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "json" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400">
                    Content-Type: application/json; charset=utf-8
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="px-3 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 font-mono"
                  >
                    {copiedJson ? <IconCheck /> : <IconCopy />}
                    <span>{copiedJson ? "Copiado" : "Copiar JSON"}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-lg bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed border border-slate-900 select-all">
                  {jsonString}
                </pre>
              </div>
            )}

            {activeTab === "headers" && (
              <div>
                <span className="text-xs font-mono text-slate-400 block mb-2">
                  Petición HTTP en formato estándar:
                </span>
                <pre className="p-4 rounded-lg bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-900">
{`GET /search${endpointQueryString} HTTP/1.1
Host: localhost:3000
Authorization: ${currentKey}
Accept: application/json
User-Agent: SearchServiceClient/1.0`}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Panel 3: Guía de integración en clientes */}
        <div className="rounded-xl overflow-hidden shadow-xs bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Integración en otras aplicaciones (Search Service Spec)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Copiá el snippet correspondiente al lenguaje o herramienta con la que consumirás este microservicio:
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {(["curl", "fetch", "python"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1 text-xs font-semibold rounded uppercase font-mono transition-colors ${
                    activeLang === lang ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <pre className="p-4 rounded-lg bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-900">
            {activeLang === "curl" && `curl -H "Authorization: ${currentKey}" \\
  "http://localhost:3000/search${endpointQueryString}"`}
            {activeLang === "fetch" && `const response = await fetch("http://localhost:3000/search${endpointQueryString}", {
  headers: {
    "Authorization": "${currentKey}",
    "Accept": "application/json"
  }
});
const documents = await response.json();
console.log(documents);`}
            {activeLang === "python" && `import requests

url = "http://localhost:3000/search"
params = ${JSON.stringify(Object.fromEntries(new URLSearchParams(endpointQueryString.replace(/^\?/, ""))))}
headers = {"Authorization": "${currentKey}"}

response = requests.get(url, params=params, headers=headers)
documents = response.json()
print(documents)`}
          </pre>
        </div>

      </div>
    </div>
  );
}
