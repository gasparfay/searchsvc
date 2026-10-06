"use client";

import { useState } from "react";

const JOBS = [
  {
    id: "job-9182",
    site: "Acme Corporate",
    siteId: "s-001",
    status: "running",
    startedAt: "2026-09-04 08:12:03",
    duration: "14m 32s",
    progress: 68,
    pagesVisited: 1251,
    pagesTotal: 1842,
    docsExtracted: 1180,
    errors: 3,
    snapshot: null,
  },
  {
    id: "job-9181",
    site: "Tech Blog Network",
    siteId: "s-002",
    status: "completed",
    startedAt: "2026-09-04 06:00:01",
    duration: "42m 11s",
    progress: 100,
    pagesVisited: 4391,
    pagesTotal: 4391,
    docsExtracted: 4229,
    errors: 12,
    snapshot: "snap-20260904-0642",
  },
  {
    id: "job-9180",
    site: "Internal Wiki",
    siteId: "s-005",
    status: "completed",
    startedAt: "2026-09-04 07:45:00",
    duration: "18m 44s",
    progress: 100,
    pagesVisited: 3104,
    pagesTotal: 3104,
    docsExtracted: 3098,
    errors: 0,
    snapshot: "snap-20260904-0803",
  },
  {
    id: "job-9179",
    site: "Legal Repository",
    siteId: "s-004",
    status: "failed",
    startedAt: "2026-09-02 09:15:00",
    duration: "2m 03s",
    progress: 14,
    pagesVisited: 32,
    pagesTotal: 229,
    docsExtracted: 28,
    errors: 47,
    snapshot: null,
  },
  {
    id: "job-9178",
    site: "Product Docs",
    siteId: "s-003",
    status: "completed",
    startedAt: "2026-09-03 14:30:00",
    duration: "9m 57s",
    progress: 100,
    pagesVisited: 782,
    pagesTotal: 782,
    docsExtracted: 780,
    errors: 1,
    snapshot: "snap-20260903-1440",
  },
  {
    id: "job-9177",
    site: "Acme Corporate",
    siteId: "s-001",
    status: "completed",
    startedAt: "2026-09-04 02:12:01",
    duration: "21m 08s",
    progress: 100,
    pagesVisited: 1842,
    pagesTotal: 1842,
    docsExtracted: 1835,
    errors: 2,
    snapshot: "snap-20260904-0233",
  },
];

const statusColors: Record<string, { bar: string; text: string; border: string }> = {
  running: { bar: "bg-[#e8ff47]", text: "text-[#e8ff47]", border: "border-[#e8ff47]" },
  completed: { bar: "bg-[#4ade80]", text: "text-[#4ade80]", border: "border-[#4ade80]" },
  failed: { bar: "bg-[#ff5733]", text: "text-[#ff5733]", border: "border-[#ff5733]" },
};

const SNAPSHOTS = [
  { id: "snap-20260904-0803", site: "Internal Wiki", createdAt: "2026-09-04 08:03", docs: 3098 },
  { id: "snap-20260904-0642", site: "Tech Blog Network", createdAt: "2026-09-04 06:42", docs: 4229 },
  { id: "snap-20260904-0233", site: "Acme Corporate", createdAt: "2026-09-04 02:33", docs: 1835 },
  { id: "snap-20260903-1440", site: "Product Docs", createdAt: "2026-09-03 14:40", docs: 780 },
  { id: "snap-20260903-0803", site: "Internal Wiki", createdAt: "2026-09-03 08:03", docs: 3091 },
  { id: "snap-20260902-0642", site: "Tech Blog Network", createdAt: "2026-09-02 06:42", docs: 4201 },
];

export default function CrawlMonitorScreen() {
  const [view, setView] = useState<"jobs" | "snapshots">("jobs");
  const [selected, setSelected] = useState<string | null>("job-9182");

  const selectedJob = JOBS.find((j) => j.id === selected);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
          <div className="flex gap-0">
            {(["jobs", "snapshots"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 font-mono text-xs tracking-widest border transition-colors ${
                  view === v
                    ? "bg-[#f0f0f0] text-[#0a0a0a] border-[#f0f0f0] font-bold"
                    : "text-[#888] border-[#2a2a2a] hover:text-[#f0f0f0]"
                }`}
              >
                {v.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {JOBS.filter((j) => j.status === "running").length > 0 && (
              <span className="flex items-center gap-1.5 font-mono text-xs text-[#e8ff47]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8ff47] animate-pulse" />
                {JOBS.filter((j) => j.status === "running").length} RUNNING
              </span>
            )}
            <span className="font-mono text-xs text-[#888]">
              {JOBS.length} TOTAL JOBS
            </span>
          </div>
        </div>

        {view === "jobs" ? (
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  {["JOB ID", "SITE", "STARTED", "DURATION", "PROGRESS", "DOCS", "ERRORS", "STATUS"].map((h) => (
                    <th key={h} className="px-6 py-3 font-mono text-xs text-[#888] tracking-widest font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {JOBS.map((job) => {
                  const c = statusColors[job.status];
                  return (
                    <tr
                      key={job.id}
                      onClick={() => setSelected(job.id === selected ? null : job.id)}
                      className={`border-b border-[#1a1a1a] cursor-pointer transition-colors ${
                        selected === job.id ? "bg-[#1a1a1a]" : "hover:bg-[#111]"
                      }`}
                    >
                      <td className="px-6 py-4 font-mono text-xs text-[#888]">{job.id}</td>
                      <td className="px-6 py-4 font-sans text-sm text-[#f0f0f0]">{job.site}</td>
                      <td className="px-6 py-4 font-mono text-xs text-[#888]">{job.startedAt.split(" ")[1]}</td>
                      <td className="px-6 py-4 font-mono text-xs text-[#f0f0f0]">{job.duration}</td>
                      <td className="px-6 py-4 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-[#2a2a2a]">
                            <div
                              className={`h-full ${c.bar} transition-all`}
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs text-[#888]">{job.progress}%</span>
                        </div>
                        <div className="font-mono text-xs text-[#888] mt-1">
                          {job.pagesVisited.toLocaleString()} / {job.pagesTotal.toLocaleString()} pages
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-[#f0f0f0]">
                        {job.docsExtracted.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-mono text-sm ${job.errors > 0 ? "text-[#ff5733]" : "text-[#4ade80]"}`}>
                          {job.errors}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-mono text-xs px-2 py-0.5 border tracking-widest ${c.text} ${c.border}`}>
                          {job.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-auto flex-1 p-6">
            <div className="grid grid-cols-3 gap-4">
              {SNAPSHOTS.map((snap) => (
                <div
                  key={snap.id}
                  className="border border-[#2a2a2a] p-4 hover:border-[#e8ff47] cursor-pointer transition-colors group"
                >
                  <div className="font-mono text-xs text-[#888] tracking-widest mb-3">SNAPSHOT</div>
                  <div className="font-sans text-sm font-semibold text-[#f0f0f0] mb-1">{snap.site}</div>
                  <div className="font-mono text-xs text-[#888] mb-4">{snap.createdAt}</div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="font-mono text-2xl font-bold text-[#e8ff47]">
                        {snap.docs.toLocaleString()}
                      </div>
                      <div className="font-mono text-xs text-[#888]">documents</div>
                    </div>
                    <button className="font-mono text-xs text-[#888] group-hover:text-[#e8ff47] transition-colors border border-[#2a2a2a] group-hover:border-[#e8ff47] px-2 py-1">
                      BROWSE →
                    </button>
                  </div>
                  <div className="mt-3 font-mono text-xs text-[#444] truncate">{snap.id}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: job detail */}
      {selectedJob && view === "jobs" && (
        <div className="w-80 border-l border-[#2a2a2a] flex flex-col bg-[#111] overflow-y-auto">
          <div className="px-5 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
            <span className="font-mono text-xs text-[#888] tracking-widest">JOB DETAIL</span>
            <button onClick={() => setSelected(null)} className="font-mono text-xs text-[#888] hover:text-[#f0f0f0]">✕</button>
          </div>

          <div className="p-5 flex flex-col gap-5">
            <div>
              <div className="font-sans text-base font-semibold text-[#f0f0f0]">{selectedJob.site}</div>
              <div className="font-mono text-xs text-[#888] mt-0.5">{selectedJob.id}</div>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between font-mono text-xs text-[#888] mb-2">
                <span>CRAWL PROGRESS</span>
                <span className={statusColors[selectedJob.status].text}>{selectedJob.progress}%</span>
              </div>
              <div className="h-2 bg-[#2a2a2a]">
                <div
                  className={`h-full ${statusColors[selectedJob.status].bar} transition-all`}
                  style={{ width: `${selectedJob.progress}%` }}
                />
              </div>
              <div className="font-mono text-xs text-[#888] mt-1">
                {selectedJob.pagesVisited.toLocaleString()} of {selectedJob.pagesTotal.toLocaleString()} pages
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "DOCS EXTRACTED", value: selectedJob.docsExtracted.toLocaleString(), accent: true },
                { label: "ERRORS", value: selectedJob.errors, accent: false },
                { label: "DURATION", value: selectedJob.duration, accent: false },
                { label: "STATUS", value: selectedJob.status.toUpperCase(), accent: true },
              ].map((f) => (
                <div key={f.label} className="border border-[#2a2a2a] p-3">
                  <div className="font-mono text-xs text-[#888] tracking-widest mb-1">{f.label}</div>
                  <div className={`font-mono text-sm font-bold ${f.accent ? "text-[#e8ff47]" : "text-[#f0f0f0]"}`}>
                    {f.value}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="font-mono text-xs text-[#888] tracking-widest mb-2">STARTED</div>
              <div className="font-mono text-xs text-[#f0f0f0]">{selectedJob.startedAt}</div>
            </div>

            {selectedJob.snapshot && (
              <div>
                <div className="font-mono text-xs text-[#888] tracking-widest mb-2">SNAPSHOT</div>
                <div className="border border-[#4ade80] px-3 py-2 font-mono text-xs text-[#4ade80]">
                  {selectedJob.snapshot}
                </div>
                <button className="mt-2 w-full py-1.5 border border-[#2a2a2a] font-mono text-xs text-[#888] hover:border-[#e8ff47] hover:text-[#e8ff47] transition-colors">
                  BROWSE DOCUMENTS
                </button>
              </div>
            )}

            {selectedJob.status === "running" && (
              <button className="py-2 border border-[#ff5733] font-mono text-xs text-[#ff5733] hover:bg-[#ff5733] hover:text-[#0a0a0a] transition-colors">
                STOP JOB
              </button>
            )}

            {selectedJob.status === "failed" && (
              <div className="border border-[#ff5733] p-3">
                <div className="font-mono text-xs text-[#ff5733] tracking-widest mb-2">FAILURE REASON</div>
                <div className="font-mono text-xs text-[#888]">
                  Connection refused: host returned 403 on /legal/contracts after 32 pages. Rate limit exceeded.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
