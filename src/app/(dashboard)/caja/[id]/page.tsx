import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { listMovementsBySession, listSessions } from "../_services/cash-service";
import { CashMovementsTable } from "../_components/cash-movements-table";
import { CashKpis } from "../_components/cash-kpis";
import { formatLocalTime } from "../_adapters/cash-adapter";

export const dynamic = "force-dynamic";

export default async function CajaSesionDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessionId = Number(id);

  const token = await getAccessToken();
  if (!token) redirect("/login");

  // 1. Obtenemos todas las sesiones para buscar la específica 
  // (O si tienes getSessionById en el service, úsalo directamente)
  const sessions = await listSessions(token);
  const session = sessions.find((s) => s.id === sessionId);

  if (!session) return notFound();

  // 2. Obtenemos los movimientos reales de ESTA sesión
  const movements = await listMovementsBySession(token, sessionId);

  // 3. Calculamos el balance específico de esta sesión
  const totalIn = movements
    .filter((m) => m.type === 1)
    .reduce((acc, m) => acc + m.amount, 0);
  const totalOut = movements
    .filter((m) => m.type === 2)
    .reduce((acc, m) => acc + m.amount, 0);
  
  const sessionBalance = session.openingFloat + totalIn - totalOut;

  return (
    <div className="space-y-6">
      {/* Encabezado con navegación */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            <Link href="/caja" className="hover:text-rose-500 transition-colors">Caja</Link>
            <span>/</span>
            <Link href="/caja/historial" className="hover:text-rose-500 transition-colors">Historial</Link>
            <span>/</span>
            <span className="text-rose-500">Detalle de Sesión</span>
          </nav>
          <h1 className="mt-1 text-3xl font-black text-neutral-900 tracking-tight">
            Sesión #{session.id}
          </h1>
          <p className="text-sm text-neutral-500 font-medium">
            Iniciada el {formatLocalTime(session.openedAt)}
          </p>
        </div>

        <Link
          href="/caja/historial"
          className="inline-flex h-10 items-center rounded-full border border-neutral-200 bg-white px-6 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-all shadow-sm"
        >
          ← Volver al Historial
        </Link>
      </div>

      {/* KPIs específicos de la sesión */}
      <CashKpis
        account={{ name: "Caja Principal", type: "MAIN", id: 1, isActive: true }}
        session={session}
        movements={movements}
        balance={sessionBalance}
      />

      {/* Sección de Movimientos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black uppercase tracking-tighter text-neutral-800">
            Movimientos registrados
          </h2>
          <span className="text-[10px] font-bold text-neutral-400 uppercase">
            {movements.length} operaciones
          </span>
        </div>
        
        <CashMovementsTable movements={movements} />
      </div>

      {/* Footer de Auditoría */}
      <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] font-bold uppercase text-neutral-500">
          <div>
            <p className="text-rose-400">Apertura por:</p>
            <p className="text-neutral-700">Usuario #{session.openedByUserId ?? 'N/A'}</p>
          </div>
          {session.closedAt && (
            <>
              <div>
                <p className="text-rose-400">Cierre por:</p>
                <p className="text-neutral-700">Usuario #{session.closedByUserId ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-rose-400">Fecha de Cierre:</p>
                <p className="text-neutral-700">{formatLocalTime(session.closedAt)}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}