"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

import { IconSites, IconMonitor, IconPlayground, IconConfig } from "@/components/icons";

const NAV = [
  { href: "/sites",      label: "Mis Sitios",     Icon: IconSites      },
  { href: "/monitor",    label: "Monitoreo",      Icon: IconMonitor    },
  { href: "/playground", label: "Playground API", Icon: IconPlayground },
  { href: "/config",     label: "Configuración",  Icon: IconConfig     },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const { account } = useApp();

  const initials = account.name
    ? account.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "JS";

  return (
    <aside className="flex flex-col h-full shrink-0" style={{
      width: 270,
      background: "#0e1525",
      borderRight: "1px solid #162032",
    }}>
      {/* Logo */}
      <div className="px-6 pt-7 pb-6" style={{ borderBottom: "1px solid #1e2d42" }}>
        <Link href="/sites" className="flex items-center gap-3 mb-4 group">
          <div className="w-9 h-9 flex items-center justify-center shrink-0" style={{
            background: "#3ddc84",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}>
            <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
              <circle cx="5" cy="5" r="3.2" stroke="#0e1525" strokeWidth="1.6"/>
              <line x1="7.5" y1="7.5" x2="10.5" y2="10.5" stroke="#0e1525" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-base font-bold tracking-wider" style={{ color: "#e2e8f4" }}>SEARCHSVC</span>
        </Link>
        <div className="text-xs flex items-center gap-1.5" style={{ color: "#3ddc84", letterSpacing: "0.06em" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          SISTEMA ACTIVO
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-4 flex flex-col gap-1 overflow-y-auto">
        {NAV.map(({ href, label, Icon }) => {
          const isActive =
            href === "/sites"
              ? pathname === "/" || pathname.startsWith("/sites")
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3.5 px-4 py-3 rounded text-sm text-left w-full transition-all"
              style={{
                background:    isActive ? "rgba(61,220,132,0.12)" : "transparent",
                color:         isActive ? "#3ddc84" : "#5a7a9a",
                borderLeft:    isActive ? "3px solid #3ddc84" : "3px solid transparent",
                letterSpacing: "0.03em",
                fontWeight:    isActive ? 600 : 400,
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = "#a0bcd8"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = "#5a7a9a"; e.currentTarget.style.background = "transparent"; } }}
            >
              <span style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User profile card -> links to /config */}
      <div className="px-3 py-3" style={{ borderTop: "1px solid #1e2d42" }}>
        <Link
          href="/config"
          className="flex items-center gap-3 p-2 rounded-lg transition-all group hover:bg-slate-800/60"
          title="Ver y configurar cuenta"
          style={{
            background: pathname === "/config" ? "rgba(61,220,132,0.08)" : "transparent",
          }}
        >
          <div className="w-9 h-9 rounded flex items-center justify-center text-xs font-bold shrink-0 transition-transform group-hover:scale-105"
            style={{ background: "rgba(61,220,132,0.15)", color: "#3ddc84", border: "1px solid rgba(61,220,132,0.25)" }}>
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate group-hover:text-emerald-400 transition-colors" style={{ color: "#c8d8ec" }}>{account.name}</div>
            <div className="text-xs truncate" style={{ color: "#5a7a9a" }}>{account.email}</div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
