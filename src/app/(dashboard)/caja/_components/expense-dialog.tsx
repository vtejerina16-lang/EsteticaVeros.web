"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Corregido: Importación de la acción singular y ruta correcta
import { createExpenseAction, type ExpenseActionState } from "../_actions/expenses-actions";

const init: ExpenseActionState = { ok: false };

export function ExpenseDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createExpenseAction, init);

  // Cerrar el modal y refrescar la UI cuando el gasto se guarda con éxito
  useEffect(() => {
    if (state.ok) {
      setOpen(false);
      // router.refresh() asegura que los KPIs y la tabla se actualicen inmediatamente
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-rose-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-rose-700 active:scale-95 transition-all"
      >
        Registrar Gasto
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* CABECERA */}
            <div className="border-b border-rose-50 bg-rose-50/30 p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Movimiento de Caja</p>
              <h2 className="text-xl font-black text-neutral-900">Registrar Salida de Efectivo</h2>
              <p className="mt-1 text-xs text-neutral-500">
                Este monto se restará del efectivo esperado en la sesión actual.
              </p>
            </div>

            {/* FORMULARIO */}
            <form action={action} className="p-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700">Monto (Bs)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">Bs</span>
                    <input
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0.05"
                      placeholder="0.00"
                      className="w-full rounded-xl border border-rose-100 bg-rose-50/20 pl-9 pr-3 py-2.5 text-sm focus:border-rose-500 focus:ring-0 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700">Categoría</label>
                  <select
                    name="expenseCategory"
                    className="w-full rounded-xl border border-rose-100 bg-rose-50/20 px-3 py-2.5 text-sm focus:border-rose-500 focus:ring-0 appearance-none transition-all"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>Seleccionar...</option>
                    <option value="Insumos">💅 Insumos (Esmaltes, etc.)</option>
                    <option value="Transporte">🚕 Transporte / Delivery</option>
                    <option value="Servicios básicos">💡 Servicios básicos</option>
                    <option value="Limpieza">🧼 Limpieza y Aseo</option>
                    <option value="Otros">📦 Otros gastos</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Descripción detallada</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full rounded-xl border border-rose-100 bg-rose-50/20 px-3 py-2.5 text-sm focus:border-rose-500 focus:ring-0 transition-all"
                  placeholder="Ej: Compra de acetona pura y algodón para el salón."
                  required
                />
              </div>

              {/* MENSAJES DE ESTADO */}
              {state.message && (
                <div className={`rounded-xl p-3 text-xs font-medium ${
                  state.ok ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                }`}>
                  {state.message}
                </div>
              )}

              {/* BOTONES */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-50">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={pending}
                  className="rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-bold text-neutral-500 hover:bg-neutral-50 active:scale-95 disabled:opacity-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  disabled={pending}
                  className="rounded-full bg-neutral-900 px-8 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-neutral-800 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {pending ? "Guardando..." : "Confirmar Gasto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}