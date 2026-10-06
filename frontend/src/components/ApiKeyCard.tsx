"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IconCopy, IconCheck, IconRefresh } from "@/components/icons";

interface ApiKeyCardProps {
  apiKey: string;
  onRegenerate: () => void;
}

export default function ApiKeyCard({ apiKey, onRegenerate }: ApiKeyCardProps) {
  const keyInputRef = useRef<HTMLInputElement>(null);
  const [copiado, setCopiado] = useState(false);
  const [copiadoCurl, setCopiadoCurl] = useState(false);

  const copiar = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(apiKey)
        .then(() => {
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2000);
        })
        .catch(() => execCopyFallback());
      return;
    }
    execCopyFallback();
  };

  const execCopyFallback = () => {
    try {
      if (keyInputRef.current) {
        keyInputRef.current.select();
        keyInputRef.current.setSelectionRange(0, 99999);
      }
      const ok = document.execCommand("copy");
      if (keyInputRef.current) {
        keyInputRef.current.blur();
      }
      if (ok) {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
        return;
      }
    } catch {
      // fallback
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = apiKey;
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.opacity = "0.01";
      textarea.style.zIndex = "99999";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // ignore
    }
  };

  const copiarCurl = () => {
    const curlCmd = `curl -H "Authorization: ${apiKey}" "http://localhost:3000/search?q=palabra1+palabra2"`;
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(curlCmd)
        .then(() => {
          setCopiadoCurl(true);
          setTimeout(() => setCopiadoCurl(false), 2000);
        })
        .catch(() => execCurlFallback(curlCmd));
      return;
    }
    execCurlFallback(curlCmd);
  };

  const execCurlFallback = (text: string) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.opacity = "0.01";
      textarea.style.zIndex = "99999";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiadoCurl(true);
      setTimeout(() => setCopiadoCurl(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Card className="mb-6 bg-[#0e1525] border-[#1e3a5f] text-slate-100 overflow-hidden">
      <CardHeader className="border-[#1e2d42] p-6 pb-4">
        <CardTitle className="text-xs font-bold text-[#3ddc84] tracking-wider uppercase">
          API KEY GLOBAL DE LA CUENTA
        </CardTitle>
        <CardDescription className="text-slate-400">
          Llave UUID única para autorizar consultas externas al motor de búsqueda (<code className="text-slate-300">GET /search?q=...</code>).
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex-1 min-w-0 space-y-1.5">
            <Label htmlFor="apiKeyInput" className="text-xs text-slate-400 font-medium">
              Clave de Autorización:
            </Label>
            <Input
              id="apiKeyInput"
              ref={keyInputRef}
              type="text"
              readOnly
              value={apiKey}
              className="bg-slate-950/80 border-slate-800 text-sm font-bold font-mono tracking-wider text-emerald-400 focus:outline-none select-all cursor-text py-2"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end mb-0.5">
            <Button
              type="button"
              onClick={copiar}
              title="Copiar API Key al portapapeles"
              className={
                copiado
                  ? "bg-[#2bc971] text-[#0a1f14] ring-2 ring-[#2bc971]/40"
                  : "bg-[#3ddc84] hover:bg-[#2bc971] text-[#0a1f14]"
              }
            >
              {copiado ? (
                <>
                  <IconCheck />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <IconCopy />
                  Copiar Key
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onRegenerate}
              className="text-yellow-300 bg-yellow-950/40 border-yellow-400/70 hover:bg-yellow-900/40 hover:border-yellow-300 hover:text-yellow-200"
            >
              <IconRefresh />
              Regenerar Key
            </Button>
          </div>
        </div>
      </CardContent>

      <Separator className="bg-slate-900" />

      {/* Ejemplo de cURL */}
      <CardFooter className="px-6 py-3.5 bg-slate-950/60 border-t-0 text-xs font-mono text-slate-400 flex-col items-stretch gap-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] text-slate-400">Ejemplo de consumo del endpoint (Search Service Spec):</span>
          <div className="flex items-center gap-3">
            <Link
              href="/playground"
              className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline transition-colors font-mono"
            >
              Probar en Playground →
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copiarCurl}
              className="text-[11px] text-slate-300 hover:text-white h-auto p-1 font-mono hover:bg-slate-900"
            >
              {copiadoCurl ? <IconCheck /> : <IconCopy />}
              {copiadoCurl ? "Copiado!" : "Copiar cURL"}
            </Button>
          </div>
        </div>
        <div className="text-slate-300 select-all overflow-x-auto py-1">
          curl -H &quot;Authorization: {apiKey}&quot; &quot;http://localhost:3000/search?q=palabra1+palabra2&quot;
        </div>
      </CardFooter>
    </Card>
  );
}
