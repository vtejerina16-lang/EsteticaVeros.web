"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PaymentStatus } from "../_types/payments";

type Props = {
  initialSearch: string;
  initialStatus: "all" | PaymentStatus | string;
  initialMethod: "all" | string;
};

export function PaymentsFilters({ initialSearch, initialStatus, initialMethod }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(sp.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    
    next.delete("page"); // Resetear a pag. 1 al filtrar
    start(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  return (
    <div className={`mt-6 grid gap-4 rounded-3xl border border-rose-100 bg-white p-5 shadow-sm transition-opacity md:grid-cols-3 ${pending ? "opacity-60" : "opacity-100"}`}>
      
      {/* BÚSQUEDA POR TEXTO */}
      <div className="relative group">
        <input
          defaultValue={initialSearch}
          disabled={pending}
          placeholder="Buscar cliente o referencia..."
          className="w-full rounded-2xl border border-rose-100 bg-rose-50/20 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-0 transition-all"
          onKeyDown={(e) => {
            if (e.key === "Enter") setParam("search", (e.currentTarget as HTMLInputElement).value);
          }}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-rose-300 uppercase group-focus-within:hidden">
          Enter ↵
        </span>
      </div>

      {/* FILTRO POR ESTADO (Sincronizado con C#) */}
      <select
        defaultValue={initialStatus}
        disabled={pending}
        className="rounded-2xl border border-rose-100 bg-rose-50/20 px-4 py-2.5 text-sm outline-none focus:border-rose-400 transition-all appearance-none cursor-pointer"
        onChange={(e) => setParam("status", e.target.value)}
      >
        <option value="all">📊 Todos los estados</option>
        <option value="Paid">✅ Pagado</option>
        <option value="Pending">⏳ Pendiente</option>
        <option value="Void">🚫 Anulado</option>
      </select>

      {/* FILTRO POR MÉTODO (Basado en IDs del Handler) */}
      <select
        defaultValue={initialMethod}
        disabled={pending}
        className="rounded-2xl border border-rose-100 bg-rose-50/20 px-4 py-2.5 text-sm outline-none focus:border-rose-400 transition-all appearance-none cursor-pointer"
        onChange={(e) => setParam("method", e.target.value)}
      >
        <option value="all">💳 Todos los métodos</option>
        <option value="1">💵 Efectivo</option>
        <option value="2">💳 Tarjeta</option>
        <option value="3">📱 Transferencia</option>
        <option value="4">🔳 QR</option>
      </select>
    </div>
  );
}