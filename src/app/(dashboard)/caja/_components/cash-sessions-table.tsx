"use client";

import Link from "next/link";
import type { CashSession } from "../_types/cash";
import { 
  sessionStatusLabel, 
  formatLocalTime, 
  getStatusBadgeClass 
} from "../_adapters/cash-adapter";

export function CashSessionsTable({ sessions }: { sessions: CashSession[] }) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm transition-all">
      <table className="w-full text-sm">
        <thead className="bg-rose-50/60 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          <tr>
            <th className="px-4 py-4 text-left">ID Sesión</th>
            <th className="px-4 py-4 text-left">Estado</th>
            <th className="px-4 py-4 text-left">Fecha Apertura</th>
            <th className="px-4 py-4 text-left">Fecha Cierre</th>
            <th className="px-4 py-4 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-rose-50">
          {sessions.length === 0 ? (
            <tr>
              <td className="px-4 py-10 text-center text-neutral-400 italic" colSpan={5}>
                No hay un historial de sesiones registrado aún.
              </td>
            </tr>
          ) : (
            sessions.map((s) => (
              <tr key={s.id} className="hover:bg-rose-50/20 transition-colors group">
                {/* ID CON FORMATO DE BASE DE DATOS REAL */}
                <td className="px-4 py-3 font-mono font-bold text-neutral-900">
                  #{s.id}
                </td>

                {/* ESTADO CON BADGE DE COLOR DINÁMICO */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadgeClass(s.status)}`}>
                    {sessionStatusLabel[s.status]}
                  </span>
                </td>

                {/* FECHAS FORMATEADAS DESDE EL ADAPTADOR */}
                <td className="px-4 py-3 text-neutral-600">
                  {formatLocalTime(s.openedAt)}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {s.closedAt ? formatLocalTime(s.closedAt) : (
                    <span className="text-[10px] font-bold text-rose-400 uppercase">En curso</span>
                  )}
                </td>

                {/* ACCIÓN DE NAVEGACIÓN */}
                <td className="px-4 py-3 text-right">
                  <Link
                    className="inline-flex items-center rounded-full bg-rose-50 px-4 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 active:scale-95 transition-all"
                    href={`/caja/${s.id}`}
                  >
                    Detalles
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}