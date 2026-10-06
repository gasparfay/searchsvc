import type { Site, CrawlJob } from "@/types";
import StatCard from "@/components/StatCard";

interface SitesStatsProps {
  sites: Site[];
  jobs: CrawlJob[];
}

export default function SitesStats({ sites, jobs }: SitesStatsProps) {
  const totalSites = sites.length;
  const totalDocs = sites.reduce((a, s) => a + (s.docsCount || 0), 0);
  const totalRunsToday = jobs.filter((j) => j.inicio.includes("Hoy")).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <StatCard
        label="Sitios registrados"
        value={totalSites}
        variant="success"
      />
      <StatCard
        label="Documentos indexados"
        value={totalDocs.toLocaleString("es")}
        variant="info"
      />
      <StatCard
        label="Corridas registradas"
        value={totalRunsToday}
        variant="default"
      />
    </div>
  );
}
