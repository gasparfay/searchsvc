import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantClasses = {
  default: "bg-[#3ddc84] text-[#0a1f14] hover:bg-[#2bc971] shadow-xs font-bold active:scale-95",
  destructive: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-semibold active:scale-95",
  outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold shadow-xs",
  secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 font-semibold",
  ghost: "hover:bg-slate-100 text-slate-700 font-medium",
  link: "text-emerald-600 font-semibold underline-offset-4 hover:underline",
};

const sizeClasses = {
  default: "h-9 px-4 py-2 text-xs rounded-lg",
  sm: "h-8 px-3 text-xs rounded-md",
  lg: "h-11 px-6 text-sm rounded-lg",
  icon: "h-9 w-9 p-0 rounded-lg flex items-center justify-center shrink-0",
};

function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-slot="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 select-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

export { Button };
