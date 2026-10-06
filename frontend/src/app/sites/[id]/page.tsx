"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { IconTrash } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import EmptyState from "@/components/EmptyState";
import PageContainer from "@/components/PageContainer";
import SiteHeader from "@/components/SiteHeader";
import SnapshotBar from "@/components/SnapshotBar";
import SiteDocumentsPanel from "@/components/SiteDocumentsPanel";
import ConfirmModal from "@/components/ConfirmModal";

export default function SiteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: siteId } = use(params);
  const router = useRouter();
  const { sites, snapshots, documents, deleteSite, triggerCrawl } = useApp();

  const site = sites.find((s) => s._id === siteId);
  const siteSnapshots = site ? snapshots.filter((snap) => snap.siteId === site._id) : [];

  const [userSelectedSnapshotId, setUserSelectedSnapshotId] = useState<string | null>(null);
  const [querySearch, setQuerySearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const activeSnapshot =
    userSelectedSnapshotId && siteSnapshots.some((s) => s.id === userSelectedSnapshotId)
      ? siteSnapshots.find((s) => s.id === userSelectedSnapshotId)
      : siteSnapshots[0];

  const selectedSnapshotId = activeSnapshot?.id || "";

  // Documentos del snapshot activo (búsqueda decorativa, sin lógica de filtrado)
  const docs = site && activeSnapshot
    ? documents.filter(
        (doc) => doc.siteId === site._id && doc.snapshotId === activeSnapshot.id
      )
    : [];

  if (!site) {
    return (
      <PageContainer className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          title="Sitio no encontrado"
          description="El sitio que intentas consultar no existe o fue eliminado."
          action={
            <Link href="/sites">
              <Button>← Volver a Mis Sitios</Button>
            </Link>
          }
        />
      </PageContainer>
    );
  }

  function handleTriggerCrawl() {
    if (site) {
      triggerCrawl(site._id);
    }
  }

  function handleDeleteSite() {
    if (site) {
      deleteSite(site._id);
      setShowDeleteModal(false);
      router.push("/sites");
    }
  }

  return (
    <PageContainer>
      {/* Encabezado del Sitio */}
      <SiteHeader
        site={site}
        onCrawl={handleTriggerCrawl}
        onDelete={() => setShowDeleteModal(true)}
      />

      {/* Panel 1: Snapshots Históricos */}
      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between p-4 px-6 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <CardTitle className="text-xs uppercase tracking-wider">
              Snapshots Históricos del Sitio ({siteSnapshots.length})
            </CardTitle>
            <CardDescription>
              Seleccioná un snapshot para navegar los documentos extraídos por el crawler en esa corrida.
            </CardDescription>
          </div>
          {activeSnapshot && (
            <Badge variant="outline" className="font-mono text-slate-600 bg-slate-50">
              Snapshot activo:{" "}
              <strong className="text-emerald-700 ml-1">
                {activeSnapshot.id}
              </strong>
            </Badge>
          )}
        </CardHeader>

        <div className="p-4">
          <SnapshotBar
            snapshots={siteSnapshots}
            activeSnapshotId={selectedSnapshotId}
            onSelect={setUserSelectedSnapshotId}
          />
        </div>
      </Card>

      {/* Panel 2: Documentos Extraídos */}
      <SiteDocumentsPanel
        site={site}
        hasSnapshots={siteSnapshots.length > 0}
        activeSnapshot={activeSnapshot}
        docs={docs}
        querySearch={querySearch}
        onQuerySearchChange={setQuerySearch}
        onTriggerCrawl={handleTriggerCrawl}
      />

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="¿Eliminar sitio definitivamente?"
        icon={
          <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <IconTrash />
          </div>
        }
        description={
          <span>
            Se eliminará el sitio <strong className="text-slate-900 font-semibold">{site.name}</strong> y todos sus snapshots y documentos extraídos asociados de forma irreversible.
          </span>
        }
        confirmLabel="Sí, Eliminar Sitio"
        cancelLabel="Cancelar"
        confirmVariant="destructive"
        onConfirm={handleDeleteSite}
        onCancel={() => setShowDeleteModal(false)}
      />
    </PageContainer>
  );
}
