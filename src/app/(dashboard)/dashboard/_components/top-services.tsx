import Link from "next/link";
import type { TopServiceRow } from "../_adapters/dashboard-adapter";

export function TopServices({ rows }: { rows: TopServiceRow[] }) {
  const max = Math.max(1, ...rows.map((r) => r.qty));

  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm md:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-rose-600">Servicios</p>
          <h2 className="text-base font-extrabold text-neutral-900">Top 30 días</h2>
        </div>
        <Link
          href="/reportes"
          className="rounded-full border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
        >
          Reportes
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-neutral-600">No hay datos.</p>
        ) : (
          rows.map((r) => {
            const pct = Math.round((r.qty / max) * 100);
            return (
              <div key={r.id} className="rounded-2xl border border-rose-100 bg-rose-50/40 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold text-neutral-900">{r.name}</p>
                    <p className="text-xs text-neutral-600">
                      {r.qty} servicios · {r.revenue}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-neutral-700">{pct}%</span>
                </div>

                <div className="mt-2 h-2 w-full rounded-full bg-white">
                  <div
                    className="h-2 rounded-full bg-rose-200"
                    style={{ width: `${pct}%` }}
                    aria-hidden
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}