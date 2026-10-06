"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { IconCopy, IconCheck, IconRefresh } from "@/components/icons";
import PageHeader from "@/components/PageHeader";
import PageContainer from "@/components/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import ConfirmModal from "@/components/ConfirmModal";

export default function ConfigPage() {
  const { account } = useApp();

  const keyInputRef = useRef<HTMLInputElement>(null);

  const [copiado, setCopiado] = useState(false);
  const [copiadoCurl, setCopiadoCurl] = useState(false);
  const [nombre, setNombre] = useState(account.name);
  const [guardado, setGuardado] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  const copiar = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(account.apiKey)
        .then(() => {
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2000);
        })
        .catch(() => {
          execCopyFallback();
        });
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
      // fallback below
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = account.apiKey;
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
      // fail silently
    }
  };

  const copiarCurl = () => {
    const curlCmd = `curl -H "Authorization: ${account.apiKey}" "http://localhost:3000/search?q=palabra1+palabra2"`;
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(curlCmd)
        .then(() => {
          setCopiadoCurl(true);
          setTimeout(() => setCopiadoCurl(false), 2000);
        })
        .catch(() => {
          execCurlFallback(curlCmd);
        });
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

  function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  }

  function handleRegenerar() {
    setShowRegenerateConfirm(false);
  }

  return (
    <PageContainer maxWidth="3xl">
      <PageHeader
        breadcrumb="CONFIGURACIÓN / CUENTA"
        title="Configuración de Cuenta"
      />

      {/* Panel 1: API Key Centralizada */}
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
            <div className="flex-1 min-w-0">
              <label htmlFor="apiKeyInput" className="block text-xs text-slate-400 mb-1.5 font-medium">
                Clave de Autorización:
              </label>
              <Input
                id="apiKeyInput"
                ref={keyInputRef}
                type="text"
                readOnly
                value={account.apiKey}
                className="bg-slate-950/80 border-slate-800 text-sm font-bold font-mono tracking-wider text-emerald-400 focus:outline-none select-all cursor-text py-2"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end mb-0.5">
              <Button
                type="button"
                onClick={copiar}
                title="Copiar API Key al portapapeles"
                className={copiado ? "bg-[#2bc971] text-[#0a1f14] ring-2 ring-[#2bc971]/40" : "bg-[#3ddc84] hover:bg-[#2bc971] text-[#0a1f14]"}
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
                onClick={() => setShowRegenerateConfirm(true)}
                className="text-yellow-300 bg-yellow-950/40 border-yellow-400/70 hover:bg-yellow-900/40 hover:border-yellow-300 hover:text-yellow-200"
              >
                <IconRefresh />
                Regenerar Key
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Ejemplo de cURL */}
        <div className="px-6 py-3.5 bg-slate-950/60 border-t border-slate-900 text-xs font-mono text-slate-400">
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
            <span className="text-[11px] text-slate-400">Ejemplo de consumo del endpoint (Search Service Spec):</span>
            <div className="flex items-center gap-3">
              <Link
                href="/playground"
                className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline transition-colors font-mono"
              >
                Probar en Playground →
              </Link>
              <button
                type="button"
                onClick={copiarCurl}
                className="text-[11px] text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1 font-mono cursor-pointer"
              >
                {copiadoCurl ? <IconCheck /> : <IconCopy />}
                {copiadoCurl ? "Copiado!" : "Copiar cURL"}
              </button>
            </div>
          </div>
          <div className="text-slate-300 select-all overflow-x-auto py-1">
            curl -H &quot;Authorization: {account.apiKey}&quot; &quot;http://localhost:3000/search?q=palabra1+palabra2&quot;
          </div>
        </div>
      </Card>

      {/* Modal de confirmación para regenerar API Key */}
      <ConfirmModal
        isOpen={showRegenerateConfirm}
        title="¿Regenerar API Key?"
        description="Se generará un nuevo UUID aleatorio. La clave anterior quedará inmediatamente invalidada y cualquier integración externa dejará de autenticar hasta que se actualice."
        confirmLabel="Sí, Regenerar Llave"
        cancelLabel="Cancelar"
        confirmVariant="default"
        onConfirm={handleRegenerar}
        onCancel={() => setShowRegenerateConfirm(false)}
      />

      {/* Panel 2: Perfil de Usuario */}
      <Card className="overflow-hidden">
        <form onSubmit={handleGuardar}>
          <CardHeader className="flex-row items-center justify-between p-6 border-b border-slate-100 flex-wrap gap-2">
            <div>
              <CardTitle className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                DATOS DE LA CUENTA (ACCOUNT)
              </CardTitle>
              <CardDescription>
                Información general asociada al titular de la cuenta y sus accesos SSO.
              </CardDescription>
            </div>
            <span className="text-xs font-mono text-slate-400">ObjectId: {account._id}</span>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="accountNameInput" className="block text-xs font-medium text-slate-600 mb-2">
                  NOMBRE DEL TITULAR
                </label>
                <Input
                  id="accountNameInput"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="py-2.5 text-sm bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="accountEmailInput" className="text-xs font-medium text-slate-600">
                    EMAIL REGISTRADO
                  </label>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">
                    No editable (SSO)
                  </span>
                </div>
                <Input
                  id="accountEmailInput"
                  type="email"
                  disabled
                  readOnly
                  value={account.email}
                  title="El email proviene del proveedor SSO y no puede modificarse"
                  className="py-2.5 text-sm font-mono bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed select-none"
                />
              </div>
            </div>
          </CardContent>

          {/* Autenticación SSO */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                G
              </div>
              <div>
                <div className="text-xs font-medium text-slate-800">Autenticación Single Sign-On (Auth0)</div>
                <div className="text-xs text-slate-500 font-mono">auth0Id: {account.auth0Id || "Sin vincular"}</div>
              </div>
            </div>
            <Badge variant={account.auth0Id ? "success" : "secondary"} dot>
              {account.auth0Id ? "Vinculado con Google" : "Sin vincular a SSO"}
            </Badge>
          </div>

          <CardFooter className="justify-end">
            <Button type="submit">
              {guardado ? (
                <>
                  <IconCheck />
                  Cambios Guardados
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </PageContainer>
  );
}
