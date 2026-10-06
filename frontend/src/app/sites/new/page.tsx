"use client";

import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import { SiteForm } from "@/components/SiteForm";

export default function NewSitePage() {
  return (
    <PageContainer maxWidth="5xl">
      {/* Page Header Component */}
      <PageHeader
        breadcrumb="MIS SITIOS / REGISTRAR NUEVO"
        title="Registrar Nuevo Sitio"
        action={
          <Link
            href="/sites"
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Cancelar
          </Link>
        }
      />

      {/* Site Form Component */}
      <SiteForm
        submitLabel="Guardar y Registrar Sitio →"
        cancelHref="/sites"
        onSubmit={() => {
          // Modo maquetado: el botón no realiza acción
        }}
      />
    </PageContainer>
  );
}
