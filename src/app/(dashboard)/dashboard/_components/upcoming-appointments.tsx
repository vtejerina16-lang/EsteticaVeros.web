import Link from "next/link";
import { StatusPill } from "./status-pill";
import type { UpcomingAppointmentRow } from "../_adapters/dashboard-adapter";

export function UpcomingAppointments({ rows }: { rows: UpcomingAppointmentRow[] }) {
  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm md:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-rose-600">Agenda</p>
          <h2 className="text-base font-extrabold text-neutral-900">Próximas citas</h2>
        </div>
        <Link
          href="/citas"
          className="rounded-full border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
        >
          Ver todo
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-rose-100 text-xs text-neutral-600">
              <th className="py-2 pr-3">Fecha</th>
              <th className="py-2 pr-3">Cliente</th>
              <th className="py-2 pr-3">Servicio</th>
              <th className="py-2 pr-3">Staff</th>
              <th className="py-2 pr-3">Estado</th>
              <th className="py-2 pr-0 text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="py-4 text-sm text-neutral-600" colSpan={6}>
                  No hay citas próximas.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-rose-50 last:border-b-0">
                  <td className="py-3 pr-3 text-neutral-700">{r.when}</td>
                  <td className="py-3 pr-3 font-semibold text-neutral-900">{r.client}</td>
                  <td className="py-3 pr-3 text-neutral-700">{r.service}</td>
                  <td className="py-3 pr-3 text-neutral-700">{r.staff}</td>
                  <td className="py-3 pr-3">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="py-3 pr-0 text-right font-semibold text-neutral-900">{r.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}