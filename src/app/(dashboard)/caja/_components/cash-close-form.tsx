"use client";

import { useActionState } from "react";
import type { CashSession } from "../_types/cash";
import { closeCashAction, type CashActionState } from "../_actions/cash-actions";

const init: CashActionState = { ok: false };

export function CashCloseForm({ session }: { session: CashSession }) {
  // Conectamos con la Server Action real corregida anteriormente
  const [state, action, pending] = useActionState(closeCashAction, init);

  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-tight">
          Cerrar caja y arqueo
        </h2>
        <span className="text-[10px] font-bold bg-neutral-100 text-neutral-500 px-2 py-1 rounded-full">
          SESIÓN #{session.id}
        </span>
      </div>

      <form action={action} className="grid gap-4 flex-1">
        {/* El ID de sesión es ahora numérico para el backend de C# */}
        <input type="hidden" name="cashSessionId" value={session.id} />

        <div className="space-y-1">
          <label className="text-xs font-bold text-neutral-600">
            Efectivo contado físicamente (Bs)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">Bs</span>
            <input
              name="closingCashCounted"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              defaultValue={session.closingCashCounted ?? ""}
              className="w-full rounded-xl border border-rose-100 bg-rose-50/20 pl-9 pr-3 py-2.5 text-sm focus:border-rose-500 focus:ring-0 transition-colors"
            />
          </div>
          <p className="text-[10px] text-neutral-400 px-1">
            Ingresa el monto total de dinero que tienes en mano al momento de cerrar.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-neutral-600">Observaciones de cierre</label>
          <textarea
            name="notes"
            rows={2}
            className="w-full rounded-xl border border-rose-100 bg-neutral-50/30 px-3 py-2 text-sm focus:border-rose-500 focus:ring-0 transition-colors"
            placeholder="Ej: faltante por cambio, billetes dañados, etc."
            defaultValue={session.notes ?? ""}
          />
        </div>

        <div className="mt-auto pt-2">
          {state.message && (
            <div className={`mb-3 rounded-lg p-3 text-xs font-medium ${
              state.ok ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
            }`}>
              {state.message}
            </div>
          )}

          <button
            disabled={pending}
            className="w-full rounded-full bg-neutral-900 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-neutral-800 active:scale-95 disabled:opacity-50 transition-all uppercase"
          >
            {pending ? "Procesando arqueo..." : "Finalizar sesión de caja"}
          </button>
        </div>
      </form>
    </div>
  );
}