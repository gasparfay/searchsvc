export type Screen =
  | "dashboard"
  | "new-site"
  | "monitor"
  | "crawl-monitor"
  | "config"
  | "navmap"
  | "search"
  | "history"
  | "explorer"
  | "sites-table"
  | { type: "detail"; siteId: string }
  | { type: "search-detail"; id: string };
