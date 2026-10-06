"use client";

import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { SiteForm } from "@/components/SiteForm";

export default function NewSitePage() {
  return (
    <div className="h-full overflow-y-auto bg-slate-100">
      <div className="px-10 py-8 max-w-5xl mx-auto">
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

      </div>
    </div>
  );
}
