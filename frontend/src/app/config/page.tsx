"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { IconCopy, IconCheck, IconRefresh } from "@/components/icons";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmModal from "@/components/ConfirmModal";
import { Button } from "@/components/ui/button";

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
    // Modo maquetado: decorativo, no muta la cuenta
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  }

  function handleRegenerar() {
    // Modo maquetado: decorativo, cierra el modal sin regenerar
    setShowRegenerateConfirm(false);
  }


  return (
    <div className="h-full overflow-y-auto bg-slate-100">
      <div className="px-10 py-8 max-w-3xl">
        <PageHeader
          breadcrumb="CONFIGURACIÓN / CUENTA"
          title="Configuración de Cuenta"
        />

        {/* Panel 1: API Key Centralizada */}
        <div className="rounded-xl mb-6 shadow-xs overflow-hidden bg-[#0e1525] border border-[#1e3a5f]">
          <div className="px-6 py-4 border-b border-[#1e2d42]">
            <div className="text-xs font-bold text-[#3ddc84] tracking-wider">
              API KEY GLOBAL DE LA CUENTA
            </div>
            <div className="text-xs mt-1 text-slate-400">
              Llave UUID única para autorizar consultas externas al motor de búsqueda (<code className="text-slate-300">GET /search?q=...</code>).
            </div>
          </div>

          <div className="px-6 py-5 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex-1 min-w-0">
              <label htmlFor="apiKeyInput" className="block text-xs text-slate-400 mb-1.5 font-medium">
                Clave de Autorización:
              </label>
              <input
                id="apiKeyInput"
                ref={keyInputRef}
                type="text"
                readOnly
                value={account.apiKey}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2 text-sm font-bold font-mono tracking-wider text-emerald-400 focus:outline-none select-all cursor-text"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end mb-0.5">
              <button
                type="button"
                onClick={copiar}
                title="Copiar API Key al portapapeles"
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 ${
                  copiado
                    ? "bg-[#2bc971] text-[#0a1f14] ring-2 ring-[#2bc971]/40"
                    : "bg-[#3ddc84] hover:bg-[#2bc971] text-[#0a1f14]"
                }`}
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
              </button>
              <button
                type="button"
                onClick={() => setShowRegenerateConfirm(true)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-yellow-300 bg-yellow-950/40 border-2 border-yellow-400 hover:bg-yellow-900/40 hover:border-yellow-300 transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <IconRefresh />
                Regenerar Key
              </button>
            </div>
          </div>

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
        </div>

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
        <form onSubmit={handleGuardar} className="rounded-xl shadow-xs overflow-hidden bg-white border border-slate-200">
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
            <div className="text-xs font-bold text-slate-900 tracking-wider">
              DATOS DE LA CUENTA (ACCOUNT)
            </div>
            <span className="text-xs font-mono text-slate-400">ObjectId: {account._id}</span>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                NOMBRE DEL TITULAR
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors border border-slate-200 bg-slate-50 text-slate-900 focus:border-emerald-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-600">
                  EMAIL REGISTRADO
                </label>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">
                  No editable (SSO)
                </span>
              </div>
              <input
                type="email"
                disabled
                readOnly
                value={account.email}
                title="El email proviene del proveedor SSO y no puede modificarse"
                className="w-full px-4 py-3 text-sm rounded-lg font-mono border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed select-none"
              />
            </div>
          </div>

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
            <StatusBadge variant={account.auth0Id ? "success" : "neutral"}>
              {account.auth0Id ? "Vinculado con Google" : "Sin vincular a SSO"}
            </StatusBadge>

          </div>

          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end">
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
          </div>
        </form>
      </div>
    </div>
  );
}
