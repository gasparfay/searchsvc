"use client";

import { useState } from "react";

export default function ConfigScreen() {
  const [apiKey] = useState("123e4567-e89b-12d3-a456-426614174000");
  const [copiado, setCopiado] = useState(false);
  const [nombre, setNombre] = useState("jason.sweet");
  const [email, setEmail] = useState("jason.sweet@acme.corp");
  const [notif, setNotif] = useState(true);
  const [retries, setRetries] = useState("3");
  const [timeout, setTimeout_] = useState("30");

  function copiar() { setCopiado(true); setTimeout(() => setCopiado(false), 2000); }

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#f0f2f6" }}>
      <div className="px-10 py-8 max-w-3xl">

        <div className="text-xs mb-1.5" style={{ color: "#94a3b8", letterSpacing: "0.08em" }}>CONFIGURACIÓN / CUENTA</div>
        <h1 className="text-2xl font-bold mb-8" style={{ color: "#0f172a" }}>Configuración</h1>

        {/* API Key */}
        <div className="rounded-xl mb-5" style={{ background: "#0e1525", border: "1px solid #1e3a5f" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #1e2d42" }}>
            <div className="text-xs font-bold" style={{ color: "#3ddc84", letterSpacing: "0.08em" }}>API KEY GLOBAL</div>
            <div className="text-xs mt-0.5" style={{ color: "#3a5570" }}>Usá esta clave para autenticar requests al endpoint de búsqueda.</div>
          </div>
          <div className="px-6 py-5 flex items-center justify-between gap-4">
            <div className="text-sm font-bold tracking-wider" style={{ color: "#e2e8f4" }}>{apiKey}</div>
            <div className="flex gap-2 shrink-0">
              <button onClick={copiar}
                className="px-4 py-2 text-xs font-bold rounded transition-all"
                style={{ background: copiado ? "#2bc971" : "#3ddc84", color: "#0a1f14" }}>
                {copiado ? "✓ Copiado" : "Copiar"}
              </button>
              <button className="px-4 py-2 text-xs rounded transition-all"
                style={{ background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}>
                Regenerar
              </button>
            </div>
          </div>
        </div>

        {/* Perfil */}
        <div className="rounded-xl mb-5" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold" style={{ color: "#0f172a", letterSpacing: "0.06em" }}>PERFIL DE USUARIO</div>
          </div>
          <div className="px-6 py-6 grid grid-cols-2 gap-5">
            {[
              { label: "NOMBRE DE USUARIO", val: nombre, set: setNombre },
              { label: "EMAIL",             val: email,  set: setEmail  },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-medium mb-2" style={{ color: "#475569", letterSpacing: "0.04em" }}>{f.label}</label>
                <input value={f.val} onChange={(e) => f.set(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                  onFocus={(e) => (e.target.style.borderColor = "#3ddc84")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")} />
              </div>
            ))}
          </div>
        </div>

        {/* Crawling */}
        <div className="rounded-xl mb-5" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="text-xs font-bold" style={{ color: "#0f172a", letterSpacing: "0.06em" }}>PARÁMETROS DE CRAWLING</div>
          </div>
          <div className="px-6 py-6 grid grid-cols-2 gap-5">
            {[
              { label: "REINTENTOS POR FALLO", val: retries,  set: setRetries,  placeholder: "3" },
              { label: "TIMEOUT (segundos)",   val: timeout,  set: setTimeout_, placeholder: "30" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-medium mb-2" style={{ color: "#475569", letterSpacing: "0.04em" }}>{f.label}</label>
                <input type="number" value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder}
                  className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                  onFocus={(e) => (e.target.style.borderColor = "#3ddc84")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")} />
              </div>
            ))}
          </div>
          <div className="px-6 pb-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium" style={{ color: "#0f172a" }}>Notificaciones por email al fallar</div>
              <div className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>Recibís un email cuando una corrida termina en error.</div>
            </div>
            <button onClick={() => setNotif(!notif)}
              className="relative w-12 h-6 rounded-full transition-all"
              style={{ background: notif ? "#3ddc84" : "#e2e8f0" }}>
              <span className="absolute top-1 w-4 h-4 rounded-full transition-all"
                style={{ background: "#fff", left: notif ? "26px" : "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </button>
          </div>
        </div>

        {/* Guardar */}
        <div className="flex justify-end">
          <button className="px-6 py-3 text-sm font-bold rounded-lg transition-all"
            style={{ background: "#3ddc84", color: "#0a1f14" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2bc971")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3ddc84")}>
            Guardar cambios →
          </button>
        </div>
      </div>
    </div>
  );
}
