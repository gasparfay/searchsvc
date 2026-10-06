import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export const IconSites = ({ width = 18, height = 18, ...props }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const IconMonitor = ({ width = 18, height = 18, ...props }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.8" />
    <polyline points="6,13 9,9 12,11.5 15,7.5 18,10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconConfig = ({ width = 17, height = 17, ...props }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconPlayground = ({ width = 18, height = 18, ...props }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <polyline points="4 17 10 11 4 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="19" x2="20" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconEye = ({ width = 15, height = 15, ...props }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const IconEdit = ({ width = 14, height = 14, ...props }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconTrash = ({ width = 14, height = 14, ...props }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconPlay = ({ width = 13, height = 13, ...props }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const IconSearch = ({ width = 14, height = 14, ...props }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconClose = ({ width = 12, height = 12, ...props }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCheck = ({ width = 13, height = 13, ...props }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCopy = ({ width = 13, height = 13, ...props }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconArrowLeft = ({ width = 14, height = 14, ...props }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconRefresh = ({ width = 13, height = 13, ...props }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconExternalLink = ({ width = 12, height = 12, ...props }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

