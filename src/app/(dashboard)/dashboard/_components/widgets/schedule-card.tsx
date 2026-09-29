import { Card } from "../ui-card";

export function ScheduleCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ day: string; hours: string }>;
}) {
  return (
    <Card>
      <p className="text-sm font-extrabold text-neutral-900">{title}</p>

      <div className="mt-3 divide-y divide-rose-100/70 rounded-2xl border border-rose-100 bg-white/60">
        {rows.map((r) => (
          <div key={r.day} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-semibold text-neutral-800">{r.day}</span>
            <span className="text-xs font-semibold text-neutral-500">{r.hours}</span>
          </div>
        ))}
      </div>

      <button className="mt-3 text-xs font-semibold text-rose-600 hover:text-rose-700">
        View more
      </button>
    </Card>
  );
}