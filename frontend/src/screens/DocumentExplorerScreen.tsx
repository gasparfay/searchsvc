"use client";

import { useState } from "react";

const ALL_DOCS = [
  {
    id: "doc-00192",
    site: "Acme Corporate",
    snapshot: "snap-20260904-0233",
    name: "About Acme — Our Mission and Values",
    url: "https://acme.corp/about",
    description: "Acme Corporation is a global leader in enterprise solutions. Our mission is to empower businesses through technology and innovation. Founded in 1998, we serve over 12,000 customers worldwide.",
    crawledAt: "2026-09-04 02:14",
  },
  {
    id: "doc-00193",
    site: "Acme Corporate",
    snapshot: "snap-20260904-0233",
    name: "Acme Enterprise Suite — Product Overview",
    url: "https://acme.corp/products/enterprise",
    description: "The Acme Enterprise Suite provides a comprehensive set of tools for large organizations. Includes CRM, ERP, analytics, and API integrations. Enterprise pricing available.",
    crawledAt: "2026-09-04 02:18",
  },
  {
    id: "doc-00194",
    site: "Acme Corporate",
    snapshot: "snap-20260904-0233",
    name: "Customer Support Portal",
    url: "https://acme.corp/support",
    description: "Access support tickets, documentation, and live chat assistance. Our enterprise support team is available 24/7. Submit a ticket or call 1-800-ACME-HELP.",
    crawledAt: "2026-09-04 02:21",
  },
  {
    id: "doc-04112",
    site: "Tech Blog Network",
    snapshot: "snap-20260904-0642",
    name: "Distributed Crawling at Scale — Architecture Deep Dive",
    url: "https://techblog.io/posts/distributed-crawling-2026",
    description: "How modern web crawlers handle billions of pages using distributed queues, deduplication hashing, and politeness policies. Includes benchmarks for Node.js vs Go crawlers.",
    crawledAt: "2026-09-04 06:15",
  },
  {
    id: "doc-04113",
    site: "Tech Blog Network",
    snapshot: "snap-20260904-0642",
    name: "Building a Search Index with MongoDB Atlas Search",
    url: "https://techblog.io/posts/mongodb-atlas-search-guide",
    description: "Step-by-step guide to setting up full-text search with MongoDB Atlas. Covers index configuration, $search aggregation operators, and relevance scoring with Lucene.",
    crawledAt: "2026-09-04 06:22",
  },
  {
    id: "doc-02871",
    site: "Internal Wiki",
    snapshot: "snap-20260904-0803",
    name: "Engineering Onboarding — Getting Started",
    url: "https://wiki.internal.acme.corp/eng/onboarding",
    description: "New engineers should complete this guide within their first two weeks. Covers repository access, dev environment setup, Slack channels, and the code review process.",
    crawledAt: "2026-09-04 07:52",
  },
  {
    id: "doc-02872",
    site: "Internal Wiki",
    snapshot: "snap-20260904-0803",
    name: "API Design Standards and Conventions",
    url: "https://wiki.internal.acme.corp/eng/api-standards",
    description: "All REST APIs at Acme must follow these conventions: versioning via path prefix, JSON responses with consistent error envelopes, OAuth 2.0 for auth, and OpenAPI 3.1 specs.",
    crawledAt: "2026-09-04 07:55",
  },
  {
    id: "doc-02873",
    site: "Internal Wiki",
    snapshot: "snap-20260904-0803",
    name: "Incident Response Runbook — P0 and P1",
    url: "https://wiki.internal.acme.corp/ops/incident-runbook",
    description: "P0 incidents require a bridge call within 5 minutes. Page the on-call SRE, notify #incidents channel, and open a war room document. This runbook covers escalation paths and post-mortems.",
    crawledAt: "2026-09-04 07:58",
  },
];

const SNAPSHOTS = [
  { id: "all", label: "ALL SNAPSHOTS", count: ALL_DOCS.length },
  { id: "snap-20260904-0803", label: "Internal Wiki · Sep 4", count: 3098 },
  { id: "snap-20260904-0642", label: "Tech Blog · Sep 4", count: 4229 },
  { id: "snap-20260904-0233", label: "Acme Corp · Sep 4", count: 1835 },
  { id: "snap-20260903-1440", label: "Product Docs · Sep 3", count: 780 },
];

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === query.trim().toLowerCase() ? (
      <mark key={i} className="bg-[#e8ff47] text-[#0a0a0a] px-0.5">
        {p}
      </mark>
    ) : (
      p
    )
  );
}

export default function DocumentExplorerScreen() {
  const [query, setQuery] = useState("");
  const [snapshot, setSnapshot] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = ALL_DOCS.filter((d) => {
    const matchSnap = snapshot === "all" || d.snapshot === snapshot;
    const q = query.toLowerCase().trim();
    const matchQ =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.url.toLowerCase().includes(q);
    return matchSnap && matchQ;
  });

  const selectedDoc = ALL_DOCS.find((d) => d.id === selected);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left sidebar: snapshot filter */}
      <div className="w-56 border-r border-[#2a2a2a] flex flex-col shrink-0 overflow-y-auto bg-[#0a0a0a]">
        <div className="px-4 py-4 border-b border-[#2a2a2a]">
          <span className="font-mono text-xs text-[#888] tracking-widest">SNAPSHOTS</span>
        </div>
        <div className="flex flex-col">
          {SNAPSHOTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSnapshot(s.id)}
              className={`text-left px-4 py-3 border-b border-[#1a1a1a] transition-colors ${
                snapshot === s.id ? "bg-[#1a1a1a] border-l-2 border-l-[#e8ff47]" : "hover:bg-[#111]"
              }`}
            >
              <div className={`font-sans text-xs font-medium ${snapshot === s.id ? "text-[#f0f0f0]" : "text-[#888]"}`}>
                {s.label}
              </div>
              <div className="font-mono text-xs text-[#444] mt-0.5">{s.count.toLocaleString()} docs</div>
            </button>
          ))}
        </div>

        <div className="mt-auto p-4 border-t border-[#2a2a2a]">
          <div className="font-mono text-xs text-[#888] tracking-widest mb-2">API KEY</div>
          <div className="font-mono text-xs text-[#444] break-all">sk-a1b2c3d4...</div>
          <div className="mt-3 font-mono text-xs text-[#888] tracking-widest mb-1">SEARCH ENDPOINT</div>
          <div className="font-mono text-xs text-[#444] break-all">GET /search?q=...</div>
        </div>
      </div>

      {/* Center: search + results */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search bar */}
        <div className="px-6 py-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center border border-[#2a2a2a] focus-within:border-[#e8ff47] transition-colors bg-[#111]">
              <span className="pl-4 font-mono text-xs text-[#888]">GET /search?q=</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="enterprise api standards..."
                className="flex-1 bg-transparent px-2 py-3 font-mono text-sm text-[#f0f0f0] placeholder:text-[#444] focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="px-3 font-mono text-xs text-[#888] hover:text-[#f0f0f0]"
                >
                  ✕
                </button>
              )}
              <button className="px-4 py-3 bg-[#e8ff47] text-[#0a0a0a] font-mono text-xs font-bold hover:bg-[#d4eb3a] transition-colors">
                SEARCH
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="font-mono text-xs text-[#888]">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              {query && ` for "${query}"`}
            </span>
            {query && (
              <span className="font-mono text-xs text-[#e8ff47]">
                Authorization: sk-a1b2c3d4-e5f6-7890-abcd...
              </span>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="font-mono text-4xl text-[#2a2a2a]">∅</div>
              <div className="font-mono text-sm text-[#888]">No documents match your query.</div>
            </div>
          ) : (
            filtered.map((doc, idx) => (
              <div
                key={doc.id}
                onClick={() => setSelected(doc.id === selected ? null : doc.id)}
                className={`px-6 py-5 border-b border-[#1a1a1a] cursor-pointer transition-colors ${
                  selected === doc.id ? "bg-[#1a1a1a]" : "hover:bg-[#0f0f0f]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="font-mono text-xs text-[#2a2a2a] mt-0.5 w-8 shrink-0 text-right">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-sans text-sm font-semibold text-[#f0f0f0] mb-1">
                      {highlight(doc.name, query)}
                    </div>
                    <div className="font-mono text-xs text-[#e8ff47] mb-2 truncate">
                      {highlight(doc.url, query)}
                    </div>
                    <div className="font-sans text-xs text-[#888] leading-relaxed line-clamp-2">
                      {highlight(doc.description, query)}
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="font-mono text-xs text-[#444]">{doc.site}</span>
                      <span className="text-[#2a2a2a]">·</span>
                      <span className="font-mono text-xs text-[#444]">{doc.snapshot}</span>
                      <span className="text-[#2a2a2a]">·</span>
                      <span className="font-mono text-xs text-[#444]">{doc.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right: doc detail */}
      {selectedDoc && (
        <div className="w-80 border-l border-[#2a2a2a] flex flex-col bg-[#111] overflow-y-auto shrink-0">
          <div className="px-5 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
            <span className="font-mono text-xs text-[#888] tracking-widest">DOCUMENT</span>
            <button onClick={() => setSelected(null)} className="font-mono text-xs text-[#888] hover:text-[#f0f0f0]">
              ✕
            </button>
          </div>

          <div className="p-5 flex flex-col gap-5">
            <div>
              <div className="font-sans text-sm font-semibold text-[#f0f0f0] leading-snug mb-2">
                {selectedDoc.name}
              </div>
              <a
                href={selectedDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[#e8ff47] break-all hover:underline"
              >
                {selectedDoc.url}
              </a>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "SITE", value: selectedDoc.site },
                { label: "DOC ID", value: selectedDoc.id },
                { label: "CRAWLED AT", value: selectedDoc.crawledAt },
                { label: "SNAPSHOT", value: selectedDoc.snapshot },
              ].map((f) => (
                <div key={f.label} className="border border-[#2a2a2a] px-3 py-2">
                  <div className="font-mono text-xs text-[#888] tracking-widest mb-0.5">{f.label}</div>
                  <div className="font-mono text-xs text-[#f0f0f0] break-all">{f.value}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="font-mono text-xs text-[#888] tracking-widest mb-2">DESCRIPTION</div>
              <div className="font-sans text-xs text-[#888] leading-relaxed">{selectedDoc.description}</div>
            </div>

            <div>
              <div className="font-mono text-xs text-[#888] tracking-widest mb-2">JSON RESPONSE</div>
              <pre className="font-mono text-xs text-[#4ade80] bg-[#0a0a0a] border border-[#2a2a2a] p-3 overflow-x-auto leading-relaxed whitespace-pre-wrap">{JSON.stringify(
                {
                  id: selectedDoc.id,
                  name: selectedDoc.name,
                  url: selectedDoc.url,
                  description: selectedDoc.description.slice(0, 60) + "...",
                },
                null,
                2
              )}</pre>
            </div>

            <button className="py-2 border border-[#2a2a2a] font-mono text-xs text-[#888] hover:border-[#e8ff47] hover:text-[#e8ff47] transition-colors">
              OPEN IN BROWSER ↗
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
