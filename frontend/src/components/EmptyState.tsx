import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-xl p-10 text-center bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
