"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconCopy, IconCheck } from "@/components/icons";

interface RequestUrlBarProps {
  method?: string;
  baseUrl?: string;
  query: string;
  onQueryChange: (query: string) => void;
  siteId?: string;
  onCopyCurl: () => void;
  copiedCurl: boolean;
}

export default function RequestUrlBar({
  method = "GET",
  baseUrl = "http://localhost:3000/search?q=",
  query,
  onQueryChange,
  siteId,
  onCopyCurl,
  copiedCurl,
}: RequestUrlBarProps) {
  return (
    <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2 flex-1 min-w-0 font-mono text-xs overflow-x-auto py-1">
        <Badge
          variant="outline"
          className="bg-emerald-500/20 text-emerald-400 font-bold shrink-0 border-emerald-500/30"
        >
          {method}
        </Badge>
        <span className="text-slate-500 shrink-0 select-none">{baseUrl}</span>
        <Input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="palabras-clave"
          className="w-48 bg-slate-900 text-emerald-300 border-slate-700 font-mono font-bold focus:border-emerald-500 h-8 text-xs shrink-0"
        />
        {siteId && siteId !== "all" ? (
          <Badge
            variant="outline"
            className="bg-emerald-950 text-emerald-400 font-bold border-emerald-700 shrink-0"
          >
            &amp;siteId={siteId}
          </Badge>
        ) : (
          <span className="text-slate-600 text-[11px] italic shrink-0 select-none">
            &amp;siteId=&lt;global&gt;
          </span>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onCopyCurl}
        title="Copiar comando cURL equivalente"
        className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 shrink-0"
      >
        {copiedCurl ? <IconCheck /> : <IconCopy />}
        <span>{copiedCurl ? "Copiado" : "Copiar cURL"}</span>
      </Button>
    </div>
  );
}
