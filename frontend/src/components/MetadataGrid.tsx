import React from "react";

export interface MetadataItemProps {
  label: string;
  value: React.ReactNode;
}

interface MetadataGridProps {
  title?: string;
  items: MetadataItemProps[];
  columns?: string;
  className?: string;
}

export default function MetadataGrid({
  title,
  items,
  columns = "grid-cols-1 sm:grid-cols-3",
  className = "",
}: MetadataGridProps) {
  return (
    <div className={`pt-6 border-t border-slate-100 ${className}`}>
      {title && (
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          {title}
        </h2>
      )}
      <div className={`grid gap-4 text-xs ${columns}`}>
        {items.map((item, index) => (
          <div
            key={index}
            className="p-3.5 rounded-lg bg-slate-50 border border-slate-100"
          >
            <span className="text-slate-400 block mb-1">{item.label}</span>
            <div className="font-semibold text-slate-800">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
