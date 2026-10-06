"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";

const STATUS_MAP: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  completado: { label: "Completado", dot: "bg-emerald-500", text: "text-emerald-800", bg: "bg-emerald-50" },
  corriendo:  { label: "En curso",   dot: "bg-blue-500",    text: "text-blue-800",    bg: "bg-blue-50" },
  error:      { label: "Error",      dot: "bg-red-500",     text: "text-red-800",     bg: "bg-red-50" },
};

export default function MonitorPage() {
  const { jobs } = useApp();

  const completedCount = jobs.filter((j) => j.estado === "completado").length;
  const runningCount = jobs.filter((j) => j.estado === "corriendo").length;
  const errorCount = jobs.filter((j) => j.estado === "error").length;

  return (
    <div className="h-full overflow-y-auto bg-slate-100">
      <div className="px-10 py-8">
        <div className="text-xs mb-1.5 text-slate-400 uppercase tracking-wider">
          MONITOREO / JOBS DEL CRAWLER
        </div>
        <h1 className="text-2xl font-bold mb-8 text-slate-900">
          Historial de Tareas y Corridas
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="px-5 py-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="text-xs mb-1.5 font-bold uppercase tracking-wider text-blue-900/70">
              Corridas registradas
            </div>
            <div className="text-3xl font-bold text-blue-950">{jobs.length}</div>
          </div>
          <div className="px-5 py-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="text-xs mb-1.5 font-bold uppercase tracking-wider text-emerald-900/70">
              Completadas
            </div>
            <div className="text-3xl font-bold text-emerald-950">{completedCount}</div>
          </div>
          <div className="px-5 py-4 rounded-xl bg-sky-50 border border-sky-200">
            <div className="text-xs mb-1.5 font-bold uppercase tracking-wider text-sky-900/70">
              En curso
            </div>
            <div className="text-3xl font-bold text-sky-950">{runningCount}</div>
          </div>
          <div className="px-5 py-4 rounded-xl bg-red-50 border border-red-200">
            <div className="text-xs mb-1.5 font-bold uppercase tracking-wider text-red-900/70">
              Con fallos
            </div>
            <div className="text-3xl font-bold text-red-950">{errorCount}</div>
          </div>
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
                  const status = STATUS_MAP[job.estado] || STATUS_MAP.completado;
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
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`} />
                          {status.label}
                        </span>
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
