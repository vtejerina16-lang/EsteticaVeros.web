"use client";

import { useActionState, useEffect, useRef } from "react";
import type { CashAccount, CashSession } from "../_types/cash";
import { openCashAction, type CashActionState } from "../_actions/cash-actions";
import { CashCloseForm } from "./cash-close-form";
import { ExpenseDialog } from "./expense-dialog";

const init: CashActionState = { ok: false };

export function CashActions({
  account,
  session,
  balance,
  registers = [], // cajas disponibles
}: {
  account: CashAccount;
  session: CashSession | null;
  balance: number;
  registers?: { id: number; name: string; location?: string }[];
}) {
  const [openState, openAction, isPending] = useActionState(openCashAction, init);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { if (openState.ok) formRef.current?.reset(); }, [openState.ok]);

  // --- Caja Chica (pausada) ---
  if (account.type === "PETTY") {
    return (
      <div className="rounded-[2rem] border border-neutral-100 bg-neutral-50 p-6 shadow-sm">
        <h2 className="text-sm font-black text-neutral-900 uppercase tracking-widest italic">Caja Chica</h2>
        <p className="mt-2 text-xs text-neutral-500 font-medium">
          Módulo en pausa. Solo la <strong>Caja Principal</strong> está habilitada para este Sprint.
        </p>
      </div>
    );
  }

  // --- Caja cerrada ---
  if (!session) {
    return (
      <div className="bg-white border-2 border-rose-500/10 p-8 rounded-[2rem] shadow-xl shadow-rose-500/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <h3 className="text-sm font-black uppercase tracking-tight text-neutral-800">Iniciar Turno de Caja</h3>
        </div>

        <form ref={formRef} action={openAction} className="space-y-5 text-left">
          <div>
            <label className="text-[10px] font-black text-neutral-400 uppercase ml-2 mb-1 block">Selecciona la Caja</label>
            <select name="cashRegisterId" required defaultValue="" className="w-full bg-neutral-50 border-none rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-rose-500/20 transition-all text-neutral-900 cursor-pointer">
              <option value="" disabled>Elige una caja...</option>
              {registers.map((reg) => (
                <option key={reg.id} value={reg.id}>{reg.name} {reg.location ? `(${reg.location})` : ""}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-neutral-400 uppercase ml-2 mb-1 block">Efectivo inicial (Bs)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">Bs</span>
              <input name="openingFloat" type="number" step="0.01" min="0" required placeholder="0.00" className="w-full bg-neutral-50 border-none rounded-2xl pl-10 pr-4 py-4 text-lg font-bold focus:ring-2 focus:ring-rose-500/20 transition-all text-neutral-900" />
            </div>
          </div>

          <button disabled={isPending} className="w-full bg-rose-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-rose-600/20 hover:bg-rose-700 active:scale-95 disabled:opacity-50 transition-all uppercase text-xs tracking-widest">
            {isPending ? "Procesando..." : "Abrir Turno"}
          </button>

          {openState.message && (
            <div className={`rounded-xl p-3 text-[10px] font-black uppercase tracking-tight text-center ${openState.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {openState.message}
            </div>
          )}
        </form>
      </div>
    );
  }

  // --- Caja abierta ---
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">Operaciones</h3>
        <div className="flex flex-col gap-3">
          <ExpenseDialog />
        </div>
      </div>

      <div className="bg-neutral-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-neutral-500">Cierre de Arqueo</h3>
            <p className="text-[10px] font-mono text-emerald-500 mt-1 uppercase">Sesión #{session.id}</p>
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        </div>

        <div className="mb-8 relative z-10">
          <p className="text-[10px] font-black text-neutral-500 uppercase mb-2 tracking-widest">Efectivo en Sistema</p>
          <p className="text-4xl font-black text-emerald-400 tracking-tighter italic">
            {balance.toFixed(2)} <span className="text-xs text-neutral-500 uppercase font-normal not-italic">Bs</span>
          </p>
        </div>

        <div className="relative z-10">
          <CashCloseForm session={session} />
        </div>
      </div>
    </div>
  );
}