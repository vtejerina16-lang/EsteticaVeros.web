"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  page: number;
  totalPages: number;
  perPage: number;
  totalCount?: number;
};

export function ServicesPagination({ page, totalPages, perPage, totalCount }: Props) {
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
        Página <span className="font-semibold">{page}</span> de{" "}
        <span className="font-semibold">{totalPages}</span>
        {typeof totalCount === "number" ? (
          <>
            {" "}
            · Total: <span className="font-semibold">{totalCount}</span>
          </>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-rose-50 disabled:opacity-60"
          onClick={() => go(1)}
          disabled={pending || !canPrev}
        >
          « Primero
        </button>

        <button
          className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-rose-50 disabled:opacity-60"
          onClick={() => go(page - 1)}
          disabled={pending || !canPrev}
        >
          ‹ Anterior
        </button>

        <button
          className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-rose-50 disabled:opacity-60"
          onClick={() => go(page + 1)}
          disabled={pending || !canNext}
        >
          Siguiente ›
        </button>

        <button
          className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-rose-50 disabled:opacity-60"
          onClick={() => go(totalPages)}
          disabled={pending || !canNext}
        >
          Último »
        </button>
      </div>
    </div>
  );
}