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
  documents: ExtractedDocument[];
  sites: Site[];
  rawHttpRequestString: string;
  activeTab: "cards" | "json" | "headers";
  onTabChange: (tab: "cards" | "json" | "headers") => void;
}

export default function ApiResponseViewer({
  documents,
  sites,
  rawHttpRequestString,
  activeTab,
  onTabChange,
}: ApiResponseViewerProps) {
  const jsonContent = JSON.stringify(documents, null, 2);

  return (
    <Card className="mb-6">
      <Tabs
        value={activeTab}
        onValueChange={(val) => onTabChange(val as "cards" | "json" | "headers")}
      >
        <CardHeader className="flex-row items-center justify-between p-4 px-6 border-b border-slate-100 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono text-xs bg-slate-100 text-slate-700 border-slate-200">
              Respuesta HTTP 200 OK
            </Badge>
            <span className="text-xs text-slate-500">
              Documentos: <strong className="text-slate-800 font-mono">{documents.length}</strong>
            </span>
          </div>

          <TabsList>
            <TabsTrigger value="cards">Tarjetas ({documents.length})</TabsTrigger>
            <TabsTrigger value="json">JSON Raw</TabsTrigger>
            <TabsTrigger value="headers">Raw HTTP Request</TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="p-6">
          <TabsContent value="cards" className="mt-0">
            {documents.length === 0 ? (
              <EmptyState
                title="No hay documentos indexados aún"
                description="Registrá un sitio en Mis Sitios para ver los documentos indexados aquí."
                action={
                  <Link
                    href="/sites/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md text-xs font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    + Registrar Primer Sitio
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => {
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
              content={jsonContent}
            />
          </TabsContent>

          <TabsContent value="headers" className="mt-0">
            <CodeBlock
              title="Petición HTTP en formato estándar"
              content={rawHttpRequestString}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
