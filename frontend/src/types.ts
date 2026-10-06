export type Screen =
  | "dashboard"
  | "new-site"
  | "monitor"
  | "config"
  | { type: "detail"; siteId: string };
