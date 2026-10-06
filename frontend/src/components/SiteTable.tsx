"use client";

import Link from "next/link";
import type { Site } from "@/types";
import { IconSites, IconEye, IconEdit, IconTrash } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";

interface SiteTableProps {
  sites: Site[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRequestDelete: (site: { id: string; name: string }) => void;
}

export default function SiteTable({
  sites,
  searchQuery,
  onSearchChange,
  onRequestDelete,
}: SiteTableProps) {
  if (sites.length === 0) {
    return (
      <EmptyState
        icon={<IconSites width={28} height={28} />}
        title="Aún no tienes sitios registrados"
        description="Configurá la URL base del sitio web que deseás que el crawler explore, junto a los selectores de contenido y frecuencia de rastreo."
        action={
          <Link href="/sites/new">
            <Button>+ Registrar mi primer sitio</Button>
          </Link>
        }
      />
    );
  }

  return (
    <Card>
      {/* Header bar with Search */}
      <CardHeader className="flex-row items-center justify-between p-4 px-6 border-b border-slate-100 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <CardTitle className="text-xs uppercase tracking-wider">
            LISTADO DE SITIOS ({sites.length})
          </CardTitle>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Barra de búsqueda decorativa (sin filtrado activo) */}
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Buscar por nombre o URL..."
            className="w-56"
            inputClassName="font-mono"
          />
        </div>
      </CardHeader>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {["Sitio / ID", "URL Base", "Profundidad", "Frecuencia", "Último Snapshot", "Docs", "Acciones"].map((h) => (
              <TableHead key={h}>
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.map((s) => {
            const isOk = s.lastRunStatus === "ok";

            return (
              <TableRow key={s._id}>
                <TableCell>
                  <Link
                    href={`/sites/${s._id}`}
                    className="text-sm font-semibold text-slate-900 hover:text-emerald-700 hover:underline block"
                  >
                    {s.name}
                  </Link>
                  <div className="text-xs mt-0.5 font-mono text-slate-400">{s._id}</div>
                </TableCell>
                <TableCell className="font-mono text-slate-600">
                  {s.url}
                </TableCell>
                <TableCell className="text-slate-500">
                  <span className="font-semibold text-slate-700">{s.maxDepth}</span>{" "}
                  {s.maxDepth === 1 ? "nivel" : "niveles"}
                </TableCell>
                <TableCell className="text-slate-500">
                  {s.frequency}
                </TableCell>
                <TableCell>
                  <div className="text-slate-800">{s.lastRunDate || "Sin corridas"}</div>
                  {s.lastRunStatus && (
                    <div className="mt-1">
                      <Badge variant={isOk ? "success" : "destructive"} dot className="text-[10px]">
                        {isOk ? "Snapshot OK" : "Con errores"}
                      </Badge>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm font-semibold text-slate-900">
                  {(s.docsCount || 0).toLocaleString("es")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* Ver detalle */}
                    <Link href={`/sites/${s._id}`} title="Ver snapshots y documentos">
                      <Button
                        size="icon"
                        variant="outline"
                        className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 h-8 w-8"
                      >
                        <IconEye />
                      </Button>
                    </Link>

                    {/* Editar */}
                    <Link href={`/sites/${s._id}/edit`} title="Editar configuración del sitio">
                      <Button size="icon" variant="secondary" className="h-8 w-8">
                        <IconEdit />
                      </Button>
                    </Link>

                    {/* Eliminar */}
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => onRequestDelete({ id: s._id, name: s.name })}
                      title="Eliminar sitio"
                      className="h-8 w-8"
                    >
                      <IconTrash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
