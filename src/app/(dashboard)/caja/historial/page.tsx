// FILE: src/app/(dashboard)/caja/historial/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { listSessions, listReconciliations } from "../_services/cash-service";
import { approveReconciliationAction, rejectReconciliationAction } from "../_actions/cash-actions";
import { formatBs, formatLocalTime, sessionStatusLabel, getStatusBadgeClass } from "../_adapters/cash-adapter";

export const dynamic = "force-dynamic";

export default async function CajaHistorialPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  // 🌟 OBTENEMOS SESIONES Y ARQUEOS EN PARALELO
  const [sessions, reconciliations] = await Promise.all([
    listSessions(token),
    listReconciliations(token)
  ]);

  // 🌟 Filtramos los arqueos que necesitan revisión (Asumimos que C# manda status 'Pending')
  const pendientes = reconciliations.filter((r: any) => r.status === 'Pending' || r.statusName === 'Pendiente');

  return (
    <section className="rounded-3xl border border-rose-100 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-rose-50 pb-6 mb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Panel de Gerencia</p>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Auditoría de Caja</h1>
        </div>
        <Link className="rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-all shadow-sm" href="/caja">
          ← Volver al Punto de Venta
        </Link>
      </div>

      {/* 🌟 NUEVA SECCIÓN: ARQUEOS PENDIENTES DE APROBACIÓN */}
      {pendientes.length > 0 && (
        <div className="mb-10 bg-neutral-50 p-6 rounded-[2rem] border border-neutral-100">
          <h2 className="text-xs font-black uppercase tracking-widest text-rose-600 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            Requieren Aprobación ({pendientes.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendientes.map((rec: any) => (
              <div key={rec.id} className="bg-white border-2 border-rose-100 p-6 rounded-3xl shadow-lg shadow-rose-500/5">
                <div className="flex justify-between items-center mb-4 border-b border-neutral-50 pb-4">
                  <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">Arqueo #{rec.id}</span>
                  <span className="text-[10px] font-mono text-neutral-500">Sesión #{rec.cashRegisterSessionId}</span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-xs text-neutral-500 font-bold">Dinero Físico (Contado)</span>
                    <span className="text-sm font-black text-emerald-600">{formatBs(rec.countedAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-neutral-500 font-bold">Diferencia en Sistema</span>
                    <span className={`text-sm font-black ${rec.difference < 0 ? 'text-rose-600' : 'text-neutral-400'}`}>
                      {rec.difference > 0 ? '+' : ''}{formatBs(rec.difference || 0)}
                    </span>
                  </div>
                  {rec.notes && <p className="text-[10px] text-neutral-400 italic mt-3 bg-neutral-50 p-2 rounded-lg">"{rec.notes}"</p>}
                </div>

                <div className="flex gap-3">
                  <form action={rejectReconciliationAction} className="flex-1">
                    <input type="hidden" name="reconciliationId" value={rec.id} />
                    <button className="w-full py-3 bg-white border-2 border-rose-100 text-rose-600 rounded-2xl text-xs font-black hover:bg-rose-50 transition-all uppercase tracking-widest">Rechazar</button>
                  </form>
                  <form action={approveReconciliationAction} className="flex-1">
                    <input type="hidden" name="reconciliationId" value={rec.id} />
                    <button className="w-full py-3 bg-emerald-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all uppercase tracking-widest">Aprobar</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABLA DE HISTORIAL DE SESIONES */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-4 ml-2">Historial General de Turnos</h2>
        <div className="overflow-hidden rounded-[2rem] border border-rose-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-rose-50/60 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-6 py-4 text-left">ID Sesión</th>
                <th className="px-6 py-4 text-left">Estado</th>
                <th className="px-6 py-4 text-left">Apertura</th>
                <th className="px-6 py-4 text-left">Cierre</th>
                <th className="px-6 py-4 text-right">Efectivo Sistema</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-rose-50/20 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-neutral-900">#{s.id}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadgeClass(s.status)}`}>
                      {sessionStatusLabel[s.status] || s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{formatLocalTime(s.openedAt)}</td>
                  <td className="px-6 py-4 text-neutral-600">
                    {s.closedAt ? formatLocalTime(s.closedAt) : <span className="text-[10px] font-bold text-rose-400 animate-pulse">EN CURSO</span>}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-neutral-800">{formatBs(s.expectedAmount ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}