"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import { SiteForm } from "@/components/SiteForm";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";

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
      <PageContainer className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          title="Sitio no encontrado"
          description="El sitio que deseas editar no existe o fue eliminado."
          action={
            <Link href="/sites">
              <Button>← Volver a Mis Sitios</Button>
            </Link>
          }
        />
      </PageContainer>
    );
  }

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
        onSubmit={(values) => {
          updateSite(site._id, values);
          router.push(`/sites/${id}`);
        }}
      />
    </PageContainer>
  );
}
