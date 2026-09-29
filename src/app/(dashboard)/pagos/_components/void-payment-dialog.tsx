"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// 🌟 CAMBIO: Importamos 'PaymentActionState' que es el nombre correcto
import { voidPaymentAction, type PaymentActionState } from "../_actions/payments-actions";

// 🌟 CAMBIO: Ajustamos el estado inicial para que coincida con la interfaz
const init: PaymentActionState = { 
  ok: false, 
  message: "" 
};

export function VoidPaymentDialog({ 
  paymentId, 
  disabled 
}: { 
  paymentId: string | number; 
  disabled?: boolean 
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  // Usamos el estado corregido aquí
  const [state, action, pending] = useActionState(voidPaymentAction, init);

  useEffect(() => {
    if (state.ok) {
      setOpen(false);
      // Pequeño delay para que el usuario vea el éxito antes de refrescar
      const timer = setTimeout(() => {
        router.refresh(); 
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.ok, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className={`rounded-full px-6 py-2.5 text-xs font-bold transition-all active:scale-95 ${
          disabled
            ? "border border-neutral-100 bg-neutral-50 text-neutral-400 cursor-not-allowed"
            : "bg-rose-50 text-rose-700 hover:bg-rose-100 shadow-sm"
        }`}
      >
        {disabled ? "Pago Anulado" : "Anular Pago"}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="border-b border-rose-50 bg-rose-50/30 p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Acción Crítica</p>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight">Anular Transacción</h2>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                Al anular el pago <span className="font-bold text-neutral-800">#{paymentId}</span>, el monto se restará de la caja y el registro quedará como "Void".
              </p>
            </div>

            <form action={action} className="p-6 space-y-4">
              {/* ID OCULTO que la acción necesita leer con formData.get('paymentId') */}
              <input type="hidden" name="paymentId" value={paymentId} />

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 ml-1">Motivo</label>
                <textarea
                  name="reason"
                  rows={3}
                  required
                  placeholder="Ej: Error en el monto, el cliente canceló..."
                  className="w-full rounded-2xl border border-rose-100 bg-rose-50/10 px-4 py-3 text-sm focus:border-rose-400 outline-none transition-all"
                />
              </div>

              {state.message && (
                <div className={`rounded-xl p-3 text-xs font-bold ${
                  state.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}>
                  {state.ok ? "✅" : "❌"} {state.message}
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <button
                  disabled={pending}
                  className="w-full rounded-full bg-rose-600 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg hover:bg-rose-700 disabled:opacity-50 active:scale-95 transition-all"
                >
                  {pending ? "Anulando..." : "Confirmar Anulación"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={pending}
                  className="w-full rounded-full bg-white py-3 text-xs font-bold text-neutral-500 hover:bg-neutral-50 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}