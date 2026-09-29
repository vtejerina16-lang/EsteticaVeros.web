import Link from "next/link";
import type { RecentPaymentRow } from "../_adapters/dashboard-adapter";

function methodLabel(m: RecentPaymentRow["method"]) {
  switch (m) {
    case "cash":
      return "Efectivo";
    case "qr":
      return "QR";
  }
}

export function RecentPayments({ rows }: { rows: RecentPaymentRow[] }) {
  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm md:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-rose-600">Caja</p>
          <h2 className="text-base font-extrabold text-neutral-900">Cobros recientes</h2>
        </div>
        <Link
          href="/pagos"
          className="rounded-full border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
        >
          Ver pagos
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-rose-100 text-xs text-neutral-600">
              <th className="py-2 pr-3">Fecha</th>
              <th className="py-2 pr-3">Cliente</th>
              <th className="py-2 pr-3">Concepto</th>
              <th className="py-2 pr-3">Método</th>
              <th className="py-2 pr-0 text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="py-4 text-sm text-neutral-600" colSpan={5}>
                  Sin cobros recientes.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-rose-50 last:border-b-0">
                  <td className="py-3 pr-3 text-neutral-700">{r.when}</td>
                  <td className="py-3 pr-3 font-semibold text-neutral-900">{r.client}</td>
                  <td className="py-3 pr-3 text-neutral-700">{r.concept}</td>
                  <td className="py-3 pr-3 text-neutral-700">{methodLabel(r.method)}</td>
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
