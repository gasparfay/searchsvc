"use client";

import { useState } from "react";
import { MOCK_ACCOUNT } from "@/data/mock-data";

export default function ConfigScreen() {
  const [apiKey] = useState(MOCK_ACCOUNT.apiKey);
  const [copiado, setCopiado] = useState(false);
  const [nombre, setNombre] = useState(MOCK_ACCOUNT.name);
  const [email, setEmail] = useState(MOCK_ACCOUNT.email);
  const [guardado, setGuardado] = useState(false);

  function copiar() {
    navigator.clipboard?.writeText(apiKey);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  }

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#f0f2f6" }}>
      <div className="px-10 py-8 max-w-3xl">

        <div className="text-xs mb-1.5" style={{ color: "#94a3b8", letterSpacing: "0.08em" }}>CONFIGURACIÓN / CUENTA</div>
        <h1 className="text-2xl font-bold mb-8" style={{ color: "#0f172a" }}>Configuración</h1>

        {/* API Key */}
        <div className="rounded-xl mb-5" style={{ background: "#0e1525", border: "1px solid #1e3a5f" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #1e2d42" }}>
            <div className="text-xs font-bold" style={{ color: "#3ddc84", letterSpacing: "0.08em" }}>API KEY GLOBAL DE LA CUENTA</div>
            <div className="text-xs mt-0.5" style={{ color: "#3a5570" }}>
              Identificador UUID asignado a tu cuenta para autenticar requests al endpoint GET /search.
            </div>
          </div>
          <div className="px-6 py-5 flex items-center justify-between gap-4">
            <div className="text-sm font-bold tracking-wider font-mono" style={{ color: "#e2e8f4" }}>{apiKey}</div>
            <div className="flex gap-2 shrink-0">
              <button onClick={copiar}
                className="px-4 py-2 text-xs font-bold rounded transition-all"
                style={{ background: copiado ? "#2bc971" : "#3ddc84", color: "#0a1f14" }}>
                {copiado ? "✓ Copiado" : "Copiar Key"}
              </button>
            </div>
          </div>
        </div>

        {/* Perfil */}
        <form onSubmit={handleGuardar} className="rounded-xl mb-5" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold" style={{ color: "#0f172a", letterSpacing: "0.06em" }}>PERFIL DE USUARIO (ACCOUNT)</div>
            <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>ID: {MOCK_ACCOUNT._id}</span>
          </div>
          <div className="px-6 py-6 grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "#475569", letterSpacing: "0.04em" }}>NOMBRE COMPLETO</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                onFocus={(e) => (e.target.style.borderColor = "#3ddc84")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "#475569", letterSpacing: "0.04em" }}>EMAIL REGISTRADO</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors font-mono"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                onFocus={(e) => (e.target.style.borderColor = "#3ddc84")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")} />
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
                <div className="text-xs text-slate-500 font-mono">ID: {MOCK_ACCOUNT.auth0Id}</div>
              </div>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-medium">
              ● Vinculado
            </span>
          </div>

          <div className="px-6 py-4 flex items-center justify-end">
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
