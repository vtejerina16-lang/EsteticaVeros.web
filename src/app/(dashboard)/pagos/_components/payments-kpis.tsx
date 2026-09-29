import type { Payment } from "../_types/payments";
import { formatBs } from "../../caja/_adapters/cash-adapter";

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

export function PaymentsKpis({ items }: { items: Payment[] }) {
  // 1. Obtenemos la fecha local (Bolivia) evitando el desfase de UTC
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localISOTime = new Date(now.getTime() - offset).toISOString();
  
  const todayStr = localISOTime.split('T')[0]; // "2026-03-24"
  const monthStr = todayStr.substring(0, 7);   // "2026-03"

  // 2. Cálculo de Ventas Hoy (Solo estados que representan dinero real)
  const totalToday = sum(
    items
      .filter(p => {
        const date = p.createdAt || p.paymentDate || "";
        const isToday = date.startsWith(todayStr);
        const isPaid = p.status === "Completed" || p.status === "Paid";
        return isToday && isPaid;
      })
      .map(p => p.amount)
  );

  // 3. Cálculo de Total Mes
  const totalMonth = sum(
    items
      .filter(p => {
        const date = p.createdAt || p.paymentDate || "";
        const isThisMonth = date.startsWith(monthStr);
        const isPaid = p.status === "Paid" || p.status === "Completed";
        return isThisMonth && isPaid;
      })
      .map(p => p.amount)
  );

  return (
    // 🌟 Ajustado a 2 columnas para que se vea equilibrado
    <div className="grid gap-6 md:grid-cols-2">
      
      {/* KPI VENTAS HOY */}
      <div className="rounded-3xl border border-rose-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Ventas Hoy</p>
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <p className="mt-3 text-4xl font-black text-neutral-900 tracking-tight">
          {formatBs(totalToday)}
        </p>
      </div>

      {/* KPI TOTAL MES */}
      <div className="rounded-3xl border border-rose-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Mes</p>
        <p className="mt-3 text-4xl font-black text-neutral-900 tracking-tight">
          {formatBs(totalMonth)}
        </p>
      </div>

    </div>
  );
}