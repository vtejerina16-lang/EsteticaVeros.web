"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  page: number;
  totalPages: number;
  perPage: number;
  totalCount?: number;
};

export function CitasPagination({ page, totalPages, perPage, totalCount }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  const canPrev = page > 1;
  const canNext = page < totalPages;

  function go(nextPage: number) {
    const next = new URLSearchParams(sp.toString());
    next.set("page", String(nextPage));
    next.set("per_page", String(perPage));
    start(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  return (
    <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="text-xs text-neutral-600">
        Página <span className="font-semibold">{page}</span> de <span className="font-semibold">{totalPages}</span>
        {typeof totalCount === "number" ? <span> · {totalCount} total</span> : null}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!canPrev || pending}
          onClick={() => go(page - 1)}
          className="rounded-full border border-rose-100 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={!canNext || pending}
          onClick={() => go(page + 1)}
          className="rounded-full bg-rose-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}