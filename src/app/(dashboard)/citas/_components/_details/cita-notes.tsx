import type { Cita } from "../../_types";

export function CitaNotes({ cita }: { cita: Cita }) {
  const notes = (cita.notes ?? "").trim();

  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 md:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-rose-600">Notas</p>
          <h2 className="text-sm font-extrabold text-neutral-900">Observaciones de la cita</h2>
        </div>
        <span className="rounded-full border border-rose-100 bg-rose-50 px-2 py-1 text-xs font-semibold text-neutral-700">
          Interno
        </span>
      </div>

      <div className="mt-3 rounded-2xl border border-rose-100 bg-rose-50/40 p-4">
        {notes ? (
          <p className="whitespace-pre-wrap text-sm text-neutral-800">{notes}</p>
        ) : (
          <p className="text-sm text-neutral-500">— Sin notas registradas.</p>
        )}
      </div>
    </section>
  );
}