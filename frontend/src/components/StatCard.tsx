import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  variant?: "default" | "success" | "info" | "warning" | "danger";
  className?: string;
  color?: string;
  bg?: string;
  border?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-slate-50/80 border-slate-200 text-slate-900",
  success: "bg-emerald-50/70 border-emerald-200 text-emerald-950",
  info: "bg-blue-50/70 border-blue-200 text-blue-950",
  warning: "bg-amber-50/70 border-amber-200 text-amber-950",
  danger: "bg-rose-50/70 border-rose-200 text-rose-950",
};

const labelStyles: Record<string, string> = {
  default: "text-slate-500",
  success: "text-emerald-700",
  info: "text-blue-700",
  warning: "text-amber-700",
  danger: "text-rose-700",
};

const valueStyles: Record<string, string> = {
  default: "text-slate-900",
  success: "text-emerald-800",
  info: "text-blue-900",
  warning: "text-amber-900",
  danger: "text-rose-800",
};

export default function StatCard({
  label,
  value,
  variant = "default",
  className,
  color,
  bg,
  border,
}: StatCardProps) {
  const customStyle: React.CSSProperties = {};
  if (bg) customStyle.background = bg;
  if (border) customStyle.borderColor = border;

  return (
    <Card
      className={cn(
        "px-6 py-5 transition-transform hover:-translate-y-0.5 shadow-xs",
        variantStyles[variant] || variantStyles.default,
        className
      )}
      style={Object.keys(customStyle).length > 0 ? customStyle : undefined}
    >
      <div
        className={cn(
          "text-xs mb-1.5 font-bold tracking-wider uppercase",
          labelStyles[variant] || labelStyles.default
        )}
        style={color ? { color, opacity: 0.85 } : undefined}
      >
        {label}
      </div>
      <div
        className={cn(
          "text-3xl font-bold tracking-tight",
          valueStyles[variant] || valueStyles.default
        )}
        style={color ? { color } : undefined}
      >
        {value}
      </div>
    </Card>
  );
}
