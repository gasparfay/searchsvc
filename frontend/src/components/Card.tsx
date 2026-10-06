import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-xl overflow-hidden shadow-xs bg-white border border-slate-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardProps) {
  return (
    <div className={`p-8 border-b border-slate-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }: CardProps) {
  return (
    <div className={`p-8 space-y-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "" }: CardProps) {
  return (
    <div className={`px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}
