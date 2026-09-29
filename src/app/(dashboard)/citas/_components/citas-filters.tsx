"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  initialSearch: string;
  initialStatus: string;
  initialPerPage: number;
};

export function CitasFilters({ initialSearch, initialStatus, initialPerPage }: Props) {
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [pending, start] = useTransition();

  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // 🚩 VALORES NUMÉRICOS (Basados en Enums estándar de C#)
  // 1. Cambiamos el valor de "Todos" a uno que no sea vacío
const statusOptions = useMemo(
  () => [
    { v: "", l: "Todos" },
    { v: "1", l: "Pendiente" },
    { v: "2", l: "Confirmada" },
    { v: "3", l: "En el salón (Llegó)" }, // 🚩 Este TIENE que ser "3"
    { v: "4", l: "Atendiendo" },
    { v: "5", l: "Completada" },
  ],
  []
);

function apply() {
  const next = new URLSearchParams(sp.toString());
  
  if (search) next.set("search", search);
  else next.delete("search");

  if (status && status !== "") {
    next.set("status", status); // Aquí se mandará "3"
    // 🚩 IMPORTANTE: Borramos fechas para que el C# use el filtro de estado
    next.delete("startDate");
    next.delete("endDate");
    next.delete("StartDate");
    next.delete("EndDate");
  } else {
    next.delete("status");
  }

  next.set("page", "1");
  next.set("per_page", String(initialPerPage));
  
  start(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
}

  return (
    <div className="mt-4 rounded-2xl border border-rose-100 bg-white p-3 md:p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
        
        <div className="md:col-span-6">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Buscar</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") apply(); }}
            placeholder="Cliente, servicio, teléfono..."
            className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-200 transition-all"
          />
        </div>

        <div className="md:col-span-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 outline-none focus:ring-2 focus:ring-rose-200 transition-all cursor-pointer"
          >
            {statusOptions.map((o) => (
              <option key={o.v} value={o.v}>
                {o.l}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <button
            type="button"
            disabled={pending}
            onClick={apply}
            className="w-full rounded-xl bg-[#e90044] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-100 hover:bg-[#c7003a] disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {pending ? "..." : "Aplicar"}
          </button>
        </div>
      </div>
    </div>
  );
}