import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";

import { getPayments } from "./_services/payments-service";
import { toPaymentRow } from "./_adapters/payment-adapter";
import { PaymentsKpis } from "./_components/payments-kpis";
import { PaymentsFilters } from "./_components/payments-filters";
import { PaymentsTable } from "./_components/payments-table";
import { PaymentsPagination } from "./_components/payments-pagination";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const pickOne = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function PagosPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;

  const token = await getAccessToken();
  if (!token) redirect("/login");

  // 1. PROCESAMIENTO DE PARÁMETROS DE LA URL
  const search = pickOne(sp.search) ?? "";
  
  // Obtenemos lo que dice la URL, si no dice nada asumimos "all"
  const statusParam = pickOne(sp.status) ?? "all";
  const methodParam = pickOne(sp.method) ?? "all";
  
  const page = Number(pickOne(sp.page) ?? 1);
  const perPage = Number(pickOne(sp.per_page) ?? 10);

  // 2. EL ESCUDO CONTRA EL ERROR Ardalis.SmartEnum
  // Si el frontend dice "all", no se lo mandamos a C# porque explota.
  // Lo convertimos en `undefined` para que C# devuelva la lista completa sin filtrar.
  const statusForBackend = statusParam === "all" ? undefined : statusParam;
  const methodForBackend = methodParam !== "all" ? Number(methodParam) : undefined;

  // 3. LLAMADA AL SERVICIO (usando las variables limpias)
  const paged = await getPayments(token, { 
    search, 
    status: statusForBackend, // Ya no mandamos "all"
    methodId: methodForBackend, // Ya no mandamos "all"
    page, 
    perPage 
  });

  // 4. ADAPTACIÓN DE DATOS (Manejando posibles fallos de conexión)
  const items = paged?.items || [];
  const rows = items.map(toPaymentRow);

  return (
    <section className="rounded-3xl border border-rose-100 bg-white p-6 md:p-8 shadow-sm">
      {/* CABECERA PRINCIPAL */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-rose-50 pb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Finanzas</p>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Gestión de Cobros</h1>
          <p className="mt-1 text-xs text-neutral-500 font-medium">
            Historial detallado de ingresos, ventas y servicios realizados.
          </p>
        </div>
        
        <Link
          href="/pagos/nuevo"
          className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-8 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg hover:bg-neutral-800 active:scale-95 transition-all"
        >
          <span className="mr-2 text-lg">+</span> Registrar Cobro
        </Link>
      </div>

      <div className="mt-8 space-y-8">
        {/* RESUMEN FINANCIERO (KPIs) */}
        <PaymentsKpis items={items} />

        {/* FILTROS AVANZADOS */}
        <div className="space-y-4">
          <h2 className="px-2 text-[10px] font-black uppercase tracking-tighter text-neutral-400">
            Filtros de Búsqueda
          </h2>
          {/* A los filtros SÍ les mandamos "all" para que la UI sepa qué mostrar */}
          <PaymentsFilters
            initialSearch={search}
            initialStatus={statusParam}
            initialMethod={methodParam}
          />
        </div>

        {/* TABLA DE RESULTADOS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black uppercase tracking-tighter text-neutral-800">
              Listado de Transacciones
            </h2>
            <span className="text-[10px] font-bold text-rose-400 uppercase">
              {paged?.totalCount || 0} resultados encontrados
            </span>
          </div>
          <PaymentsTable rows={rows} />
        </div>

        {/* PAGINACIÓN */}
        <PaymentsPagination
          page={page}
          totalPages={paged?.totalPages || 1}
          perPage={perPage}
          totalCount={paged?.totalCount || 0}
        />
      </div>
    </section>
  );
}