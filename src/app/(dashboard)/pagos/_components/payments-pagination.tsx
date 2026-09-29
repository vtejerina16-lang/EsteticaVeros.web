"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  page: number;
  totalPages: number;
  perPage: number;
  totalCount?: number;
};

export function PaymentsPagination({ page, totalPages, perPage, totalCount }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  // Cálculo del rango para mejorar la UX de Vero
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalCount ?? 0);

  function go(nextPage: number) {
    const next = new URLSearchParams(sp.toString());
    next.set("page", String(nextPage));
    // Mantenemos la cantidad por página si existe en la URL
    if (perPage !== 10) next.set("per_page", String(perPage));
    
    start(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  if (totalPages <= 1 && (totalCount ?? 0) <= perPage) return null;

  return (
    <div className={`mt-6 flex flex-col gap-4 border-t border-rose-50 pt-6 md:flex-row md:items-center md:justify-between transition-opacity ${pending ? "opacity-50" : "opacity-100"}`}>
      {/* INFORMACIÓN DE REGISTROS */}
      <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
        Página <span className="text-neutral-900">{page}</span> de <span className="text-neutral-900">{totalPages}</span>
        {totalCount ? (
          <span className="ml-2 text-rose-300">
            · Mostrando {from}-{to} de {totalCount} registros
          </span>
        ) : null}
      </div>

      {/* BOTONES DE NAVEGACIÓN */}
      <div className="flex items-center gap-3">
        <button
          className="inline-flex items-center rounded-xl border border-neutral-200 bg-white px-5 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-white transition-all active:scale-95"
          disabled={pending || page <= 1}
          onClick={() => go(page - 1)}
        >
          ← Anterior
        </button>

        <div className="h-1 w-8 rounded-full bg-rose-50">
          <div 
            className="h-full rounded-full bg-rose-400 transition-all duration-500" 
            style={{ width: `${(page / totalPages) * 100}%` }}
          />
        </div>

        <button
          className="inline-flex items-center rounded-xl border border-neutral-900 bg-neutral-900 px-5 py-2 text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-30 transition-all active:scale-95 shadow-sm"
          disabled={pending || page >= totalPages}
          onClick={() => go(page + 1)}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}