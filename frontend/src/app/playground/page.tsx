"use client";

import { useState, useMemo, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import PageContainer from "@/components/PageContainer";
import RequestInspector from "@/components/RequestInspector";
import ApiResponseViewer from "@/components/ApiResponseViewer";
import ClientSnippetsCard from "@/components/ClientSnippetsCard";
import { Badge } from "@/components/ui/badge";

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

      {/* Panel 1: Inspector de Petición HTTP */}
      <RequestInspector
        sites={sites}
        selectedSiteId={selectedSiteId}
        onSiteChange={handleSiteChange}
        query={query}
        onQueryChange={handleQueryChange}
        presetQueries={PRESET_QUERIES}
        fullEndpointUrl={fullEndpointUrl}
        currentKey={currentKey}
        isAuthorized={isAuthorized}
        useCustomKey={useCustomKey}
        customApiKey={customApiKey}
        onCustomApiKeyChange={setCustomApiKey}
        onToggleCustomKey={() => {
          setUseCustomKey(!useCustomKey);
          if (useCustomKey) setCustomApiKey(account.apiKey);
        }}
        onCopyCurl={handleCopyCurl}
        copiedCurl={copiedCurl}
      />

      {/* Panel 2: Visor de Respuestas de la API */}
      <ApiResponseViewer
        isAuthorized={isAuthorized}
        searchResults={searchResults}
        documentsTotal={documents.length}
        query={query}
        selectedSiteId={selectedSiteId}
        sites={sites}
        jsonString={jsonString}
        rawHttpRequestString={rawHttpRequestString}
        mongoQueryString={mongoQueryString}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Panel 3: Guía de integración en clientes */}
      <ClientSnippetsCard
        activeLang={activeLang}
        onLangChange={setActiveLang}
        snippet={clientSnippet}
      />
    </PageContainer>
  );
}
