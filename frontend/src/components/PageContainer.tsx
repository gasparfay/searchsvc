import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  className?: string;
  containerClassName?: string;
}

const MAX_WIDTH_MAP = {
  sm: "max-w-screen-sm mx-auto",
  md: "max-w-screen-md mx-auto",
  lg: "max-w-screen-lg mx-auto",
  xl: "max-w-screen-xl mx-auto",
  "2xl": "max-w-2xl mx-auto",
  "3xl": "max-w-3xl mx-auto",
  "4xl": "max-w-4xl mx-auto",
  "5xl": "max-w-5xl mx-auto",
  "6xl": "max-w-6xl mx-auto",
  "7xl": "max-w-7xl mx-auto",
  full: "w-full",
};

export default function PageContainer({
  children,
  maxWidth = "full",
  className = "",
  containerClassName = "",
}: PageContainerProps) {
  return (
    <div className={cn("h-full overflow-y-auto bg-slate-100", containerClassName)}>
      <div className={cn("px-10 py-8", MAX_WIDTH_MAP[maxWidth], className)}>
        {children}
      </div>
    </div>
  );
}
