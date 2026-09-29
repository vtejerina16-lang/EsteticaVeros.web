// src/app/(dashboard)/clientes/_components/clients-filters.tsx

"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ClientStatusFilter } from "../_types.clients";

type Props = {
  initialSearch: string;
  initialStatus: ClientStatusFilter;
};

export function ClientsFilters({ initialSearch, initialStatus }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<ClientStatusFilter>(initialStatus);

  const baseParams = useMemo(() => {
    const p = new URLSearchParams(sp?.toString());
    // siempre resetea paginado cuando cambias filtros
    p.delete("page");
    return p;
  }, [sp]);

  function apply() {
    const p = new URLSearchParams(baseParams);

    if (search.trim()) p.set("search", search.trim());
    else p.delete("search");

    if (status && status !== "all") p.set("status", status);
    else p.delete("status");

    router.replace(`/clientes?${p.toString()}`);
  }

  function clearAll() {
    router.replace("/clientes");
  }

  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <label className="block text-xs font-semibold text-neutral-700">Buscar</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre, teléfono o email…"
            className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-neutral-700">Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ClientStatusFilter)}
            className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
          >
            <option value="all">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>

        <div className="flex gap-2 md:col-span-2">
          <button
            type="button"
            onClick={apply}
            className="w-full rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Aplicar
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}