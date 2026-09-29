// FILE: src/app/(dashboard)/pagos/_components/payment-status-badge.tsx
import type { PaymentStatus } from "../_types/payments";

/**
 * Mapeo de estados sincronizado con los Enums de C#
 * Usamos TitleCase para coincidir con el backend
 */
const statusConfig: Record<string, { label: string; cls: string }> = {
  Paid: { 
    label: "Pagado", 
    cls: "bg-emerald-50 text-emerald-700 border-emerald-100" 
  },
  Void: { 
    label: "Anulado", 
    cls: "bg-rose-50 text-rose-700 border-rose-100" 
  },
  Pending: { 
    label: "Pendiente", 
    cls: "bg-amber-50 text-amber-700 border-amber-100" 
  },
  // Por si el backend llega a manejar reembolsos en el futuro
  Refunded: { 
    label: "Reembolsado", 
    cls: "bg-sky-50 text-sky-700 border-sky-100" 
  },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus | string }) {
  // Buscamos la configuración, con un fallback por si el string varía
  const s = statusConfig[status] || { 
    label: status, 
    cls: "bg-neutral-50 text-neutral-500 border-neutral-100" 
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${s.cls}`}>
      <span className="mr-1.5 h-1 w-1 rounded-full bg-current opacity-60" />
      {s.label}
    </span>
  );
}