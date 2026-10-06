"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { IconCopy, IconCheck, IconPlayground } from "@/components/icons";
import PageHeader from "@/components/PageHeader";
import PageContainer from "@/components/PageContainer";
import SearchResultCard from "@/components/SearchResultCard";
import CodeBlock from "@/components/CodeBlock";
import EmptyState from "@/components/EmptyState";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PRESET_QUERIES = ["catalogo", "productos", "soporte", "hardware", "contacto", "garantia"];

export default function PlaygroundPage() {
  const { account, documents, sites } = useApp();

  const [query, setQuery] = useState("productos");
  const [selectedSiteId, setSelectedSiteId] = useState("all");
  const [useCustomKey, setUseCustomKey] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(account.apiKey);
  const [activeTab, setActiveTab] = useState<"cards" | "json" | "headers" | "mongo">("cards");
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeLang, setActiveLang] = useState<"curl" | "fetch" | "python">("curl");

  // Read initial query parameters on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const qParam = sp.get("q");
      const siteIdParam = sp.get("siteId");
      if (qParam) setQuery(qParam);
      if (siteIdParam) setSelectedSiteId(siteIdParam);
    }
  }, []);

  // Update browser URL on explicit user interactions without re-render cascades
  const updateUrl = (newQuery: string, newSiteId: string) => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams();
      if (newQuery.trim()) params.set("q", newQuery.trim());
      if (newSiteId !== "all") params.set("siteId", newSiteId);
      const qs = params.toString() ? `?${params.toString()}` : "";
      window.history.replaceState(null, "", `${window.location.pathname}${qs}`);
    }
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    updateUrl(val, selectedSiteId);
  };

  const handleSiteChange = (val: string) => {
    setSelectedSiteId(val);
    updateUrl(query, val);
  };

  // Effective authorization key
  const currentKey = useCustomKey ? customApiKey : account.apiKey;
  const isAuthorized = Boolean(currentKey && currentKey.trim() === account.apiKey);

  // Endpoint path with query and optional siteId
  const endpointQueryString = useMemo(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedSiteId !== "all") params.set("siteId", selectedSiteId);
    return params.toString() ? `?${params.toString()}` : "";
  }, [query, selectedSiteId]);

  // Full URL display
  const fullEndpointUrl = `http://localhost:3000/search${endpointQueryString}`;

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

  // HTTP Request format
  const rawHttpRequestString = useMemo(() => {
    return `GET /search${endpointQueryString} HTTP/1.1\nHost: localhost:3000\nAuthorization: ${currentKey}\nAccept: application/json\nUser-Agent: SearchServiceClient/1.0`;
  }, [endpointQueryString, currentKey]);

  // MongoDB $text query representation according to Search Service spec
  const mongoQueryString = useMemo(() => {
    const filter: Record<string, unknown> = {
      accountId: account._id,
    };
    if (selectedSiteId !== "all") {
      filter.siteId = selectedSiteId;
    }
    filter.$text = { $search: query.trim() || "..." };

    return `// Consulta ejecutada en MongoDB con índice de texto ($text)
// Especificación Search Service Spec (PDF)
//
// Índice requerido en MongoDB:
// db.documents.createIndex({ name: "text", description: "text", content: "text" });

db.documents.find(${JSON.stringify(filter, null, 2)});`;
  }, [account._id, selectedSiteId, query]);

  // Integration snippets
  const clientSnippet = useMemo(() => {
    if (activeLang === "curl") {
      return `curl -H "Authorization: ${currentKey}" \\\n  "${fullEndpointUrl}"`;
    }
    if (activeLang === "fetch") {
      return `const response = await fetch("${fullEndpointUrl}", {\n  headers: {\n    "Authorization": "${currentKey}",\n    "Accept": "application/json"\n  }\n});\nconst documents = await response.json();\nconsole.log(documents);`;
    }
    const paramsObj = Object.fromEntries(new URLSearchParams(endpointQueryString.replace(/^\?/, "")));
    return `import requests\n\nurl = "http://localhost:3000/search"\nparams = ${JSON.stringify(paramsObj, null, 2)}\nheaders = {"Authorization": "${currentKey}"}\n\nresponse = requests.get(url, params=params, headers=headers)\ndocuments = response.json()\nprint(documents)`;
  }, [activeLang, currentKey, fullEndpointUrl, endpointQueryString]);

  const handleCopyCurl = async () => {
    const curl = `curl -X GET "${fullEndpointUrl}" \\\n  -H "Authorization: ${currentKey}" \\\n  -H "Accept: application/json"`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(curl);
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
  };

  return (
    <PageContainer maxWidth="6xl">
      {/* Page Header Component */}
      <PageHeader
        breadcrumb="SEARCHSVC / API PLAYGROUND"
        title={
          <div className="flex items-center gap-3 flex-wrap">
            <span>Simulador del Endpoint de Búsqueda</span>
            <Badge variant="outline" className="font-mono bg-emerald-100 text-emerald-800 border-emerald-200">
              GET /search?q=...
            </Badge>
          </div>
        }
        subtitle={
          <p className="text-xs text-slate-500 max-w-2xl">
            Comprobá cómo las aplicaciones externas consumen el servicio de indexación con tu API Key y cómo MongoDB resuelve las consultas mediante índices <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">$text</code>.
          </p>
        }
      />

      {/* Panel 1: Barra de Petición HTTP */}
      <Card className="mb-6 bg-[#0e1525] border-[#1e3a5f] text-slate-100 overflow-hidden">
        <CardHeader className="flex-row items-center justify-between border-b border-slate-800 p-6 pb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">
              <IconPlayground />
            </span>
            <CardTitle className="text-xs font-bold text-slate-200 tracking-wider uppercase">
              REQUEST INSPECTOR
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">URL del Endpoint:</span>
            <span className="font-mono text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {fullEndpointUrl}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {/* Selector de Ámbito de Búsqueda */}
          <div className="flex items-center justify-between gap-4 flex-wrap text-xs bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="text-slate-300 font-medium">Ámbito de búsqueda:</span>
              <select
                value={selectedSiteId}
                onChange={(e) => handleSiteChange(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-emerald-400 text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-mono cursor-pointer"
              >
                <option value="all">Global (todos los sitios de la cuenta - Spec PDF)</option>
                {sites.map((s) => (
                  <option key={s._id} value={s._id}>
                    Filtrar por sitio: {s.name} ({s._id})
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {selectedSiteId === "all" ? (
                <span className="text-emerald-400/90">Búsqueda global con API Key (sin parámetro &siteId)</span>
              ) : (
                <span>Filtro activo en URL: <code className="text-emerald-400 font-bold">&amp;siteId={selectedSiteId}</code></span>
              )}
            </div>
          </div>

          {/* Barra de URL Unificada y Continua (GET) */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 flex-1 min-w-0 font-mono text-xs overflow-x-auto py-1">
              <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 font-bold shrink-0 border-emerald-500/30">
                GET
              </Badge>
              <span className="text-slate-500 shrink-0">http://localhost:3000/search?q=</span>
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="palabras-clave"
                className="bg-slate-900 text-emerald-300 font-mono font-bold focus:outline-none px-2 py-0.5 rounded border border-slate-700 focus:border-emerald-500 shrink-0"
                style={{ width: `${Math.max(query.length + 2, 12)}ch` }}
              />
              {selectedSiteId !== "all" ? (
                <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700 shrink-0">
                  &amp;siteId={selectedSiteId}
                </span>
              ) : (
                <span className="text-slate-600 text-[11px] italic ml-1 shrink-0">
                  &amp;siteId=&lt;global&gt;
                </span>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyCurl}
              title="Copiar comando cURL equivalente"
              className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 shrink-0"
            >
              {copiedCurl ? <IconCheck /> : <IconCopy />}
              <span>{copiedCurl ? "Copiado" : "Copiar cURL"}</span>
            </Button>
          </div>

          {/* Presets de búsqueda rápida */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-slate-500 text-[11px]">Sugerencias de búsqueda:</span>
            {PRESET_QUERIES.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleQueryChange(preset)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
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
                <Input
                  type="text"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="Probar otra API Key..."
                  className="max-w-sm bg-slate-900 border-slate-700 text-emerald-400 font-mono focus:bg-slate-900"
                />
              )}
              <Badge variant={isAuthorized ? "success" : "destructive"}>
                {isAuthorized ? "Válida" : "Inválida (401)"}
              </Badge>
            </div>

            <button
              type="button"
              onClick={() => {
                setUseCustomKey(!useCustomKey);
                if (useCustomKey) setCustomApiKey(account.apiKey);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 underline font-mono cursor-pointer"
            >
              {useCustomKey ? "Usar clave de mi cuenta" : "Simular otra clave (probar 401)"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Panel 2: Respuesta de la API */}
      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between p-4 px-6 border-b border-slate-100 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Badge variant={isAuthorized ? "success" : "destructive"} className="font-mono text-xs">
              {isAuthorized ? "HTTP 200 OK" : "HTTP 401 Unauthorized"}
            </Badge>
            <span className="text-xs text-slate-500">
              Latencia: <strong className="text-slate-800 font-mono">{isAuthorized ? "24 ms" : "3 ms"}</strong>
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">
              Documentos encontrados: <strong className="text-emerald-700 font-mono">{searchResults.length}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab("cards")}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                activeTab === "cards" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Tarjetas ({searchResults.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("json")}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                activeTab === "json" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              JSON Raw
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("headers")}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                activeTab === "headers" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Raw HTTP Request
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("mongo")}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                activeTab === "mongo" ? "bg-white text-emerald-800 font-bold shadow-xs border border-emerald-200" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              MongoDB Query ($text)
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {activeTab === "cards" && (
            <div>
              {!isAuthorized ? (
                <EmptyState
                  title="401 Unauthorized"
                  description="La API Key suministrada no coincide con ninguna cuenta activa. Asegurate de enviar la clave correcta en el header Authorization."
                />
              ) : searchResults.length === 0 ? (
                documents.length === 0 ? (
                  <EmptyState
                    title="Aún no hay documentos indexados"
                    description="Registrá un sitio en Mis Sitios y ejecutá un crawl para generar las primeras páginas indexadas."
                    action={
                      <Link href="/sites" className="text-xs text-emerald-600 font-bold hover:underline">
                        Ir a Mis Sitios →
                      </Link>
                    }
                  />
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No se encontraron documentos indexados que contengan &quot;<span className="text-slate-700 font-medium">{query}</span>&quot;
                    {selectedSiteId !== "all" && ` en el sitio seleccionado (${selectedSiteId})`}.
                    <div className="mt-2 text-slate-500">
                      Probá buscando términos como <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">catalogo</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">productos</code> o <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">soporte</code>.
                    </div>
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((doc) => {
                    const site = sites.find((s) => s._id === doc.siteId);
                    return (
                      <SearchResultCard
                        key={doc.id}
                        id={doc.id}
                        name={doc.name}
                        url={doc.url}
                        description={doc.description}
                        snapshotId={doc.snapshotId}
                        siteId={doc.siteId}
                        siteName={site?.name || "Desconocido"}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "json" && (
            <CodeBlock
              title="Content-Type: application/json; charset=utf-8"
              content={jsonString}
            />
          )}

          {activeTab === "headers" && (
            <CodeBlock
              title="Petición HTTP en formato estándar (Search Service Spec)"
              content={rawHttpRequestString}
            />
          )}

          {activeTab === "mongo" && (
            <div>
              <CodeBlock
                title="Sintaxis de consulta MongoDB con índice de texto ($text)"
                content={mongoQueryString}
              />
              <div className="mt-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800">Nota del enunciado (Search Service Spec):</span> En MongoDB, el operador <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold">$text</code> permite búsquedas de texto indexadas con tokenización y stemming sobre los campos indexados (<code>name</code>, <code>description</code>, <code>content</code>), filtrando además por la cuenta del usuario (<code>accountId</code>) y opcionalmente por el sitio (<code>siteId</code>).
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panel 3: Guía de integración en clientes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">
              Integración en otras aplicaciones (Search Service Spec)
            </CardTitle>
            <CardDescription className="mt-0.5">
              Copiá el snippet correspondiente al lenguaje o herramienta con la que consumirás este microservicio:
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(["curl", "fetch", "python"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1 text-xs font-semibold rounded uppercase font-mono transition-colors cursor-pointer ${
                  activeLang === lang ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <CodeBlock content={clientSnippet} />
      </Card>
    </PageContainer>
  );
}
