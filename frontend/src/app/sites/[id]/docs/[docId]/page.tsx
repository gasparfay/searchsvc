"use client";

import { use } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import EmptyState from "@/components/EmptyState";
import DocNavigation from "@/components/DocNavigation";
import ExternalLink from "@/components/ExternalLink";
import CodeBlock from "@/components/CodeBlock";
import MetadataGrid from "@/components/MetadataGrid";
import PageContainer from "@/components/PageContainer";

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string; docId: string }>;
}) {
  const { id: siteId, docId } = use(params);
  const { sites, documents } = useApp();

  const site = sites.find((s) => s._id === siteId) || sites[0];
  const document = documents.find((d) => d.id === docId);

  if (!document) {
    return (
      <PageContainer className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          title="Documento no encontrado"
          description={`No se encontró ningún documento con el ID ${docId}.`}
          action={
            <Link
              href={`/sites/${siteId}`}
              className="text-xs text-emerald-600 font-bold hover:underline"
            >
              Volver al Sitio
            </Link>
          }
        />
      </PageContainer>
    );
  }

  const snapshotDocs = documents.filter(
    (d) => d.snapshotId === document.snapshotId && d.siteId === site?._id
  );
  const currentIndex = snapshotDocs.findIndex((d) => d.id === document.id);
  const prevDoc = currentIndex > 0 ? snapshotDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < snapshotDocs.length - 1 ? snapshotDocs[currentIndex + 1] : null;

  return (
    <PageContainer maxWidth="5xl">
      {/* Navigation Bar */}
      <DocNavigation
        backHref={`/sites/${siteId}`}
        backLabel={`Volver a ${site?.name || "Mis Sitios"}`}
        prevHref={prevDoc ? `/sites/${siteId}/docs/${prevDoc.id}` : undefined}
        nextHref={nextDoc ? `/sites/${siteId}/docs/${nextDoc.id}` : undefined}
      />

      {/* Main Document Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <Badge variant="success">
              HTTP {document.httpStatus || 200} OK
            </Badge>
            <span className="text-xs text-slate-400 font-mono">
              Doc ID: {document.id}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono">
              Snapshot: {document.snapshotId}
            </span>
          </div>

          <CardTitle>{document.name}</CardTitle>

          <div className="mt-1">
            <ExternalLink href={document.url} />
          </div>
        </CardHeader>

        <CardContent>
          {/* Description */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Descripción Extraída (OG / Meta / Párrafo)
            </Label>
            <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
              {document.description || "Sin descripción extraída para este documento."}
            </div>
          </div>

          {/* Indexed Content */}
          <CodeBlock
            title="Contenido de Texto Indexado"
            content={document.content}
          />

          {/* Metadata Grid */}
          <MetadataGrid
            title="Metadatos del Documento y Rastreo"
            items={[
              { label: "Sitio Asociado", value: site?.name },
              {
                label: "Fecha de Captura",
                value: <span className="font-mono">{document.crawledAt}</span>,
              },
              {
                label: "Snapshot",
                value: <span className="font-mono text-emerald-700">{document.snapshotId}</span>,
              },
            ]}
          />
        </CardContent>

        <CardFooter>
          <Link
            href={`/sites/${siteId}`}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            ← Volver a la lista de documentos
          </Link>
          <span className="text-xs text-slate-400 font-mono">
            Documento {currentIndex + 1} de {snapshotDocs.length} en este snapshot
          </span>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
