"use client";

import Link from "next/link";
import type { CrawlJob } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const STATUS_VARIANT_MAP: Record<string, { label: string; variant: "success" | "warning" | "destructive" }> = {
  completado: { label: "Completado", variant: "success" },
  corriendo:  { label: "En curso",   variant: "warning" },
  error:      { label: "Error",      variant: "destructive" },
};

interface JobsTableProps {
  jobs: CrawlJob[];
}

export default function JobsTable({ jobs }: JobsTableProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between p-4 px-6 border-b border-slate-100 flex-wrap gap-2">
        <div>
          <CardTitle className="text-xs font-bold text-slate-900 tracking-wider uppercase">
            CORRIDAS RECIENTES ({jobs.length})
          </CardTitle>
          <CardDescription className="mt-0.5">
            Haz clic en el sitio para inspeccionar sus snapshots y documentos extraídos.
          </CardDescription>
        </div>
      </CardHeader>

      <Table>
        <TableHeader>
          <TableRow>
            {["Job ID", "Sitio", "Inicio", "Duración", "Páginas", "Documentos", "Errores", "Estado", ""].map((header) => (
              <TableHead key={header}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => {
            const statusInfo = STATUS_VARIANT_MAP[job.estado] || STATUS_VARIANT_MAP.completado;
            return (
              <TableRow key={job.id}>
                <TableCell className="font-mono font-bold text-slate-900">
                  {job.id}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/sites/${job.siteId}`}
                    className="text-xs font-semibold text-slate-800 hover:text-emerald-700 hover:underline"
                  >
                    {job.sitio}
                  </Link>
                </TableCell>
                <TableCell className="text-slate-500">
                  {job.inicio}
                </TableCell>
                <TableCell className="font-mono text-slate-500">
                  {job.duracion}
                </TableCell>
                <TableCell className="font-semibold text-slate-900">
                  {job.paginas.toLocaleString("es")}
                </TableCell>
                <TableCell className="font-semibold text-slate-900">
                  {job.docs.toLocaleString("es")}
                </TableCell>
                <TableCell className={`font-bold ${job.errores > 0 ? "text-red-500" : "text-slate-400"}`}>
                  {job.errores}
                </TableCell>
                <TableCell>
                  <Badge variant={statusInfo.variant} dot>
                    {statusInfo.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/sites/${job.siteId}`}
                    className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold hover:underline"
                  >
                    Ver Sitio →
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}

          {jobs.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="py-12 text-center text-slate-400">
                No hay tareas ni corridas de crawler registradas todavía.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
