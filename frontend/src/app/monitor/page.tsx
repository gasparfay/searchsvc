"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import type { BadgeVariant } from "@/components/StatusBadge";

const STATUS_VARIANT_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  completado: { label: "Completado", variant: "success" },
  corriendo:  { label: "En curso",   variant: "warning" },
  error:      { label: "Error",      variant: "error" },
};

export default function MonitorPage() {
  const { jobs } = useApp();

  const completedCount = jobs.filter((j) => j.estado === "completado").length;
  const runningCount = jobs.filter((j) => j.estado === "corriendo").length;
  const errorCount = jobs.filter((j) => j.estado === "error").length;

  return (
    <div className="h-full overflow-y-auto bg-slate-100">
      <div className="px-10 py-8">
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
        <div className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs">
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
            <div className="text-xs font-bold text-slate-900 tracking-wider">
              CORRIDAS RECIENTES ({jobs.length})
            </div>
            <div className="text-xs text-slate-400">
              Haz clic en el sitio para inspeccionar sus snapshots y documentos extraídos.
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75">
                  {["Job ID", "Sitio", "Inicio", "Duración", "Páginas", "Documentos", "Errores", "Estado", ""].map((header) => (
                    <th
                      key={header}
                      className="text-left px-6 py-3.5 text-xs font-medium text-slate-400 tracking-wider uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => {
                  const statusInfo = STATUS_VARIANT_MAP[job.estado] || STATUS_VARIANT_MAP.completado;
                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 text-xs font-mono font-bold text-slate-900">
                        {job.id}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/sites/${job.siteId}`}
                          className="text-xs font-semibold text-slate-800 hover:text-emerald-700 hover:underline"
                        >
                          {job.sitio}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {job.inicio}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">
                        {job.duracion}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-900">
                        {job.paginas.toLocaleString("es")}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-900">
                        {job.docs.toLocaleString("es")}
                      </td>
                      <td className={`px-6 py-4 text-xs font-bold ${job.errores > 0 ? "text-red-500" : "text-slate-400"}`}>
                        {job.errores}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/sites/${job.siteId}`}
                          className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold hover:underline"
                        >
                          Ver Sitio →
                        </Link>
                      </td>
                    </tr>
                  );
                })}

                {jobs.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-xs text-slate-400">
                      No hay tareas ni corridas de crawler registradas todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
