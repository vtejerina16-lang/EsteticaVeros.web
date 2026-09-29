import Link from "next/link";
import { CitaStatusBadge } from "./cita-status-badge";
import { CitaRowActions } from "./cita-row-actions";
import type { CitaRow } from "../_types";

export function CitasTable({ rows }: { rows: CitaRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-rose-50/60 text-left text-xs font-bold tracking-wider text-neutral-700 uppercase">
          <tr>
            <th className="px-4 py-3 text-[10px]">Fecha / Hora</th>
            <th className="px-4 py-3 text-[10px]">Cliente</th>
            <th className="px-4 py-3 text-[10px]">Servicio</th>
            <th className="px-4 py-3 text-[10px]">Estado</th>
            <th className="px-4 py-3 text-right text-[10px]">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rose-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-sm italic text-neutral-400">
                No hay citas para mostrar con los filtros actuales.
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id} className="group transition-colors hover:bg-rose-50/30">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-bold text-neutral-900">{r.dateLabel}</span>
                    <span className="text-xs text-neutral-500">{r.timeLabel}</span>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <Link 
                    href={`/citas/${r.id}`} 
                    className="font-bold text-rose-600 decoration-2 underline-offset-4 hover:text-rose-700 hover:underline"
                  >
                    {r.clientName}
                  </Link>
                </td>
                
                <td className="px-4 py-3 font-medium text-neutral-700">
                  {r.serviceName}
                </td>

                <td className="px-4 py-3">
                  <CitaStatusBadge status={r.status} />
                </td>
                
                <td className="px-4 py-3 text-right">
                  <CitaRowActions 
                    id={r.id} 
                    status={r.status}
                    clientId={r.clientId}
                    clientName={r.clientName}
                    serviceId={r.serviceId}
                    serviceName={r.serviceName}
                    amount={r.amount}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}