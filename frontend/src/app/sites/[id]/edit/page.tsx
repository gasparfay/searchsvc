"use client";

import { use } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import { SiteForm } from "@/components/SiteForm";

export default function EditSitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { sites } = useApp();

  const site = sites.find((s) => s._id === id) || {
    _id: id || "65f1a2b3c4d5e6f7a8b9c011",
    name: "Tienda Ejemplo",
    url: "https://example.com",
    maxDepth: 2,
    frequency: "Cada 6 horas",
    extractorSnippet: `function extract(request, response) {\n  const $ = response.body;\n  return [{\n    name: $('title').text(),\n    url: request.url,\n    description: $('meta[name=\"description\"]').attr('content') || $('p').first().text().slice(0, 200)\n  }];\n}`,
    pageResolverSnippet: `function pageResolver(request, response) {\n  const $ = response.body;\n  const links = [];\n  $('a[href]').each(function() {\n    const href = $(this).attr('href');\n    if (href && href.startsWith('/')) links.push(request.baseUrl + href);\n  });\n  return links;\n}`,
    docsCount: 0,
    lastRunDate: "Sin ejecuciones",
    lastRunStatus: "ok" as const,
    accountId: "65f1a2b3c4d5e6f7a8b9c001",
    createdAt: new Date().toISOString(),
  };

  return (
    <PageContainer maxWidth="5xl">
      {/* Page Header Component */}
      <PageHeader
        breadcrumb="MIS SITIOS / EDITAR CONFIGURACIÓN"
        title={`Editar ${site.name}`}
        subtitle={<span className="font-mono">ID: {site._id}</span>}
        action={
          <Link
            href={`/sites/${id}`}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Cancelar
          </Link>
        }
      />

      {/* Site Form Component */}
      <SiteForm
        initialData={site}
        submitLabel="Guardar Cambios →"
        cancelHref={`/sites/${id}`}
        onSubmit={() => {
          // Modo maquetado: el botón no realiza acción
        }}
      />
    </PageContainer>
  );
}
