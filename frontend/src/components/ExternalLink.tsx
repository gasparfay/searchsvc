import React from "react";
import { IconExternalLink } from "@/components/icons";

interface ExternalLinkProps {
  href: string;
  label?: string;
  className?: string;
}

export default function ExternalLink({
  href,
  label,
  className = "",
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-xs font-mono text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1.5 break-all ${className}`}
    >
      <span>{label || href}</span>
      <IconExternalLink />
    </a>
  );
}
