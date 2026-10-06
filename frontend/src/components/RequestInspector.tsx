"use client";

import type { Site } from "@/types";
import { IconPlayground } from "@/components/icons";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import RequestUrlBar from "@/components/RequestUrlBar";

interface RequestInspectorProps {
  sites: Site[];
  selectedSiteId: string;
  onSiteChange: (siteId: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  presetQueries: string[];
  fullEndpointUrl: string;
  currentKey: string;
  isAuthorized: boolean;
  useCustomKey: boolean;
  customApiKey: string;
  onCustomApiKeyChange: (key: string) => void;
  onToggleCustomKey: () => void;
  onCopyCurl: () => void;
  copiedCurl: boolean;
}

export default function RequestInspector({
  sites,
  selectedSiteId,
  onSiteChange,
  query,
  onQueryChange,
  presetQueries,
  fullEndpointUrl,
  currentKey,
  isAuthorized,
  useCustomKey,
  customApiKey,
  onCustomApiKeyChange,
  onToggleCustomKey,
  onCopyCurl,
  copiedCurl,
}: RequestInspectorProps) {
  return (
    <Card className="mb-6 bg-[#0e1525] border-[#1e3a5f] text-slate-100 overflow-hidden">
      <CardHeader className="flex-row items-center justify-between border-b border-slate-800 p-6 pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">
            <IconPlayground />
          </span>
          <CardTitle className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            REQUEST INSPECTOR
          </CardTitle>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Label className="text-slate-400 text-xs font-normal">URL del Endpoint:</Label>
          <Badge
            variant="outline"
            className="font-mono text-emerald-400 bg-slate-900 border-slate-800 text-xs py-0.5 px-2"
          >
            {fullEndpointUrl}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Selector de Ámbito de Búsqueda */}
        <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-3">
            <Label htmlFor="siteScopeSelect" className="text-slate-300 font-medium text-xs whitespace-nowrap">
              Ámbito de búsqueda:
            </Label>
            <div className="w-72">
              <Select
                id="siteScopeSelect"
                value={selectedSiteId}
                onChange={(e) => onSiteChange(e.target.value)}
                className="bg-slate-950 border-slate-700 text-emerald-400 font-mono"
              >
                <option value="all">Global (todos los sitios de la cuenta - Spec PDF)</option>
                {sites.map((s) => (
                  <option key={s._id} value={s._id}>
                    Filtrar por sitio: {s.name} ({s._id})
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            {selectedSiteId === "all" ? (
              <Badge variant="outline" className="bg-emerald-950/50 text-emerald-400 border-emerald-800 font-mono text-[11px]">
                Búsqueda global con API Key (sin parámetro &amp;siteId)
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-emerald-950 text-emerald-400 border-emerald-700 font-mono text-[11px]">
                Filtro activo: &amp;siteId={selectedSiteId}
              </Badge>
            )}
          </div>
        </div>

        {/* Barra de URL Unificada y Continua (GET) */}
        <RequestUrlBar
          method="GET"
          baseUrl="http://localhost:3000/search?q="
          query={query}
          onQueryChange={onQueryChange}
          siteId={selectedSiteId}
          onCopyCurl={onCopyCurl}
          copiedCurl={copiedCurl}
        />

        {/* Presets de búsqueda rápida */}
        <div className="flex items-center gap-2 flex-wrap">
          <Label className="text-slate-400 text-xs">Sugerencias de búsqueda:</Label>
          {presetQueries.map((preset) => (
            <Button
              key={preset}
              type="button"
              size="sm"
              variant={query === preset ? "default" : "outline"}
              onClick={() => onQueryChange(preset)}
              className={
                query === preset
                  ? "h-7 text-xs font-mono"
                  : "h-7 text-xs font-mono bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
              }
            >
              {preset}
            </Button>
          ))}
        </div>

        {/* Authorization Header info */}
        <Separator className="bg-slate-800" />
        <div className="flex items-center justify-between gap-4 flex-wrap text-xs">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Label htmlFor="customApiKeyInput" className="text-slate-400 text-xs shrink-0">
              Header Authorization:
            </Label>
            {!useCustomKey ? (
              <span className="font-mono text-emerald-400 truncate">
                {currentKey}
              </span>
            ) : (
              <Input
                id="customApiKeyInput"
                type="text"
                value={customApiKey}
                onChange={(e) => onCustomApiKeyChange(e.target.value)}
                placeholder="Probar otra API Key..."
                className="max-w-sm h-8 bg-slate-900 border-slate-700 text-emerald-400 font-mono focus:bg-slate-900 text-xs"
              />
            )}
            <Badge variant={isAuthorized ? "success" : "destructive"}>
              {isAuthorized ? "Válida" : "Inválida (401)"}
            </Badge>
          </div>

          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={onToggleCustomKey}
            className="text-xs text-slate-400 hover:text-slate-200 font-mono p-0 h-auto"
          >
            {useCustomKey ? "Usar clave de mi cuenta" : "Simular otra clave (probar 401)"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
