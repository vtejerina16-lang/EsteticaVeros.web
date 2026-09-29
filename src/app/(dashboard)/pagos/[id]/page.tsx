import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { getPaymentById } from "../_services/payments-service";
import { PaymentStatusBadge } from "../_components/payment-status-badge";
import { VoidPaymentDialog } from "../_components/void-payment-dialog";
import { PrintButton } from "../_components/print-button"; // 🌟 Importación del botón de cliente
import { formatBs, formatLocalTime } from "../../caja/_adapters/cash-adapter";

export const dynamic = "force-dynamic";

export default async function PagoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const token = await getAccessToken();
  if (!token) redirect("/login");

  // 1. Obtener datos del pago
  const p = await getPaymentById(token, id);
  
  // 2. Manejo de error si no existe
  if (!p) {
    return (
      <section className="rounded-3xl border border-rose-100 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-3xl">🔍</div>
        <h1 className="text-2xl font-black text-neutral-900">Pago no encontrado</h1>
        <p className="mt-2 text-sm text-neutral-500">El registro #{id} no existe o hubo un error al cargar los datos.</p>
        <Link 
          className="mt-8 inline-flex rounded-full bg-rose-600 px-10 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg hover:bg-rose-700 transition-all" 
          href="/pagos"
        >
          Volver al listado
        </Link>
      </section>
    );
  }

  const isVoid = p.status === "Void";

  return (
    <section className="rounded-3xl border border-rose-100 bg-white p-6 md:p-8 shadow-sm">
      
      {/* --- CABECERA --- */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between border-b border-rose-50 pb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Recibo Digital</p>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Cobro #{p.id}</h1>
          <div className="mt-3 flex items-center gap-3">
            <PaymentStatusBadge status={p.status} />
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Registrado el {formatLocalTime(p.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <VoidPaymentDialog paymentId={p.id} disabled={isVoid} />
          {!isVoid && (
            <Link 
              className="rounded-full border border-neutral-200 bg-white px-8 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-600 hover:bg-neutral-50 transition-all shadow-sm" 
              href={`/pagos/${p.id}/editar`}
            >
              Editar Información
            </Link>
          )}
        </div>
      </div>

      {/* --- BLOQUE DE INFORMACIÓN (GRID) --- */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {/* Cliente */}
        <div className="rounded-2xl border border-rose-100 bg-rose-50/20 p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Cliente</p>
          <p className="mt-1 text-sm font-black text-neutral-900 uppercase">
            {p.customerName || p.clientName || "Cliente General"}
          </p>
        </div>

        {/* Método */}
        <div className="rounded-2xl border border-rose-100 bg-rose-50/20 p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Método de Pago</p>
          <p className="mt-1 text-sm font-black text-neutral-900">
            {p.methodName || p.method || "Efectivo"}
          </p>
        </div>

        {/* Monto */}
        <div className="rounded-2xl border border-rose-100 bg-neutral-900 p-5 shadow-inner">
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-300">Monto Total</p>
          <p className="mt-1 text-2xl font-black text-white">{formatBs(p.amount)}</p>
        </div>

        {/* Referencia */}
        <div className="rounded-2xl border border-rose-100 bg-rose-50/20 p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Referencia / Operación</p>
          <p className="mt-1 text-sm font-bold text-neutral-700">
            {p.reference || <span className="text-neutral-300 font-medium italic">Sin referencia</span>}
          </p>
        </div>

        {/* Cita */}
        <div className="rounded-2xl border border-rose-100 bg-rose-50/20 p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Cita Vinculada</p>
          {p.appointmentId ? (
            <Link href={`/citas/${p.appointmentId}`} className="mt-1 inline-block text-sm font-black text-rose-600 hover:underline">
              Ver Cita #{p.appointmentId}
            </Link>
          ) : (
            <p className="mt-1 text-sm font-bold text-neutral-400 italic">Venta Directa / Otros</p>
          )}
        </div>

        {/* Sesión de Caja */}
        <div className="rounded-2xl border border-rose-100 bg-rose-50/20 p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">ID Sesión Caja</p>
          <p className="mt-1 text-sm font-mono font-black text-neutral-600">
            #{p.cashRegisterSessionId || p.sessionId || "N/A"}
          </p>
        </div>
      </div>

      {/* --- NOTAS Y ANULACIÓN --- */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-rose-100 bg-rose-50/20 p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Notas del Cobro</p>
          <p className="mt-2 text-sm text-neutral-600 italic leading-relaxed">
            {p.notes || "No se añadieron notas a este cobro."}
          </p>
        </div>

        {isVoid && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 ring-2 ring-rose-100 ring-offset-2">
            <div className="flex items-center gap-2 text-rose-800">
              <span className="text-xl">🚫</span>
              <p className="text-xs font-black uppercase tracking-widest">Transacción Anulada</p>
            </div>
            <p className="mt-3 text-sm text-rose-700 leading-relaxed">
              <span className="font-bold">Motivo:</span> {p.voidReason || "Error en el registro original."}
            </p>
          </div>
        )}
      </div>

      {/* --- PIE DE PÁGINA (BOTONES) --- */}
      <div className="mt-12 flex items-center justify-between border-t border-rose-50 pt-8">
        <Link 
          className="rounded-full bg-white px-8 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-rose-600 transition-colors" 
          href="/pagos"
        >
          ← Volver al Listado
        </Link>
        
        {/* Botón de impresión (Componente de Cliente) */}
        {!isVoid && <PrintButton />}
      </div>
    </section>
  );
}