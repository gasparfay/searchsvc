"use client";

import { useState } from "react";
import { IconCopy, IconCheck } from "@/components/icons";

interface CodeBlockProps {
  content: string;
  title?: string;
  maxHeight?: string;
  showCopy?: boolean;
}

export default function CodeBlock({
  content,
  title,
  maxHeight = "max-h-96",
  showCopy = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      {(title || showCopy) && (
        <div className="flex items-center justify-between mb-2">
          {title && (
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {title}
            </h2>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-[11px] text-slate-400 font-mono">
              {content.length} caracteres
            </span>
            {showCopy && (
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] font-mono text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                title="Copiar contenido"
              >
                {copied ? <IconCheck /> : <IconCopy />}
                {copied ? "Copiado!" : "Copiar"}
              </button>
            )}
          </div>
        </div>
      )}

      <div
        className={`text-xs text-slate-300 bg-[#0e1525] p-5 rounded-lg font-mono leading-relaxed whitespace-pre-wrap ${maxHeight} overflow-y-auto border border-slate-800`}
      >
        {content || "Sin contenido indexado."}
      </div>
    </div>
  );
}
