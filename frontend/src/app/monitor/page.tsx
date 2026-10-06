"use client";

import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import PageContainer from "@/components/PageContainer";
import MonitorStats from "@/components/MonitorStats";
import JobsTable from "@/components/JobsTable";

export default function MonitorPage() {
  const { jobs } = useApp();

  return (
    <PageContainer>
      {/* Page Header Component */}
      <PageHeader
        breadcrumb="MONITOREO / JOBS DEL CRAWLER"
        title="Historial de Tareas y Corridas"
      />

      {/* Stats Widgets */}
      <MonitorStats jobs={jobs} />

      {/* Table Card */}
      <JobsTable jobs={jobs} />
    </PageContainer>
  );
}
