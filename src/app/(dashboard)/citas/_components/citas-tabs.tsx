"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function CitasTabs({ view }: { view: "list" | "calendar" }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  function setView(nextView: "list" | "calendar") {
    const next = new URLSearchParams(sp.toString());
    next.set("view", nextView);
    next.set("page", "1");
    start(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  const base =
    "inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold transition border";
  const on = "bg-rose-600 text-white border-rose-600";
  const off = "bg-white text-neutral-800 border-rose-100 hover:bg-rose-50";

  return (
    <div className="flex items-center gap-2">
      <button type="button" disabled={pending} onClick={() => setView("list")} className={`${base} ${view === "list" ? on : off}`}>
        Lista
      </button>
      <button type="button" disabled={pending} onClick={() => setView("calendar")} className={`${base} ${view === "calendar" ? on : off}`}>
        Calendario
      </button>
    </div>
  );
}