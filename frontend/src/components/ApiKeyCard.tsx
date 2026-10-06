"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconCopy, IconCheck, IconRefresh } from "@/components/icons";

interface ApiKeyCardProps {
  apiKey: string;
  onRegenerate: () => void;
}

export default function ApiKeyCard({ apiKey, onRegenerate }: ApiKeyCardProps) {
  const keyInputRef = useRef<HTMLInputElement>(null);
  const [copiado, setCopiado] = useState(false);

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

  return (
    <Card className="mb-6 bg-[#0e1525] border-[#1e3a5f] text-slate-100 overflow-hidden">
      <CardHeader className="border-[#1e2d42] p-6 pb-4">
        <CardTitle className="text-xs font-bold text-[#3ddc84] tracking-wider uppercase">
          API KEY GLOBAL DE LA CUENTA
        </CardTitle>
        <CardDescription className="text-slate-400">
          Llave UUID única para autorizar consultas externas al motor de búsqueda.
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
    </Card>
  );
}
