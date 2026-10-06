"use client";

import React from "react";

interface CodeEditorProps {
  label: string;
  badge?: string;
  badgeVariant?: "required" | "optional";
  filename: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
}

export default function CodeEditor({
  label,
  badge,
  badgeVariant = "optional",
  filename,
  value,
  onChange,
  rows = 12,
}: CodeEditorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-slate-600 uppercase tracking-wider">
          {label}
        </label>
        {badge && (
          <span
            className={`text-xs font-semibold ${
              badgeVariant === "required" ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="rounded-lg overflow-hidden border border-slate-800 bg-[#0e1525] shadow-xs">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#162032] border-b border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs ml-2 font-mono text-slate-400">{filename}</span>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full px-4 py-4 text-xs font-mono leading-relaxed bg-[#0e1525] text-slate-200 focus:outline-none resize-none"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
