// FILE: src/app/(dashboard)/pagos/_components/payments-table.tsx
import Link from "next/link";
import type { PaymentRow } from "../_types/payments";
import { PaymentStatusBadge } from "./payment-status-badge";

export function PaymentsTable({ rows }: { rows: PaymentRow[] }) {
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-rose-50/60 text-[10px] font-black uppercase tracking-widest text-neutral-500">
          <tr>
            <th className="px-6 py-4 text-left font-bold">Ref</th>
            <th className="px-6 py-4 text-left font-bold">Fecha</th>
            <th className="px-6 py-4 text-left font-bold">Cliente</th>
            <th className="px-6 py-4 text-left font-bold">Concepto</th>
            <th className="px-6 py-4 text-left font-bold">Método</th>
            <th className="px-6 py-4 text-right font-bold">Monto</th>
            <th className="px-6 py-4 text-center font-bold">Estado</th>
            <th className="px-6 py-4 text-right font-bold">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-rose-50">
          {rows.length === 0 ? (
            <tr>
              <td className="px-6 py-12 text-center text-neutral-400 italic" colSpan={8}>
                No se encontraron registros de cobro con estos filtros.
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id} className="hover:bg-rose-50/20 transition-colors group">
                {/* ID CON FORMATO MONO */}
                <td className="px-6 py-4 font-mono text-[11px] font-bold text-neutral-400">
                  #{r.id}
                </td>

                {/* FECHA (Ya viene formateada del adaptador) */}
                <td className="px-6 py-4 text-neutral-600 whitespace-nowrap">
                  {r.createdAt}
                </td>

                {/* CLIENTE */}
                <td className="px-6 py-4 font-bold text-neutral-900 uppercase tracking-tight">
                  {r.client}
                </td>

                {/* CONCEPTO */}
                <td className="px-6 py-4 text-neutral-500 text-xs font-medium">
                  {r.concept}
                </td>

                {/* MÉTODO (Incluye Emoji) */}
                <td className="px-6 py-4 text-neutral-600">
                  {r.method}
                </td>

                {/* MONTO FORMATEADO (Bs) */}
                <td className="px-6 py-4 text-right font-black text-neutral-900">
                  {r.totalFormatted}
                </td>

                {/* ESTADO CON BADGE PREMIUM */}
                <td className="px-6 py-4 text-center">
                  <PaymentStatusBadge status={r.status} />
                </td>

                {/* ACCIÓN DETALLE */}
                <td className="px-6 py-4 text-right">
                  <Link 
                    className="inline-flex h-8 items-center rounded-full bg-rose-50 px-5 text-[11px] font-black uppercase tracking-tighter text-rose-700 hover:bg-rose-100 active:scale-95 transition-all shadow-sm" 
                    href={`/pagos/${r.id}`}
                  >
                    Detalle
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