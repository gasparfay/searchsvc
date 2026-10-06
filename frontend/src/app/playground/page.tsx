"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { API_BASE_URL, SEARCH_ENDPOINT_BASE_URL } from "@/lib/config";
import PageHeader from "@/components/PageHeader";
import PageContainer from "@/components/PageContainer";
import RequestInspector from "@/components/RequestInspector";
import ApiResponseViewer from "@/components/ApiResponseViewer";
import { Badge } from "@/components/ui/badge";

export default function PlaygroundPage() {
  const { account, documents, sites } = useApp();

  const [inputQuery, setInputQuery] = useState("productos");
  const [activeQuery, setActiveQuery] = useState("productos");
  const [selectedSiteId, setSelectedSiteId] = useState("all");
  const [activeTab, setActiveTab] = useState<"cards" | "json" | "headers">("cards");
  const [copiedCurl, setCopiedCurl] = useState(false);

  // Endpoint path with active query and optional siteId
  const endpointQueryString = useMemo(() => {
    const params = new URLSearchParams();
    if (activeQuery.trim()) params.set("q", activeQuery.trim());
    if (selectedSiteId !== "all") params.set("siteId", selectedSiteId);
    return params.toString() ? `?${params.toString()}` : "";
  }, [activeQuery, selectedSiteId]);

  // Full URL computed with centralized API configuration
  const fullEndpointUrl = `${SEARCH_ENDPOINT_BASE_URL}${endpointQueryString}`;

  // Host extracted dynamically from API_BASE_URL
  const endpointHost = useMemo(() => {
    try {
      return new URL(API_BASE_URL).host;
    } catch {
      return "localhost:3000";
    }
  }, []);

  // HTTP Request format
  const rawHttpRequestString = useMemo(() => {
    return `GET /search${endpointQueryString} HTTP/1.1\nHost: ${endpointHost}\nAuthorization: ${account.apiKey}\nAccept: application/json\nUser-Agent: SearchServiceClient/1.0`;
  }, [endpointQueryString, endpointHost, account.apiKey]);

  const handleRunSearch = () => {
    setActiveQuery(inputQuery);
  };

  const handleCopyCurl = async () => {
    const curl = `curl -X GET "${fullEndpointUrl}" \\\n  -H "Authorization: ${account.apiKey}" \\\n  -H "Accept: application/json"`;
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
            Vista previa del endpoint de búsqueda con tu API Key y estructura de respuesta.
          </p>
        }
      />

      {/* Panel 1: Inspector de Petición HTTP con botón explícito para correr la búsqueda */}
      <RequestInspector
        sites={sites}
        selectedSiteId={selectedSiteId}
        onSiteChange={setSelectedSiteId}
        query={inputQuery}
        onQueryChange={setInputQuery}
        onRunSearch={handleRunSearch}
        fullEndpointUrl={fullEndpointUrl}
        baseUrl={`${SEARCH_ENDPOINT_BASE_URL}?q=`}
        apiKey={account.apiKey}
        onCopyCurl={handleCopyCurl}
        copiedCurl={copiedCurl}
      />

      {/* Panel 2: Visor decorativo de Respuestas de la API */}
      <ApiResponseViewer
        documents={documents}
        sites={sites}
        rawHttpRequestString={rawHttpRequestString}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </PageContainer>
  );
}
