"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function ConfigScreen() {
  const { account, regenerateApiKey, updateAccount } = useApp();

  const [copiado, setCopiado] = useState(false);
  const [nombre, setNombre] = useState(account.name);
  const [email, setEmail] = useState(account.email);
  const [guardado, setGuardado] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  function copiar() {
    navigator.clipboard?.writeText(account.apiKey);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    updateAccount({ name: nombre.trim(), email: email.trim() });
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
              <div className="text-xs text-slate-400 mb-1">Clave de Autorización:</div>
              <div className="text-sm font-bold tracking-wider font-mono text-emerald-400 truncate">
                {account.apiKey}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={copiar}
                className="px-4 py-2 text-xs font-bold rounded-lg transition-all"
                style={{ background: copiado ? "#2bc971" : "#3ddc84", color: "#0a1f14" }}
              >
                {copiado ? "✓ Copiado" : "Copiar Key"}
              </button>
              <button
                type="button"
                onClick={() => setShowRegenerateConfirm(true)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-amber-300 bg-amber-950/40 border border-amber-800/60 hover:bg-amber-900/40 transition-colors"
              >
                Regenerar Key
              </button>
            </div>
          </div>

          {/* Ejemplo de cURL */}
          <div className="px-6 py-3.5 bg-slate-950/60 border-t border-slate-900 text-xs font-mono text-slate-400">
            <div className="text-[11px] text-slate-400 mb-1">Ejemplo de consumo del endpoint (Search Service Spec):</div>
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
                  className="px-4 py-2 text-xs font-bold rounded-lg text-white bg-amber-600 hover:bg-amber-700"
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
              <label className="block text-xs font-medium text-slate-600 mb-2">
                EMAIL REGISTRADO
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors font-mono border border-slate-200 bg-slate-50 text-slate-900"
                onFocus={(e) => (e.target.style.borderColor = "#3ddc84")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
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
            <span className="text-xs text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
              ● Vinculado con Google
            </span>
          </div>

          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold rounded-lg transition-all"
              style={{ background: "#3ddc84", color: "#0a1f14" }}
            >
              {guardado ? "✓ Cambios Guardados" : "Guardar Cambios"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
