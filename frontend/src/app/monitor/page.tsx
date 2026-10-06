"use client";

import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import PageContainer from "@/components/PageContainer";
import StatCard from "@/components/StatCard";
import JobsTable from "@/components/JobsTable";

export default function MonitorPage() {
  const { jobs } = useApp();

  const completedCount = jobs.filter((j) => j.estado === "completado").length;
  const runningCount = jobs.filter((j) => j.estado === "corriendo").length;
  const errorCount = jobs.filter((j) => j.estado === "error").length;

  return (
    <PageContainer>
      {/* Page Header Component */}
      <PageHeader
        breadcrumb="MONITOREO / JOBS DEL CRAWLER"
        title="Historial de Tareas y Corridas"
      />

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Corridas registradas"
          value={jobs.length}
          color="#1e3a6e"
          bg="#dbeafe"
          border="#bfdbfe"
        />
        <StatCard
          label="Completadas"
          value={completedCount}
          color="#166534"
          bg="#dcfce7"
          border="#bbf7d0"
        />
        <StatCard
          label="En curso"
          value={runningCount}
          color="#854d0e"
          bg="#fef9c3"
          border="#fef08a"
        />
        <StatCard
          label="Con fallos"
          value={errorCount}
          color="#991b1b"
          bg="#fee2e2"
          border="#fecaca"
        />
      </div>

      {/* Table Card */}
      <JobsTable jobs={jobs} />
    </PageContainer>
  );
}
