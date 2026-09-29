"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  baseDate: string; // YYYY-MM-DD
  mode: "week" | "day";
};

export function CalendarioHeader({ baseDate, mode }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  function setParam(next: Record<string, string>) {
    const qs = new URLSearchParams(sp.toString());
    qs.set("view", "calendar");
    Object.entries(next).forEach(([k, v]) => qs.set(k, v));
    start(() => router.replace(`${pathname}?${qs.toString()}`, { scroll: false }));
  }

  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  }

  function shift(days: number) {
    const d = new Date(`${baseDate}T00:00`);
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    setParam({ date: `${y}-${m}-${da}` });
  }

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-rose-100 bg-white p-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => setParam({ mode: "week" })}
          className={`rounded-full border px-3 py-2 text-xs font-semibold ${mode === "week" ? "bg-rose-600 text-white border-rose-600" : "bg-white border-rose-100 hover:bg-rose-50"}`}
        >
          Semana
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setParam({ mode: "day" })}
          className={`rounded-full border px-3 py-2 text-xs font-semibold ${mode === "day" ? "bg-rose-600 text-white border-rose-600" : "bg-white border-rose-100 hover:bg-rose-50"}`}
        >
          Día
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 md:justify-end">
        <button
          type="button"
          disabled={pending}
          onClick={() => shift(mode === "week" ? -7 : -1)}
          className="rounded-full border border-rose-100 bg-white px-3 py-2 text-xs font-semibold hover:bg-rose-50"
        >
          ←
        </button>

        <div className="text-sm font-semibold text-neutral-800">{baseDate}</div>

        <button
          type="button"
          disabled={pending}
          onClick={() => shift(mode === "week" ? 7 : 1)}
          className="rounded-full border border-rose-100 bg-white px-3 py-2 text-xs font-semibold hover:bg-rose-50"
        >
          →
        </button>

        <button
          type="button"
          disabled={pending}
          onClick={() => setParam({ date: todayKey() })}
          className="rounded-full bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
        >
          Hoy
        </button>
      </div>
    </div>
  );
}