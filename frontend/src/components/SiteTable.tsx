"use client";

import Link from "next/link";
import type { Site } from "@/types";
import { IconSites, IconEye, IconEdit, IconTrash } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
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
  filteredSites: Site[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: "recent" | "name" | "docs";
  onSortChange: (sort: "recent" | "name" | "docs") => void;
  onRequestDelete: (site: { id: string; name: string }) => void;
}

export default function SiteTable({
  sites,
  filteredSites,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
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
      {/* Header bar with Search and Sort */}
      <CardHeader className="flex-row items-center justify-between p-4 px-6 border-b border-slate-100 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-slate-900 tracking-wider">
            LISTADO DE SITIOS ({filteredSites.length}
            {filteredSites.length !== sites.length ? ` de ${sites.length}` : ""})
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            MongoDB: sites
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Reusable Search box */}
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Buscar por nombre o URL..."
            className="w-56"
            inputClassName="font-mono"
          />

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-[11px] text-slate-400">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as "recent" | "name" | "docs")}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-emerald-400 cursor-pointer"
            >
              <option value="recent">Recientes</option>
              <option value="name">Nombre A-Z</option>
              <option value="docs">Más Documentos</option>
            </select>
          </div>
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
          {filteredSites.map((s) => {
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
                    <Link
                      href={`/sites/${s._id}`}
                      title="Ver snapshots y documentos"
                      className="p-2.5 rounded transition-all inline-flex items-center justify-center text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                    >
                      <IconEye />
                    </Link>

                    {/* Editar */}
                    <Link
                      href={`/sites/${s._id}/edit`}
                      title="Editar configuración del sitio"
                      className="p-2.5 rounded transition-all inline-flex items-center justify-center text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-800"
                    >
                      <IconEdit />
                    </Link>

                    {/* Eliminar */}
                    <button
                      type="button"
                      onClick={() => onRequestDelete({ id: s._id, name: s.name })}
                      title="Eliminar sitio"
                      className="p-2.5 rounded transition-all inline-flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-700 cursor-pointer"
                    >
                      <IconTrash />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}

          {filteredSites.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-sm text-slate-400">
                {searchQuery ? (
                  <div>
                    <p className="mb-2">
                      No se encontraron sitios que coincidan con &quot;
                      <span className="text-slate-700 font-medium">{searchQuery}</span>&quot;
                    </p>
                    <button
                      type="button"
                      onClick={() => onSearchChange("")}
                      className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
                    >
                      Limpiar filtro de búsqueda
                    </button>
                  </div>
                ) : (
                  "No tienes sitios registrados. Haz clic en '+ Registrar Nuevo Sitio' para comenzar."
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
