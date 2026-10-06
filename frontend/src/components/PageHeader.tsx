import React from "react";

interface PageHeaderProps {
  breadcrumb: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  breadcrumb,
  title,
  subtitle,
  action,
  className = "mb-8",
}: PageHeaderProps) {
  return (
    <div className={`flex items-start sm:items-center justify-between gap-4 flex-wrap sm:flex-nowrap ${className}`}>
      <div>
        <div className="text-xs mb-1.5 text-slate-400 uppercase tracking-wider font-medium">
          {breadcrumb}
        </div>
        <div className="text-2xl font-bold text-slate-900 leading-tight">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-slate-500 mt-1">
            {subtitle}
          </div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
