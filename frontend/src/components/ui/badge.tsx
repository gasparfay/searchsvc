import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  dot?: boolean;
}

function Badge({
  className,
  variant = "default",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-emerald-500/15 text-emerald-800 border-emerald-300",
    secondary: "bg-slate-100 text-slate-700 border-slate-200",
    destructive: "bg-red-50 text-red-700 border-red-200",
    outline: "text-slate-700 border-slate-200 bg-transparent",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
  };

  const dotColors = {
    default: "bg-emerald-500",
    secondary: "bg-slate-400",
    destructive: "bg-red-500",
    outline: "bg-slate-400",
    success: "bg-emerald-500",
    warning: "bg-amber-400",
  };

  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />}
      {children}
    </span>
  );
}

export { Badge };
