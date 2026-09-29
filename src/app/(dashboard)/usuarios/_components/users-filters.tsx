"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  initialSearch: string;
  initialIsActive: "all" | "true" | "false";
};

export function UsersFilters({ initialSearch, initialIsActive }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [isActive, setIsActive] = useState<Props["initialIsActive"]>(initialIsActive);

  // sync back/forward
  useEffect(() => {
    setSearch(sp.get("search") ?? "");
    const v = sp.get("is_active") as Props["initialIsActive"] | null;
    setIsActive(v === "true" || v === "false" ? v : "all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.toString()]);

  function apply(next: URLSearchParams) {
    // swagger: page y per_page
    if (!next.get("page")) next.set("page", "1");
    if (!next.get("per_page")) next.set("per_page", "10");

    const nextUrl = `${pathname}?${next.toString()}`;
    start(() => router.replace(nextUrl, { scroll: false }));
  }

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(sp.toString());

      const v = search.trim();
      if (v) next.set("search", v);
      else next.delete("search");

      next.set("page", "1");
      apply(next);
    }, 350);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // is_active inmediato
  useEffect(() => {
    const next = new URLSearchParams(sp.toString());

    if (isActive === "all") next.delete("is_active");
    else next.set("is_active", isActive);

    next.set("page", "1");
    apply(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return (
    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
      <div className="flex-1">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o correo"
          className="w-full rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-rose-200"
          disabled={pending}
        />
      </div>

      <select
        value={isActive}
        onChange={(e) => setIsActive(e.target.value as any)}
        className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm text-neutral-800 outline-none disabled:opacity-60"
        disabled={pending}
      >
        <option value="all">Estado: Todos</option>
        <option value="true">Activo</option>
        <option value="false">Inactivo</option>
      </select>

      <button
        className="grid h-10 w-10 place-items-center rounded-full border border-rose-200 bg-white hover:bg-rose-50 disabled:opacity-60"
        title="Limpiar"
        aria-label="Limpiar"
        disabled={pending}
        onClick={() => {
          setSearch("");
          setIsActive("all");
          const next = new URLSearchParams(sp.toString());
          next.delete("search");
          next.delete("is_active");
          next.set("page", "1");
          apply(next);
        }}
      >
        ✕
      </button>
    </div>
  );
}
