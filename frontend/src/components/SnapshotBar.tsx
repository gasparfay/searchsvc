import type { CrawlSnapshot } from "@/types";
import { Badge } from "@/components/ui/badge";

interface SnapshotBarProps {
  snapshots: CrawlSnapshot[];
  activeSnapshotId: string;
  onSelect: (id: string) => void;
}

export default function SnapshotBar({
  snapshots,
  activeSnapshotId,
  onSelect,
}: SnapshotBarProps) {
  if (snapshots.length === 0) {
    return (
      <div className="py-6 px-4 text-center rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500">
        No hay snapshots históricos registrados para este sitio aún.
      </div>
    );
  }



  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-1">
      {snapshots.map((snap) => {
        const isSelected = activeSnapshotId === snap.id;
        const isOk = snap.estado === "ok";

        return (
          <button
            key={snap.id}
            type="button"
            onClick={() => onSelect(snap.id)}
            className={`flex-shrink-0 text-left p-3.5 rounded-lg border transition-all text-xs cursor-pointer min-w-[210px] ${
              isSelected
                ? "bg-emerald-50/60 border-emerald-400 ring-2 ring-emerald-400/20"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold font-mono text-slate-900">{snap.id}</span>
              <Badge
                variant={isOk ? "success" : "warning"}
                className="text-[10px] font-bold"
              >
                {isOk ? "OK" : "Parcial"}
              </Badge>
            </div>
            <div className="text-slate-600 font-medium mb-1">{snap.fecha}</div>
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>{snap.docs.toLocaleString("es")} docs</span>
              <span>{snap.duracion}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
