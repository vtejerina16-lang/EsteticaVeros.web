import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";

// Componentes de la UI
import { CitasToolbar } from "./_components/citas-toolbar";
import { CitasFilters } from "./_components/citas-filters";
import { CitasTable } from "./_components/citas-table";
import { CitasPagination } from "./_components/citas-pagination";

// Componentes de Calendario
import { CalendarioHeader } from "./_components/_calendario/calendario-header";
import { CalendarioSemanal } from "./_components/_calendario/calendario-semanal";
import { CalendarioDiario } from "./_components/_calendario/calendario-diario";

// Lógica de datos
import { listCitas, listCitasRange } from "./_services/citas-service";
import { toCitaRow } from "./_adapters/cita-adapter";

// 🚩 Configuración de Next.js para asegurar datos frescos
export const dynamic = "force-dynamic";
export const revalidate = 0; 

// Tipados y utilidades
type SP = Record<string, string | string[] | undefined>;
const pickOne = (v: string | string[] | undefined): string | undefined => 
  Array.isArray(v) ? v[0] : v;

/**
 * Genera la fecha actual en formato YYYY-MM-DD
 */
function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

export default async function CitasPage({ searchParams }: { searchParams: Promise<SP> }) {
  // 🚩 1. Consumimos los searchParams
  const sp = await searchParams;

  // Verificación de sesión
  const token = await getAccessToken();
  if (!token) redirect("/login");

  // 🚩 2. Extraer parámetros de la URL
  const view = (pickOne(sp.view) ?? "list") as "list" | "calendar";
  const mode = (pickOne(sp.mode) ?? "week") as "week" | "day";
  const date = pickOne(sp.date) ?? todayKey();
  const search = pickOne(sp.search) ?? "";
  
  // CORRECCIÓN: Evitamos la doble declaración de 'status'
  const rawStatus = pickOne(sp.status) ?? "all";
  // Si es "all", pasamos undefined para que el servicio traiga todo. 
  // Si no, pasamos el valor real (ej. "Confirmada")
  const statusToFilter = rawStatus === "all" ? undefined : rawStatus;
  
  const page = Number(pickOne(sp.page) ?? 1);
  const perPage = Number(pickOne(sp.per_page) ?? pickOne(sp.perPage) ?? 10);

  // Preparar contenedores de datos
  let listData = null;
  let calendarData = null;

  // 🚩 3. Carga de datos según la vista
  try {
    if (view === "list") {
      const res = await listCitas({ 
        search, 
        status: statusToFilter as any, 
        page, 
        perPage 
      });

      listData = {
        // toCitaRow ahora usa la lógica robusta para encontrar a Juan Pérez
        rows: res.items.map(toCitaRow),
        pagination: {
          page: res.page,
          totalPages: res.totalPages,
          perPage: res.perPage,
          totalCount: res.totalCount
        }
      };
    } else {
      calendarData = await listCitasRange({ 
        search, 
        status: statusToFilter as any 
      });
    }
  } catch (error) {
    console.error("❌ Error cargando citas en la Page:", error);
  }

  return (
    <section className="rounded-3xl border border-rose-100 bg-white/80 p-4 md:p-6 shadow-sm backdrop-blur-md">
      <CitasToolbar view={view} />
      
      <CitasFilters 
        initialSearch={search} 
        initialStatus={rawStatus} 
        initialPerPage={perPage} 
      />

      <div className="mt-6">
        {view === "list" && listData ? (
          <div className="space-y-4">
            <CitasTable rows={listData.rows} />
            
            <CitasPagination 
              page={listData.pagination.page} 
              totalPages={listData.pagination.totalPages} 
              perPage={listData.pagination.perPage} 
              totalCount={listData.pagination.totalCount} 
            />
          </div>
        ) : view === "calendar" && calendarData ? (
          <div className="space-y-4">
            <CalendarioHeader baseDate={date} mode={mode} />
            
            {mode === "week" ? (
              <CalendarioSemanal baseDate={date} citas={calendarData} />
            ) : (
              <CalendarioDiario baseDate={date} citas={calendarData} />
            )}
            
            <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-xs text-neutral-600 italic">
              Tip: Los horarios mostrados se ajustan a la zona horaria local de Bolivia.
            </div>
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-neutral-400">
              {/* Ajuste en la condición del mensaje vacío */}
              {search || (rawStatus !== "all") 
                ? "No se encontraron citas con los filtros aplicados." 
                : "Cargando información de la agenda..."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}