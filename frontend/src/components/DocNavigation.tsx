import React from "react";
import Link from "next/link";
import { IconArrowLeft } from "@/components/icons";

interface DocNavigationProps {
  backHref: string;
  backLabel?: string;
  prevHref?: string;
  nextHref?: string;
}

export default function DocNavigation({
  backHref,
  backLabel = "Volver",
  prevHref,
  nextHref,
}: DocNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <Link
        href={backHref}
        className="text-xs inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors font-medium"
      >
        <IconArrowLeft />
        {backLabel}
      </Link>

      <div className="flex items-center gap-2">
        {prevHref && (
          <Link
            href={prevHref}
            className="px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-medium shadow-xs"
          >
            ← Anterior
          </Link>
        )}
        {nextHref && (
          <Link
            href={nextHref}
            className="px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-medium shadow-xs"
          >
            Siguiente →
          </Link>
        )}
      </div>
    </div>
  );
}
