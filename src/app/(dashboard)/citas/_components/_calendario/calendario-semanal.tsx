// app/(dashboard)/citas/_components/_calendario/calendario-semanal.tsx
import type { Cita } from "../../_types";
import { SlotCitaCard } from "./slot-cita-card";

export function CalendarioSemanal({ baseDate, citas }: { baseDate: string; citas: Cita[] }) {
  const start = startOfWeek(baseDate);
  const today = toDateKey(new Date());

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-7">
      {days.map((d) => {
        const key = toDateKey(d);
        const isToday = key === today;
        const dayItems = citas
          .filter((c) => c.startAt.startsWith(key))
          .sort((a, b) => a.startAt.localeCompare(b.startAt));

        return (
          <div 
            key={key} 
            className={`rounded-2xl border p-3 transition-all ${
              isToday 
                ? 'border-rose-300 bg-rose-50/30 shadow-sm' 
                : 'border-rose-100 bg-white'
            }`}
          >
            <div className={`mb-3 text-center text-xs font-black uppercase tracking-tighter ${
              isToday ? 'text-rose-600' : 'text-neutral-500'
            }`}>
              {d.toLocaleDateString("es-BO", { weekday: "short", day: "2-digit" })}
            </div>

            <div className="space-y-2">
              {dayItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-rose-100 py-8 text-center text-[10px] text-neutral-400">
                  Libre
                </div>
              ) : (
                dayItems.map((c) => <SlotCitaCard key={c.id} cita={c} />)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Función auxiliar para asegurar que la semana empiece en Lunes
function startOfWeek(baseDate: string) {
  const d = new Date(`${baseDate}T00:00`);
  const day = d.getDay(); 
  const diff = (day === 0 ? -6 : 1) - day; 
  d.setDate(d.getDate() + diff);
  return d;
}

function toDateKey(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
