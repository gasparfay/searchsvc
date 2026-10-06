"use client";

import type { Site, CrawlSnapshot, ExtractedDocument } from "@/types";
import { IconPlay } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";
import DocumentCard from "@/components/DocumentCard";

interface SiteDocumentsPanelProps {
  site: Site;
  hasSnapshots: boolean;
  activeSnapshot?: CrawlSnapshot;
  docs: ExtractedDocument[];
  querySearch: string;
  onQuerySearchChange: (q: string) => void;
  onTriggerCrawl: () => void;
}

export default function SiteDocumentsPanel({
  site,
  hasSnapshots,
  activeSnapshot,
  docs,
  querySearch,
  onQuerySearchChange,
  onTriggerCrawl,
}: SiteDocumentsPanelProps) {
  if (!hasSnapshots) {
    return (
      <EmptyState
        icon={<IconPlay />}
        title="Este sitio aún no tiene documentos indexados"
        description={`Aún no se ha realizado ninguna corrida de crawler para ${site.name}. Presioná el botón a continuación para iniciar la primera indexación.`}
        action={
          <Button onClick={onTriggerCrawl}>
            <IconPlay />
            Iniciar Primera Indexación
          </Button>
        }
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between p-4 px-6 border-b border-slate-100 flex-wrap gap-4">
        <div>
          <CardTitle className="text-xs uppercase tracking-wider">
            Documentos Extraídos del Snapshot ({activeSnapshot ? activeSnapshot.id : "—"})
          </CardTitle>
          <CardDescription>
            Mostrando {docs.length} documentos indexados.
          </CardDescription>
        </div>

        {/* Barra de búsqueda decorativa (sin filtrado activo) */}
        <SearchInput
          value={querySearch}
          onChange={onQuerySearchChange}
          placeholder="Buscar por título, url o descripción..."
          className="min-w-[280px]"
        />
      </CardHeader>

      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((doc) => (
          <DocumentCard key={doc.id} document={doc} siteId={site._id} />
        ))}

        {docs.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 text-xs">
            Este snapshot no tiene documentos extraídos asociados.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
