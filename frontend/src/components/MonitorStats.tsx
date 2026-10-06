import type { CrawlJob } from "@/types";
import StatCard from "@/components/StatCard";

interface MonitorStatsProps {
  jobs: CrawlJob[];
}

export default function MonitorStats({ jobs }: MonitorStatsProps) {
  const completedCount = jobs.filter((j) => j.estado === "completado").length;
  const runningCount = jobs.filter((j) => j.estado === "corriendo").length;
  const errorCount = jobs.filter((j) => j.estado === "error").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="Corridas registradas"
        value={jobs.length}
        variant="info"
      />
      <StatCard
        label="Completadas"
        value={completedCount}
        variant="success"
      />
      <StatCard
        label="En curso"
        value={runningCount}
        variant="warning"
      />
      <StatCard
        label="Con fallos"
        value={errorCount}
        variant="danger"
      />
    </div>
  );
}
