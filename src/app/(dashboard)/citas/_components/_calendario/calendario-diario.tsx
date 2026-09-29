import type { Cita } from "../../_types";
import { SlotCitaCard } from "./slot-cita-card";

export function CalendarioDiario({ baseDate, citas }: { baseDate: string; citas: Cita[] }) {
  const items = citas
    .filter((c) => c.startAt.startsWith(baseDate))
    .sort((a, b) => (a.startAt < b.startAt ? -1 : 1));

  return (
    <div className="mt-4 rounded-2xl border border-rose-100 bg-white p-3 md:p-4">
      <div className="mb-3 text-sm font-extrabold text-neutral-900">
        {new Date(`${baseDate}T00:00`).toLocaleDateString("es-BO", { weekday: "long", day: "2-digit", month: "long" })}
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-rose-100 p-4 text-sm text-neutral-500">Sin citas</div>
        ) : (
          items.map((c) => <SlotCitaCard key={c.id} cita={c} />)
        )}
      </div>
    </div>
  );
}