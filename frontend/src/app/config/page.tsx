"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import PageContainer from "@/components/PageContainer";
import ApiKeyCard from "@/components/ApiKeyCard";
import AccountProfileCard from "@/components/AccountProfileCard";
import ConfirmModal from "@/components/ConfirmModal";

export default function ConfigPage() {
  const { account } = useApp();
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  function handleRegenerar() {
    setShowRegenerateConfirm(false);
  }

  return (
    <PageContainer maxWidth="3xl">
      <PageHeader
        breadcrumb="CONFIGURACIÓN / CUENTA"
        title="Configuración de Cuenta"
      />

      {/* Panel 1: API Key Centralizada */}
      <ApiKeyCard
        apiKey={account.apiKey}
        onRegenerate={() => setShowRegenerateConfirm(true)}
      />

      {/* Modal de confirmación para regenerar API Key */}
      <ConfirmModal
        isOpen={showRegenerateConfirm}
        title="¿Regenerar API Key?"
        description="Se generará un nuevo UUID aleatorio. La clave anterior quedará inmediatamente invalidada y cualquier integración externa dejará de autenticar hasta que se actualice."
        confirmLabel="Sí, Regenerar Llave"
        cancelLabel="Cancelar"
        confirmVariant="default"
        onConfirm={handleRegenerar}
        onCancel={() => setShowRegenerateConfirm(false)}
      />

      {/* Panel 2: Perfil de Usuario */}
      <AccountProfileCard account={account} />
    </PageContainer>
  );
}
