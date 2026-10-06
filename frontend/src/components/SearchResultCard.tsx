import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface SearchResultCardProps {
  id: string;
  name: string;
  url: string;
  description?: string;
  snapshotId: string;
  siteId: string;
  siteName: string;
}

export default function SearchResultCard({
  id,
  name,
  url,
  description,
  snapshotId,
  siteId,
  siteName,
}: SearchResultCardProps) {
  return (
    <Card className="bg-slate-50/70 hover:bg-slate-50 border-slate-200 transition-colors flex flex-col justify-between">
      <CardHeader className="p-4 pb-2 border-b-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold text-slate-900 line-clamp-1">
            {name}
          </CardTitle>
          <Badge variant="outline" className="font-mono text-[10px] shrink-0 bg-emerald-50 text-emerald-800 border-emerald-200">
            {snapshotId}
          </Badge>
        </div>
        <div className="text-xs font-mono text-emerald-600 truncate">
          {url}
        </div>
      </CardHeader>

      <CardContent className="px-4 py-2 space-y-0">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {description || "Sin descripción."}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-2.5 border-t border-slate-200 bg-transparent text-[11px] text-slate-400">
        <span>Sitio: <strong className="text-slate-700">{siteName}</strong></span>
        <Link
          href={`/sites/${siteId}/docs/${id}`}
          className="text-emerald-700 font-semibold hover:underline"
        >
          Ver documento →
        </Link>
      </CardFooter>
    </Card>
  );
}
