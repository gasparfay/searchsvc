"use client";

import { use } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { IconArrowLeft, IconExternalLink } from "@/components/icons";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/Card";
import CodeBlock from "@/components/CodeBlock";
import MetadataGrid from "@/components/MetadataGrid";

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
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-2">
          Documento no encontrado
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          No se encontró ningún documento con el ID {docId}.
        </p>
        <Link
          href={`/sites/${siteId}`}
          className="text-xs text-emerald-600 font-bold hover:underline"
        >
          Volver al Sitio
        </Link>
      </div>
    );
  }

  const snapshotDocs = documents.filter(
    (d) => d.snapshotId === document.snapshotId && d.siteId === site?._id
  );
  const currentIndex = snapshotDocs.findIndex((d) => d.id === document.id);
  const prevDoc = currentIndex > 0 ? snapshotDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < snapshotDocs.length - 1 ? snapshotDocs[currentIndex + 1] : null;

  return (
    <div className="h-full overflow-y-auto bg-slate-100">
      <div className="px-10 py-8 max-w-5xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/sites/${siteId}`}
            className="text-xs inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            <IconArrowLeft />
            Volver a {site?.name || "Mis Sitios"}
          </Link>

          <div className="flex items-center gap-2">
            {prevDoc && (
              <Link
                href={`/sites/${siteId}/docs/${prevDoc.id}`}
                className="px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-medium shadow-xs"
              >
                ← Anterior
              </Link>
            )}
            {nextDoc && (
              <Link
                href={`/sites/${siteId}/docs/${nextDoc.id}`}
                className="px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-medium shadow-xs"
              >
                Siguiente →
              </Link>
            )}
          </div>
        </div>

        {/* Main Document Card */}
        <Card>
          {/* Header */}
          <CardHeader>
            <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
              <StatusBadge variant="success" className="text-[11px] font-bold">
                HTTP {document.httpStatus || 200} OK
              </StatusBadge>
              <span className="text-xs text-slate-400 font-mono">
                Doc ID: {document.id}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-mono">
                Snapshot: {document.snapshotId}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 leading-snug mb-3">
              {document.name}
            </h1>

            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1.5 break-all"
            >
              {document.url}
              <IconExternalLink />
            </a>
          </CardHeader>

          {/* Body */}
          <CardBody>
            {/* Description */}
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Descripción Extraída (OG / Meta / Párrafo)
              </h2>
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
          </CardBody>

          {/* Footer */}
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
      </div>
    </div>
  );
}
