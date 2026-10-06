"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { SiteForm } from "@/components/SiteForm";

export default function EditSitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { sites, updateSite } = useApp();

  const site = sites.find((s) => s._id === id);

  if (!site) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Sitio no encontrado</h2>
        <p className="text-xs text-slate-500 mb-4">
          No se encontró ningún sitio con el identificador {id}.
        </p>
        <Link
          href="/sites"
          className="text-xs text-emerald-600 font-bold hover:underline"
        >
          ← Volver a Mis Sitios
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-100">
      <div className="px-10 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs mb-1.5 text-slate-400 uppercase tracking-wider">
              MIS SITIOS / EDITAR CONFIGURACIÓN
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Editar {site.name}
            </h1>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              ID: {site._id}
            </div>
          </div>
          <Link
            href={`/sites/${id}`}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Cancelar
          </Link>
        </div>

        {/* Site Form Component */}
        <SiteForm
          initialData={site}
          submitLabel="Guardar Cambios →"
          cancelHref={`/sites/${id}`}
          onSubmit={(values) => {
            updateSite(id, values);
            router.push(`/sites/${id}`);
          }}
        />
      </div>
    </div>
  );
}
