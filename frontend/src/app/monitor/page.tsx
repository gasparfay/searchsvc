"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import PageContainer from "@/components/PageContainer";
import StatCard from "@/components/StatCard";
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

export default function MonitorPage() {
  const { jobs } = useApp();

  const completedCount = jobs.filter((j) => j.estado === "completado").length;
  const runningCount = jobs.filter((j) => j.estado === "corriendo").length;
  const errorCount = jobs.filter((j) => j.estado === "error").length;

  return (
    <PageContainer>
      {/* Page Header Component */}
      <PageHeader
        breadcrumb="MONITOREO / JOBS DEL CRAWLER"
        title="Historial de Tareas y Corridas"
      />

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Corridas registradas"
          value={jobs.length}
          color="#1e3a6e"
          bg="#dbeafe"
          border="#bfdbfe"
        />
        <StatCard
          label="Completadas"
          value={completedCount}
          color="#166534"
          bg="#dcfce7"
          border="#bbf7d0"
        />
        <StatCard
          label="En curso"
          value={runningCount}
          color="#854d0e"
          bg="#fef9c3"
          border="#fef08a"
        />
        <StatCard
          label="Con fallos"
          value={errorCount}
          color="#991b1b"
          bg="#fee2e2"
          border="#fecaca"
        />
      </div>

      {/* Table Card */}
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
    </PageContainer>
  );
}
