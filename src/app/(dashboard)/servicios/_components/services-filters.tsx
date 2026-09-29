"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CategoryOption = { id: number; name: string };

type Props = {
  categories: CategoryOption[];
  initialSearch: string;
  initialCategory: string;
  initialType: string;
  initialStatus: string;
  perPage: number;
};

export function ServicesFilters({
  categories: backendCategories,
  initialSearch,
  initialCategory,
  initialType,
  initialStatus,
  perPage,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [type, setType] = useState(initialType);
  const [status, setStatus] = useState(initialStatus);

  const categories = useMemo(
    () => [{ id: "all", name: "Todas" }, ...backendCategories.map((c) => ({ id: String(c.id), name: c.name }))],
    [backendCategories]
  );

  function apply() {
    const next = new URLSearchParams(sp.toString());

    const s = search.trim();
    s ? next.set("search", s) : next.delete("search");

    category !== "all" ? next.set("category", category) : next.delete("category");
    type !== "all" ? next.set("type", type) : next.delete("type");
    status !== "all" ? next.set("status", status) : next.delete("status");

    next.set("page", "1");
    next.set("per_page", String(perPage));

    start(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  function clear() {
    setSearch("");
    setCategory("all");
    setType("all");
    setStatus("all");

    const next = new URLSearchParams(sp.toString());
    ["search", "category", "type", "status"].forEach((k) => next.delete(k));
    next.set("page", "1");
    next.set("per_page", String(perPage));

    start(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-neutral-700">Buscar</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm outline-none focus:border-rose-300"
            placeholder="Ej: corte, balayage, manicure…"
            disabled={pending}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm"
            disabled={pending}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm"
            disabled={pending}
          >
            <option value="all">Todos</option>
            <option value="simple">Simple</option>
            <option value="composite">Compuesto</option>
            <option value="package">Paquete</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700">Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm"
            disabled={pending}
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={clear}
          disabled={pending}
          className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-rose-50 disabled:opacity-60"
        >
          Limpiar
        </button>
        <button
          onClick={apply}
          disabled={pending}
          className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}