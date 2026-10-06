"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function ConfigScreen() {
  const { account, regenerateApiKey, updateAccount } = useApp();

  const keyInputRef = useRef<HTMLInputElement>(null);

  const [copiado, setCopiado] = useState(false);
  const [copiadoCurl, setCopiadoCurl] = useState(false);
  const [nombre, setNombre] = useState(account.name);
  const [guardado, setGuardado] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  const copiar = () => {
    // 1. Direct synchronous call to retain transient user gesture
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
      // ignore
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = account.apiKey;
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.width = "2em";
      textarea.style.height = "2em";
      textarea.style.padding = "0";
      textarea.style.border = "none";
      textarea.style.outline = "none";
      textarea.style.boxShadow = "none";
      textarea.style.background = "transparent";
      textarea.style.opacity = "0.01";
      textarea.style.zIndex = "99999";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, 99999);
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // fail
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
    updateAccount({ name: nombre.trim() });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  }

  function handleRegenerar() {
    regenerateApiKey();
    setShowRegenerateConfirm(false);
    setCopiado(false);
  }

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#f0f2f6" }}>
      <div className="px-10 py-8 max-w-3xl">

        <div className="text-xs mb-1.5" style={{ color: "#94a3b8", letterSpacing: "0.08em" }}>
          CONFIGURACIÓN / CUENTA
        </div>
        <h1 className="text-2xl font-bold mb-8" style={{ color: "#0f172a" }}>
          Configuración de Cuenta
        </h1>

        {/* Panel 1: API Key Centralizada */}
        <div className="rounded-xl mb-6 shadow-xs overflow-hidden" style={{ background: "#0e1525", border: "1px solid #1e3a5f" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #1e2d42" }}>
            <div className="text-xs font-bold" style={{ color: "#3ddc84", letterSpacing: "0.08em" }}>
              API KEY GLOBAL DE LA CUENTA
            </div>
            <div className="text-xs mt-1 text-slate-400">
              Llave UUID única para autorizar consultas externas al motor de búsqueda (<code className="text-slate-300">GET /search?q=...</code>).
            </div>
          </div>

          <div className="px-6 py-5 flex items-center justify-between gap-4">
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
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2 text-sm font-bold font-mono tracking-wider text-emerald-400 focus:outline-none focus:border-emerald-500/50 select-all cursor-text"
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
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Copiar Key
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowRegenerateConfirm(true)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-yellow-300 bg-yellow-950/40 border-2 border-yellow-400 hover:bg-yellow-900/40 hover:border-yellow-300 transition-all inline-flex items-center gap-1.5 shadow-xs"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
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
        {showRegenerateConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-xl p-6 shadow-2xl bg-white border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-2">¿Regenerar API Key?</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Se generará un nuevo UUID aleatorio. La clave anterior quedará inmediatamente invalidada y cualquier integración externa dejará de autenticar hasta que se actualice.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegenerateConfirm(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleRegenerar}
                  className="px-4 py-2 text-xs font-bold rounded-lg text-slate-950 bg-yellow-400 hover:bg-yellow-500 border border-yellow-500 shadow-xs"
                >
                  Sí, Regenerar Llave
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Panel 2: Perfil de Usuario */}
        <form onSubmit={handleGuardar} className="rounded-xl shadow-xs overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold text-slate-900 tracking-wider">
              DATOS DE LA CUENTA (ACCOUNT)
            </div>
            <span className="text-xs font-mono text-slate-400">ObjectId: {account._id}</span>
          </div>

          <div className="p-6 grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                NOMBRE DEL TITULAR
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors border border-slate-200 bg-slate-50 text-slate-900"
                onFocus={(e) => (e.target.style.borderColor = "#3ddc84")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
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
            <span className="text-xs text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Vinculado con Google
            </span>
          </div>

          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold rounded-lg transition-all inline-flex items-center gap-1.5"
              style={{ background: "#3ddc84", color: "#0a1f14" }}
            >
              {guardado ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Cambios Guardados
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
