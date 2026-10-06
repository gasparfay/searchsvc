import React from "react";
import { IconSearch, IconClose } from "@/components/icons";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
  inputClassName = "",
}: SearchInputProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus-within:border-emerald-400 focus-within:bg-white transition-colors ${className}`}
    >
      <span className="text-slate-400 shrink-0">
        <IconSearch />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none ${inputClassName}`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
          title="Limpiar búsqueda"
        >
          <IconClose />
        </button>
      )}
    </div>
  );
}
