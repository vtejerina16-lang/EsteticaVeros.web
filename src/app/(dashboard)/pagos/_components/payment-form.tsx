// src/app/(dashboard)/pagos/_components/payment-form.tsx
"use client";

import { useActionState, useEffect, useState } from "react";
import { ClientSelector } from "./client-selector";
import { createPaymentAction, PaymentActionState } from "../_actions/payments-actions";

export interface PaymentInitialData {
  id?: number;
  customerId?: number;
  customerName?: string;
  clientName?: string;
  paymentMethodId?: number;
  amount?: number;
  reference?: string;
  appointmentId?: number;
  notes?: string;
  serviceId?: number;
  serviceName?: string;
  employeeId?: number;
}

interface ItemCobro {
  id: string;
  concepto: string;
  monto: number;
}

interface PaymentFormProps {
  token: string;
  currentSessionId?: number;
  initialMethods: any[];
  initialData?: PaymentInitialData;
  isEditing?: boolean;
}

export function PaymentForm({ 
  token, 
  currentSessionId, 
  initialMethods, 
  initialData, 
  isEditing 
}: PaymentFormProps) {
  
  const initialState: PaymentActionState = { 
    ok: false, 
    message: "" 
  };

  const [state, action, pending] = useActionState(createPaymentAction, initialState);

  // Estado local para los ítems/servicios cobrados
  const [items, setItems] = useState<ItemCobro[]>(() => {
    if (initialData?.serviceName || initialData?.amount) {
      return [
        {
          id: initialData?.serviceId ? String(initialData.serviceId) : "init-1",
          concepto: initialData?.serviceName || `Servicio Cita #${initialData?.appointmentId || ""}`,
          monto: Number(initialData?.amount) || 0,
        },
      ];
    }
    return [];
  });

  // Campos para agregar un nuevo extra
  const [nuevoConcepto, setNuevoConcepto] = useState("");
  const [nuevoMonto, setNuevoMonto] = useState("");

  // Calcular el total automáticamente
  const totalCalculado = items.reduce((acc, item) => acc + (Number(item.monto) || 0), 0);
  const [montoFinal, setMontoFinal] = useState<number>(
    items.length > 0 ? totalCalculado : Number(initialData?.amount) || 0
  );

  useEffect(() => {
    if (items.length > 0) {
      setMontoFinal(totalCalculado);
    }
  }, [items, totalCalculado]);

  // Handlers de ítems
  const handleAgregarItem = () => {
    if (!nuevoConcepto.trim() || !nuevoMonto) return;
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        concepto: nuevoConcepto.trim(),
        monto: parseFloat(nuevoMonto) || 0,
      },
    ]);
    setNuevoConcepto("");
    setNuevoMonto("");
  };

  const handleEliminarItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMontoItemChange = (id: string, nuevoValor: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, monto: nuevoValor } : item))
    );
  };

  return (
    <form action={action} className="space-y-8">
      
      {/* Indicador visual de la cita vinculada */}
      {initialData?.appointmentId && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 text-xs font-semibold text-rose-700 flex items-center justify-between">
          <span className="flex items-center gap-2">
            📌 <span>Cobro vinculado a la Cita <b>#{initialData.appointmentId}</b></span>
          </span>
          {initialData.serviceName && (
            <span className="rounded-full bg-rose-200/60 px-3 py-1 text-[10px] font-bold text-rose-800">
              {initialData.serviceName}
            </span>
          )}
        </div>
      )}

      {/* 1. SELECTOR DE CLIENTES */}
      <div className="rounded-3xl border border-rose-100 bg-rose-50/10 p-2">
        <ClientSelector 
          initialName={initialData?.customerName || initialData?.clientName} 
          initialId={initialData?.customerId} 
        />
      </div>

      {/* 2. DESGLOSE Y ADICIÓN DE SERVICIOS / PRODUCTOS */}
      <div className="rounded-3xl border border-rose-100 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-rose-50 pb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-800">
            Detalle de Servicios e Ítems Extras
          </h3>
          <span className="text-[11px] font-bold text-neutral-400">
            {items.length} {items.length === 1 ? "ítem" : "ítems"}
          </span>
        </div>

        {/* Lista de Ítems */}
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-3"
              >
                <span className="text-xs font-semibold text-neutral-700 flex-1">
                  {item.concepto}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-neutral-400">Bs</span>
                  <input
                    type="number"
                    step="0.01"
                    value={item.monto}
                    onChange={(e) => handleMontoItemChange(item.id, parseFloat(e.target.value) || 0)}
                    className="w-24 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-right text-xs font-bold text-neutral-800 outline-none focus:border-rose-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleEliminarItem(item.id)}
                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xs font-medium text-neutral-400 py-2">
            No hay servicios detallados. Puedes ingresar el monto directo abajo o agregar ítems.
          </p>
        )}

        {/* Inputs para agregar ítem extra */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Servicio extra o producto (ej: Esmalte especial)"
            value={nuevoConcepto}
            onChange={(e) => setNuevoConcepto(e.target.value)}
            className="flex-1 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-medium outline-none focus:border-rose-400"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio (Bs)"
            value={nuevoMonto}
            onChange={(e) => setNuevoMonto(e.target.value)}
            className="w-full sm:w-28 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-medium outline-none focus:border-rose-400"
          />
          <button
            type="button"
            onClick={handleAgregarItem}
            className="rounded-2xl bg-neutral-100 px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            + Añadir
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* 3. MÉTODO DE PAGO */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-3">
            Método de Pago
          </label>
          <div className="relative">
            <select
              name="paymentMethodId"
              required
              defaultValue={initialData?.paymentMethodId || ""}
              className="w-full appearance-none rounded-2xl border border-rose-100 bg-white px-5 py-4 text-sm font-medium outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-50/50"
            >
              <option value="">Seleccionar método...</option>
              {initialMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.requiresCashRegister ? "🏦" : ""}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-rose-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* 4. MONTO TOTAL (Calculado o editable) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-3 flex justify-between items-center pr-2">
            <span>Monto Total a Cobrar (Bs)</span>
            {items.length > 0 && (
              <span className="text-[9px] text-emerald-600 font-bold">Auto-calculado</span>
            )}
          </label>
          <input
            name="amount"
            type="number"
            step="0.01"
            required
            value={montoFinal}
            onChange={(e) => setMontoFinal(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full rounded-2xl border border-rose-100 bg-white px-5 py-4 text-lg font-black text-neutral-800 outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-50/50"
          />
        </div>

        {/* 5. REFERENCIA */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-3">
            Referencia / Nro Op.
          </label>
          <input
            name="reference"
            type="text"
            defaultValue={initialData?.reference}
            placeholder="Ej: Transf-1234"
            className="w-full rounded-2xl border border-rose-100 bg-white px-5 py-4 text-sm outline-none transition-all focus:border-rose-400"
          />
        </div>

        {/* 6. CITA RELACIONADA */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-3">
            ID Cita Relacionada
          </label>
          <input
            name="appointmentId"
            type="number"
            defaultValue={initialData?.appointmentId}
            placeholder="Opcional"
            className="w-full rounded-2xl border border-rose-100 bg-white px-5 py-4 text-sm outline-none transition-all focus:border-rose-400"
          />
        </div>
      </div>

      {/* 7. NOTAS */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-3">
          Notas del Cobro
        </label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={initialData?.notes}
          placeholder="Cualquier detalle importante..."
          className="w-full rounded-3xl border border-rose-100 bg-white px-5 py-4 text-sm outline-none transition-all focus:border-rose-400"
        ></textarea>
      </div>

      {/* Guardar detalle de ítems formateado en las notas o en un campo hidden */}
      {items.length > 0 && (
        <input
          type="hidden"
          name="itemsDetail"
          value={JSON.stringify(items)}
        />
      )}

      {/* 8. CAMPOS OCULTOS PARA LÓGICA DE BACKEND */}
      <input type="hidden" name="cashRegisterSessionId" value={currentSessionId || ""} />
      {isEditing && <input type="hidden" name="paymentId" value={initialData?.id} />}

      {/* 9. BOTÓN DE ACCIÓN */}
      <div className="pt-4">
        <button
          disabled={pending}
          type="submit"
          className="relative w-full overflow-hidden rounded-full bg-neutral-900 py-5 text-xs font-black uppercase tracking-[0.3em] text-white shadow-2xl transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-50"
        >
          {pending ? (
            <div className="flex items-center justify-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Procesando...</span>
            </div>
          ) : (
            isEditing ? "Actualizar Registro de Cobro" : "Confirmar y Registrar Cobro"
          )}
        </button>
      </div>

      {/* 10. MENSAJES DE ESTADO */}
      {state.message && (
        <div 
          className={`rounded-2xl p-4 text-center text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2
          ${state.ok ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
        >
          {state.message}
        </div>
      )}
    </form>
  );
}