"use client";

import Link from "next/link";
import type { ExtractedDocument, Site } from "@/types";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SearchResultCard from "@/components/SearchResultCard";
import CodeBlock from "@/components/CodeBlock";
import EmptyState from "@/components/EmptyState";

interface ApiResponseViewerProps {
  isAuthorized: boolean;
  searchResults: ExtractedDocument[];
  documentsTotal: number;
  query: string;
  selectedSiteId: string;
  sites: Site[];
  jsonString: string;
  rawHttpRequestString: string;
  mongoQueryString: string;
  activeTab: "cards" | "json" | "headers" | "mongo";
  onTabChange: (tab: "cards" | "json" | "headers" | "mongo") => void;
}

export default function ApiResponseViewer({
  isAuthorized,
  searchResults,
  documentsTotal,
  query,
  selectedSiteId,
  sites,
  jsonString,
  rawHttpRequestString,
  mongoQueryString,
  activeTab,
  onTabChange,
}: ApiResponseViewerProps) {
  return (
    <Card className="mb-6">
      <Tabs
        value={activeTab}
        onValueChange={(val) => onTabChange(val as "cards" | "json" | "headers" | "mongo")}
      >
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

          <TabsList>
            <TabsTrigger value="cards">Tarjetas ({searchResults.length})</TabsTrigger>
            <TabsTrigger value="json">JSON Raw</TabsTrigger>
            <TabsTrigger value="headers">Raw HTTP Request</TabsTrigger>
            <TabsTrigger value="mongo">MongoDB Query ($text)</TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="p-6">
          <TabsContent value="cards" className="mt-0">
            {!isAuthorized ? (
              <EmptyState
                title="401 Unauthorized"
                description="La API Key suministrada no coincide con ninguna cuenta activa. Asegurate de enviar la clave correcta en el header Authorization."
              />
            ) : searchResults.length === 0 ? (
              documentsTotal === 0 ? (
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
          </TabsContent>

          <TabsContent value="json" className="mt-0">
            <CodeBlock
              title="Content-Type: application/json; charset=utf-8"
              content={jsonString}
            />
          </TabsContent>

          <TabsContent value="headers" className="mt-0">
            <CodeBlock
              title="Petición HTTP en formato estándar (Search Service Spec)"
              content={rawHttpRequestString}
            />
          </TabsContent>

          <TabsContent value="mongo" className="mt-0">
            <div>
              <CodeBlock
                title="Sintaxis de consulta MongoDB con índice de texto ($text)"
                content={mongoQueryString}
              />
              <div className="mt-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800">Nota del enunciado (Search Service Spec):</span> En MongoDB, el operador <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold">$text</code> permite búsquedas de texto indexadas con tokenización y stemming sobre los campos indexados (<code>name</code>, <code>description</code>, <code>content</code>), filtrando además por la cuenta del usuario (<code>accountId</code>) y opcionalmente por el sitio (<code>siteId</code>).
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
