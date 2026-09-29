"use client";

import type { CashMovement } from "../_types/cash";
import { 
  categoryLabel, 
  movementTypeLabel, 
  formatBs, 
  formatLocalTime, 
  getTypeColor 
} from "../_adapters/cash-adapter";

export function CashMovementsTable({ movements }: { movements: CashMovement[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm transition-all">
      <table className="w-full text-sm">
        <thead className="bg-rose-50/60 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          <tr>
            <th className="px-4 py-4 text-left">Fecha y Hora</th>
            <th className="px-4 py-4 text-left">Tipo</th>
            <th className="px-4 py-4 text-left">Categoría</th>
            <th className="px-4 py-4 text-left">Detalle / Concepto</th>
            <th className="px-4 py-4 text-right">Monto</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-rose-50">
          {movements.length === 0 ? (
            <tr>
              <td className="px-4 py-10 text-center text-neutral-400 italic" colSpan={5}>
                No se encontraron movimientos registrados en esta sesión.
              </td>
            </tr>
          ) : (
            movements.map((m) => (
              <tr key={m.id} className="hover:bg-rose-50/20 transition-colors group">
                {/* FECHA FORMATEADA */}
                <td className="px-4 py-3 text-neutral-600 font-medium">
                  {formatLocalTime(m.createdAt)}
                </td>

                {/* TIPO CON COLOR DINÁMICO */}
                <td className={`px-4 py-3 ${getTypeColor(m.type)}`}>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${m.type === 1 ? "bg-green-500" : "bg-red-500"}`} />
                    {movementTypeLabel[m.type] || "Otro"}
                  </div>
                </td>

                {/* CATEGORÍA DESDE EL ADAPTADOR */}
                <td className="px-4 py-3">
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                    {categoryLabel[m.category] || "General"}
                  </span>
                </td>

                {/* DESCRIPCIÓN */}
                <td className="px-4 py-3 text-neutral-700 max-w-xs truncate" title={m.description}>
                  {m.description}
                </td>

                {/* MONTO FORMATEADO */}
                <td className={`px-4 py-3 text-right font-black ${getTypeColor(m.type)}`}>
                  {m.type === 1 ? "+" : "-"}{formatBs(m.amount)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}