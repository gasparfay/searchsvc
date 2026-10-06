import React from "react";
import Link from "next/link";
import type { Site } from "@/types";
import { IconArrowLeft, IconPlay, IconEdit, IconTrash } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SiteHeaderProps {
  site: Site;
  onCrawl: () => void;
  onDelete: () => void;
}

export default function SiteHeader({ site, onCrawl, onDelete }: SiteHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
      <div>
        <Link
          href="/sites"
          className="text-xs mb-2 inline-flex items-center gap-1.5 transition-colors text-slate-400 hover:text-slate-700 font-medium"
        >
          <IconArrowLeft />
          Volver a Mis Sitios
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{site.name}</h1>
          <Badge variant="success" dot>
            Programado: {site.frequency}
          </Badge>
        </div>
        <div className="text-xs mt-1.5 font-mono text-slate-500 flex items-center gap-3 flex-wrap">
          <span>
            URL: <strong className="text-slate-800">{site.url}</strong>
          </span>
          <span>·</span>
          <span>
            Profundidad: <strong className="text-slate-800">{site.maxDepth} niveles</strong>
          </span>
          <span>·</span>
          <span>ID: {site._id}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onCrawl}>
          <IconPlay />
          Ejecutar Crawl Ahora
        </Button>

        <Link href={`/sites/${site._id}/edit`}>
          <Button variant="outline">
            <IconEdit />
            Editar Configuración
          </Button>
        </Link>

        <Button
          variant="destructive"
          size="icon"
          onClick={onDelete}
          title="Eliminar sitio"
        >
          <IconTrash />
        </Button>
      </div>
    </div>
  );
}
