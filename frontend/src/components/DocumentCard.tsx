import Link from "next/link";
import type { ExtractedDocument } from "@/types";

interface DocumentCardProps {
  document: ExtractedDocument;
  siteId: string;
}

export default function DocumentCard({ document, siteId }: DocumentCardProps) {
  return (
    <Link
      href={`/sites/${siteId}/docs/${document.id}`}
      className="rounded-lg p-4 transition-all block group bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 hover:shadow-xs"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="text-sm font-semibold leading-snug text-slate-900 group-hover:text-emerald-900 line-clamp-2">
          {document.name}
        </h3>
        <span className="text-[10px] text-slate-400 font-mono shrink-0">
          {document.id}
        </span>
      </div>

      <div className="text-xs mb-2.5 truncate font-mono text-emerald-600">
        {document.url}
      </div>

      <p className="text-xs leading-relaxed text-slate-500 line-clamp-3">
        {document.description || "Sin descripción extraída."}
      </p>

      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
        <span>{document.crawledAt?.split(" ")[0]}</span>
        <span className="text-emerald-700 font-medium group-hover:underline inline-flex items-center gap-1">
          Ver detalle →
        </span>
      </div>
    </Link>
  );
}
