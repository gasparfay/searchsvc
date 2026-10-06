"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

const IconSites = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);

const IconMonitor = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.8"/>
    <polyline points="6,13 9,9 12,11.5 15,7.5 18,10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconConfig = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NAV = [
  { href: "/sites",   label: "Mis Sitios",    Icon: IconSites   },
  { href: "/monitor", label: "Monitoreo",     Icon: IconMonitor },
  { href: "/config",  label: "Configuración", Icon: IconConfig  },
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
        <Link href="/sites" className="flex items-center gap-3 mb-2 group">
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
        <div className="text-xs" style={{ color: "#3ddc84", letterSpacing: "0.06em" }}>
          ● SISTEMA ACTIVO
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

      {/* User */}
      <div className="px-5 py-4" style={{ borderTop: "1px solid #1e2d42" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: "rgba(61,220,132,0.15)", color: "#3ddc84", border: "1px solid rgba(61,220,132,0.25)" }}>
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: "#c8d8ec" }}>{account.name}</div>
            <div className="text-xs truncate" style={{ color: "#3a5570" }}>{account.email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
