// src/app/(dashboard)/caja/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { getCurrentMainSession, listMovementsBySession, listCashRegisters } from "./_services/cash-service";
import { CashKpis } from "./_components/cash-kpis";
import { CashActions } from "./_components/cash-actions";
import { CashMovementsTable } from "./_components/cash-movements-table";
import type { CashAccount, CashMovement } from "./_types/cash";

export const dynamic = "force-dynamic";

export default async function CajaPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  // 1. OBTENEMOS LA SESIÓN PRIMERO (Para saber qué caja está abierta)
  const session = await getCurrentMainSession(token);
  
  // 2. DEFINIMOS LA CUENTA (Dinamizada con los datos de la sesión activa)
  const mainAcc: CashAccount = { 
    id: session?.cashRegisterId || 1, 
    name: session?.cashRegisterName || "Caja Principal", 
    type: "MAIN", 
    isActive: true 
  };

  // 3. OBTENEMOS LA LISTA DE CAJAS (Para el selector de apertura)
  const registers = await listCashRegisters(token);
  
  let movements: CashMovement[] = [];
  let totals = { in: 0, out: 0, balance: 0 };

  // 4. SI HAY SESIÓN, CALCULAMOS MOVIMIENTOS Y TOTALES
  if (session) {
    const rawMovements = await listMovementsBySession(token, session.id);
    movements = Array.isArray(rawMovements) ? rawMovements : [];
    
    totals.in = movements.filter(m => m.type === 1).reduce((acc, m) => acc + m.amount, 0);
    totals.out = movements.filter(m => m.type === 2).reduce((acc, m) => acc + m.amount, 0);
    
    // Balance = Monto Inicial + Ingresos - Egresos
    totals.balance = Number(session.initialAmount || 0) + totals.in - totals.out;
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-8">
      {/* Cabecera Profesional */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-neutral-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter">Control de Caja</h1>
          <p className="text-sm font-medium text-neutral-500 mt-1">
            {session ? `Sesión Activa #${session.id} - ${mainAcc.name}` : "No hay sesiones abiertas"}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/caja/historial"
            className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-all shadow-sm"
          >
            Ver Historial
          </Link>
          <div className={`px-4 py-2 rounded-full text-[10px] font-black tracking-[0.2em] shadow-sm ${
            session ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
          }`}>
            ● {session ? "CAJA ABIERTA" : "CAJA CERRADA"}
          </div>
        </div>
      </header>

      {session ? (
        // ESTADO ABIERTO: Dashboard de Operaciones
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <CashKpis totals={totals} initial={session.initialAmount} />
            
            <div className="rounded-3xl border border-neutral-100 bg-white overflow-hidden shadow-sm">
              <div className="bg-neutral-50/50 px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Movimientos de Sesión
                </h3>
                <span className="text-[10px] font-bold text-neutral-400">
                  {movements.length} operaciones
                </span>
              </div>
              <CashMovementsTable movements={movements} />
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-4">
             <CashActions account={mainAcc} session={session} balance={totals.balance} registers={registers} />
          </aside>
        </div>
      ) : (
        // ESTADO CERRADO: Formulario de Apertura Dinámico
        <div className="py-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-500 shadow-inner">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-black text-neutral-900">La caja no ha sido aperturada</h2>
          <p className="mt-2 text-neutral-500 font-medium">Inicia una nueva sesión para habilitar los cobros.</p>
          
          <div className="mt-8 w-full max-w-md text-left mx-auto">
            <CashActions account={mainAcc} session={null} balance={0} registers={registers} />
          </div>
        </div>
      )}
    </div>
  );
}