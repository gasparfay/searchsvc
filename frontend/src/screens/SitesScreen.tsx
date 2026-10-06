"use client";

import { useState } from "react";

const SITES = [
  {
    id: "s-001",
    name: "Acme Corporate",
    url: "https://acme.corp",
    depth: 3,
    frequency: "6h",
    status: "active",
    lastCrawl: "2026-09-04 08:12",
    pages: 1842,
    apiKey: "sk-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  },
  {
    id: "s-002",
    name: "Tech Blog Network",
    url: "https://techblog.io",
    depth: 2,
    frequency: "12h",
    status: "active",
    lastCrawl: "2026-09-04 06:00",
    pages: 4391,
    apiKey: "sk-b2c3d4e5-f6a7-8901-bcde-f12345678901",
  },
  {
    id: "s-003",
    name: "Product Docs",
    url: "https://docs.product.dev",
    depth: 4,
    frequency: "24h",
    status: "paused",
    lastCrawl: "2026-09-03 14:30",
    pages: 782,
    apiKey: "sk-c3d4e5f6-a7b8-9012-cdef-123456789012",
  },
  {
    id: "s-004",
    name: "Legal Repository",
    url: "https://legal.acme.corp",
    depth: 2,
    frequency: "48h",
    status: "error",
    lastCrawl: "2026-09-02 09:15",
    pages: 229,
    apiKey: "sk-d4e5f6a7-b8c9-0123-def0-234567890123",
  },
  {
    id: "s-005",
    name: "Internal Wiki",
    url: "https://wiki.internal.acme.corp",
    depth: 3,
    frequency: "12h",
    status: "active",
    lastCrawl: "2026-09-04 07:45",
    pages: 3104,
    apiKey: "sk-e5f6a7b8-c9d0-1234-ef01-345678901234",
  },
];

const statusStyle: Record<string, string> = {
  active: "text-[#e8ff47] border-[#e8ff47]",
  paused: "text-[#888] border-[#2a2a2a]",
  error: "text-[#ff5733] border-[#ff5733]",
};

const statusDot: Record<string, string> = {
  active: "bg-[#e8ff47]",
  paused: "bg-[#888]",
  error: "bg-[#ff5733]",
};

export default function SitesScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", url: "", depth: "2", frequency: "12h" });

  const selectedSite = SITES.find((s) => s.id === selected);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: table */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
          <div>
            <h1 className="font-mono text-sm font-bold tracking-widest text-[#f0f0f0]">REGISTERED SITES</h1>
            <p className="font-mono text-xs text-[#888] mt-0.5">{SITES.length} sites configured</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#e8ff47] text-[#0a0a0a] font-mono text-xs font-bold tracking-widest hover:bg-[#d4eb3a] transition-colors"
          >
            + NEW SITE
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                {["SITE", "URL", "DEPTH", "FREQ", "LAST CRAWL", "PAGES", "STATUS", ""].map((h) => (
                  <th key={h} className="px-6 py-3 font-mono text-xs text-[#888] tracking-widest font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SITES.map((site) => (
                <tr
                  key={site.id}
                  onClick={() => setSelected(site.id === selected ? null : site.id)}
                  className={`border-b border-[#1a1a1a] cursor-pointer transition-colors ${
                    selected === site.id ? "bg-[#1a1a1a]" : "hover:bg-[#111]"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="font-sans text-sm font-medium text-[#f0f0f0]">{site.name}</div>
                    <div className="font-mono text-xs text-[#888] mt-0.5">{site.id}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[#888]">{site.url}</td>
                  <td className="px-6 py-4 font-mono text-sm text-[#f0f0f0]">{site.depth}</td>
                  <td className="px-6 py-4 font-mono text-xs text-[#e8ff47]">{site.frequency}</td>
                  <td className="px-6 py-4 font-mono text-xs text-[#888]">{site.lastCrawl}</td>
                  <td className="px-6 py-4 font-mono text-sm text-[#f0f0f0]">{site.pages.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 border font-mono text-xs tracking-widest ${statusStyle[site.status]}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[site.status]}`} />
                      {site.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="font-mono text-xs text-[#888] hover:text-[#f0f0f0] transition-colors">
                      ···
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: detail panel */}
      {selectedSite && (
        <div className="w-80 border-l border-[#2a2a2a] flex flex-col overflow-y-auto bg-[#111]">
          <div className="px-5 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
            <span className="font-mono text-xs text-[#888] tracking-widest">SITE DETAIL</span>
            <button
              onClick={() => setSelected(null)}
              className="font-mono text-xs text-[#888] hover:text-[#f0f0f0]"
            >
              ✕
            </button>
          </div>

          <div className="p-5 flex flex-col gap-5">
            <div>
              <div className="font-sans text-base font-semibold text-[#f0f0f0]">{selectedSite.name}</div>
              <div className="font-mono text-xs text-[#888] mt-1">{selectedSite.url}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "CRAWL DEPTH", value: selectedSite.depth },
                { label: "FREQUENCY", value: selectedSite.frequency },
                { label: "PAGES INDEXED", value: selectedSite.pages.toLocaleString() },
                { label: "STATUS", value: selectedSite.status.toUpperCase() },
              ].map((f) => (
                <div key={f.label} className="border border-[#2a2a2a] p-3">
                  <div className="font-mono text-xs text-[#888] tracking-widest mb-1">{f.label}</div>
                  <div className="font-mono text-sm font-bold text-[#e8ff47]">{f.value}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="font-mono text-xs text-[#888] tracking-widest mb-2">LAST CRAWL</div>
              <div className="font-mono text-xs text-[#f0f0f0]">{selectedSite.lastCrawl}</div>
            </div>

            <div>
              <div className="font-mono text-xs text-[#888] tracking-widest mb-2">API KEY</div>
              <div className="border border-[#2a2a2a] p-3 font-mono text-xs text-[#888] break-all leading-relaxed">
                {selectedSite.apiKey.slice(0, 20)}...
              </div>
              <button className="mt-2 w-full py-1.5 border border-[#2a2a2a] font-mono text-xs text-[#888] hover:border-[#e8ff47] hover:text-[#e8ff47] transition-colors">
                REVEAL / COPY
              </button>
            </div>

            <div className="border border-[#2a2a2a] p-3">
              <div className="font-mono text-xs text-[#888] tracking-widest mb-3">DOCUMENT EXTRACTOR</div>
              <pre className="font-mono text-xs text-[#e8ff47] leading-relaxed overflow-x-auto whitespace-pre-wrap">{`function extract(req, res) {
  let $ = ...
  return [{
    name: $('title').text(),
    url: req.url,
    description: $('meta[name="description"]')
      .attr('content')
  }]
}`}</pre>
            </div>

            <div className="flex gap-2 mt-auto">
              <button className="flex-1 py-2 border border-[#2a2a2a] font-mono text-xs text-[#888] hover:border-[#f0f0f0] hover:text-[#f0f0f0] transition-colors">
                PAUSE
              </button>
              <button className="flex-1 py-2 bg-[#e8ff47] text-[#0a0a0a] font-mono text-xs font-bold hover:bg-[#d4eb3a] transition-colors">
                CRAWL NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Site Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#111] border border-[#2a2a2a] w-full max-w-lg mx-4">
            <div className="px-6 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
              <span className="font-mono text-sm font-bold tracking-widest">NEW SITE</span>
              <button onClick={() => setShowModal(false)} className="font-mono text-xs text-[#888] hover:text-[#f0f0f0]">✕</button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              {[
                { label: "SITE NAME", key: "name", placeholder: "Acme Corporate Portal" },
                { label: "ROOT URL", key: "url", placeholder: "https://acme.corp" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="font-mono text-xs text-[#888] tracking-widest block mb-2">{f.label}</label>
                  <input
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2 font-mono text-sm text-[#f0f0f0] placeholder:text-[#444] focus:outline-none focus:border-[#e8ff47]"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs text-[#888] tracking-widest block mb-2">CRAWL DEPTH</label>
                  <select
                    value={form.depth}
                    onChange={(e) => setForm({ ...form, depth: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2 font-mono text-sm text-[#f0f0f0] focus:outline-none focus:border-[#e8ff47]"
                  >
                    {["1", "2", "3", "4", "5"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-xs text-[#888] tracking-widest block mb-2">FREQUENCY</label>
                  <select
                    value={form.frequency}
                    onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2 font-mono text-sm text-[#f0f0f0] focus:outline-none focus:border-[#e8ff47]"
                  >
                    {["1h", "6h", "12h", "24h", "48h", "168h"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-[#2a2a2a] font-mono text-xs text-[#888] hover:border-[#f0f0f0] hover:text-[#f0f0f0] transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-[#e8ff47] text-[#0a0a0a] font-mono text-xs font-bold hover:bg-[#d4eb3a] transition-colors"
                >
                  REGISTER SITE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
