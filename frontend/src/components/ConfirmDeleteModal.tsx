"use client";

import React from "react";
import ConfirmModal from "@/components/ConfirmModal";
import { IconTrash } from "@/components/icons";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  siteName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  siteName,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title="¿Eliminar sitio definitivamente?"
      icon={
        <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
          <IconTrash />
        </div>
      }
      description={
        <span>
          Se eliminará el sitio <strong className="text-slate-900 font-semibold">{siteName}</strong> y todos sus snapshots y documentos extraídos asociados de forma irreversible.
        </span>
      }
      confirmLabel="Sí, Eliminar Sitio"
      cancelLabel="Cancelar"
      confirmVariant="destructive"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
