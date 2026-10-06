"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { SiteForm } from "@/components/SiteForm";

export default function NewSitePage() {
  const router = useRouter();
  const { addSite } = useApp();

  return (
    <div className="h-full overflow-y-auto bg-slate-100">
      <div className="px-10 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs mb-1.5 text-slate-400 uppercase tracking-wider">
              MIS SITIOS / REGISTRAR NUEVO
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Registrar Nuevo Sitio
            </h1>
          </div>
          <Link
            href="/sites"
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Cancelar
          </Link>
        </div>

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
