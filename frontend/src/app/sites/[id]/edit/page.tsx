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

  const site = sites.find((s) => s._id === id) || {
    _id: id || "65f1a2b3c4d5e6f7a8b9c011",
    name: "Tienda Ejemplo",
    url: "https://example.com",
    maxDepth: 2,
    frequency: "Cada 6 horas",
    extractorSnippet: `function extract(request, response) {\n  const $ = response.body;\n  return [{\n    name: $('title').text(),\n    url: request.url,\n    description: $('meta[name="description"]').attr('content') || $('p').first().text().slice(0, 200)\n  }];\n}`,
    pageResolverSnippet: `function pageResolver(request, response) {\n  const $ = response.body;\n  const links = [];\n  $('a[href]').each(function() {\n    const href = $(this).attr('href');\n    if (href && href.startsWith('/')) links.push(request.baseUrl + href);\n  });\n  return links;\n}`,
    docsCount: 0,
    lastRunDate: "Sin ejecuciones",
    lastRunStatus: "ok" as const,
    accountId: "65f1a2b3c4d5e6f7a8b9c001",
    createdAt: new Date().toISOString(),
  };

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
          onSubmit={() => {
            // Modo maquetado: el botón no realiza acción
          }}
        />
      </div>
    </div>
  );

}
