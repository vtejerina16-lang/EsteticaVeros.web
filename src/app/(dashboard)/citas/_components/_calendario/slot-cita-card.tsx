// app/(dashboard)/citas/_components/_calendario/slot-cita-card.tsx
import Link from "next/link";
import type { Cita } from "../../_types";
import { CitaStatusBadge } from "../cita-status-badge";

export function SlotCitaCard({ cita }: { cita: Cita }) {
  // Extraemos solo la hora HH:mm de forma segura
  const startTime = cita.startAt.split('T')[1]?.substring(0, 5) ?? "00:00";
  
  return (
    <Link
      href={`/citas/${cita.id}`}
      className="group block rounded-xl border border-rose-100 bg-white p-2.5 shadow-sm transition-all hover:border-rose-300 hover:shadow-md active:scale-95"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
          {startTime}
        </span>
        <CitaStatusBadge status={cita.status} />
      </div>
      
      <div className="space-y-0.5">
        <div className="truncate text-xs font-extrabold text-neutral-900 group-hover:text-rose-600">
          {cita.client.name}
        </div>
        <div className="truncate text-[10px] font-medium text-neutral-500">
          {cita.service.name}
        </div>
      </div>
    </Link>
  );
}