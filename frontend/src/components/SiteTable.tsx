"use client";

import Link from "next/link";
import type { Site } from "@/types";
import { IconSites, IconEye, IconEdit, IconTrash, IconSearch, IconClose } from "@/components/icons";

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
      <div className="rounded-xl p-12 text-center bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <IconSites width={28} height={28} />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Aún no tienes sitios registrados
        </h3>
        <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
          Configurá la URL base del sitio web que deseás que el crawler explore, junto a los selectores de contenido y frecuencia de rastreo.
        </p>
        <Link
          href="/sites/new"
          className="px-5 py-2.5 text-xs font-bold rounded-lg bg-[#3ddc84] hover:bg-[#2bc971] text-[#0a1f14] transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          + Registrar mi primer sitio
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden bg-white border border-slate-200 shadow-xs">
      {/* Header bar with Search and Sort */}
      <div className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap border-b border-slate-100">

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
          {/* Search box */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus-within:border-emerald-400 focus-within:bg-white transition-colors">
            <span className="text-slate-400">
              <IconSearch />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nombre o URL..."
              className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-52 font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <IconClose />
              </button>
            )}
          </div>

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
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70">
            {["Sitio / ID", "URL Base", "Profundidad", "Frecuencia", "Última Foto", "Docs", "Acciones"].map((h) => (
              <th key={h} className="text-left px-6 py-3.5 text-xs font-medium text-slate-400 tracking-wider">
                {h.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredSites.map((s, i) => {
            const isOk = s.lastRunStatus === "ok";

            return (
              <tr
                key={s._id}
                className={`transition-colors hover:bg-slate-50/70 ${
                  i < filteredSites.length - 1 ? "border-b border-slate-50" : ""
                }`}
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/sites/${s._id}`}
                    className="text-sm font-semibold text-slate-900 hover:text-emerald-700 hover:underline block"
                  >
                    {s.name}
                  </Link>
                  <div className="text-xs mt-0.5 font-mono text-slate-400">{s._id}</div>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-slate-600">{s.url}</td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{s.maxDepth}</span>{" "}
                  {s.maxDepth === 1 ? "nivel" : "niveles"}
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">{s.frequency}</td>
                <td className="px-6 py-4 text-xs">
                  <div className="text-slate-800">{s.lastRunDate || "Sin corridas"}</div>
                  {s.lastRunStatus && (
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                        isOk ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isOk ? "bg-emerald-500" : "bg-red-500"}`} />
                      {isOk ? "Foto OK" : "Con errores"}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                  {(s.docsCount || 0).toLocaleString("es")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {/* Ver detalle */}
                    <Link
                      href={`/sites/${s._id}`}
                      title="Ver fotos y documentos"
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
                </td>
              </tr>
            );
          })}

          {filteredSites.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-12 text-sm text-slate-400">
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
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
