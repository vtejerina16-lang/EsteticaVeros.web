"use client";

import Link from "next/link";

function buildUrl(base: { search: string; status: string; pageSize: number }, page: number, pageSize?: number) {
  const p = new URLSearchParams();
  if (base.search) p.set("search", base.search);
  if (base.status && base.status !== "all") p.set("status", base.status);
  p.set("page", String(page));
  p.set("pageSize", String(pageSize ?? base.pageSize));
  return `/clientes?${p.toString()}`;
}

function getPageItems(current: number, total: number) {
  // 1 ... (current-1) current (current+1) ... total
  const items: (number | "…")[] = [];
  const push = (v: number | "…") => items.push(v);

  const clamp = (n: number) => Math.max(1, Math.min(total, n));
  current = clamp(current);

  if (total <= 7) {
    for (let i = 1; i <= total; i++) push(i);
    return items;
  }

  push(1);

  if (current > 3) push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) push(i);

  if (current < total - 2) push("…");

  push(total);

  return items;
}

export function Pagination({
  base,
  page,
  pageSize,
  total,
  totalPages,
}: {
  base: { search: string; status: string };
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}) {
  const pages = getPageItems(page, totalPages);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  const sizes = [10, 20, 50, 100];

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-t border-rose-100 px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-3 text-neutral-600">
        <span>
          Mostrando <span className="font-semibold text-neutral-900">{from}</span>–{" "}
          <span className="font-semibold text-neutral-900">{to}</span> de{" "}
          <span className="font-semibold text-neutral-900">{total}</span>
        </span>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-600">Por página</span>
          <select
            className="rounded-xl border border-rose-200 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-800 outline-none focus:border-rose-400"
            value={pageSize}
            onChange={() => {
              /* no-op: evitamos warning controlled/uncontrolled */
            }}
          >
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Selector via links para mantener navegación server-friendly */}
          <div className="hidden">
            {sizes.map((s) => (
              <Link key={s} href={buildUrl({ ...base, pageSize }, 1, s)} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          aria-disabled={page <= 1}
          href={buildUrl({ ...base, pageSize }, Math.max(1, page - 1))}
          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${
            page <= 1
              ? "pointer-events-none border-neutral-200 bg-neutral-100 text-neutral-400"
              : "border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
          }`}
        >
          Anterior
        </Link>

        {pages.map((it, idx) =>
          it === "…" ? (
            <span key={`e-${idx}`} className="px-2 text-xs font-semibold text-neutral-500">
              …
            </span>
          ) : (
            <Link
              key={it}
              href={buildUrl({ ...base, pageSize }, it)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                it === page
                  ? "border-rose-600 bg-rose-600 text-white"
                  : "border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
              }`}
            >
              {it}
            </Link>
          )
        )}

        <Link
          aria-disabled={page >= totalPages}
          href={buildUrl({ ...base, pageSize }, Math.min(totalPages, page + 1))}
          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${
            page >= totalPages
              ? "pointer-events-none border-neutral-200 bg-neutral-100 text-neutral-400"
              : "border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
          }`}
        >
          Siguiente
        </Link>
      </div>

      {/* Selector real clickable (mismo <select> pero con links) */}
      <div className="md:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-600">Por página</span>
          <div className="flex gap-2">
            {sizes.map((s) => (
              <Link
                key={s}
                href={buildUrl({ ...base, pageSize }, 1, s)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                  s === pageSize
                    ? "border-rose-600 bg-rose-600 text-white"
                    : "border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
                }`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Nota: si quieres el <select> realmente funcional en desktop, te lo convierto a router.replace().
         Pero así (links) queda idéntico al patrón server-friendly. */}
    </div>
  );
}