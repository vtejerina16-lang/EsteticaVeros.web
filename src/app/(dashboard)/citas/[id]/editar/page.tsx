import { notFound, redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { 
  getCitaById, 
  getClientes, 
  getServicios, 
  getUsuariosEncargados // 🚩 Importante para ver a los encargados
} from "../../_services/citas-service";
import { CitaForm } from "../../_components/_forms/cita-form";
import { CitaRowActions } from "../../_components/cita-row-actions";

export const dynamic = "force-dynamic";

export default async function EditarCitaPage({ params }: { params: Promise<{ id: string }> }) {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const { id } = await params;

  // 🚀 CARGA MAESTRA: Traemos todo de un solo golpe para que no falte nada
  const [cita, clientes, servicios, encargados] = await Promise.all([
    getCitaById(id),
    getClientes(),
    getServicios(),
    getUsuariosEncargados() 
  ]);

  if (!cita) notFound();

  return (
    <div className="space-y-4">
      {/* ⚡ BARRA DE ACCIONES RÁPIDAS: Cambia el estado sin entrar al formulario */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-sm">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Estado de Atención</p>
          <h2 className="text-sm font-bold text-neutral-800">
            Estado actual: <span className="text-emerald-700 uppercase">{cita.status}</span>
          </h2>
        </div>
        
        {/* Reutilizamos el componente de acciones que ya tenemos blindado */}
        <div className="flex scale-110 items-center gap-2 pr-2">
          <CitaRowActions id={cita.id} status={cita.status} />
        </div>
      </section>

      {/* FORMULARIO DE EDICIÓN */}
      <section className="rounded-3xl border border-rose-100 bg-white p-6 shadow-md">
        <div className="mb-8 border-b border-rose-50 pb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-500">Gestión de Agenda</p>
          <h1 className="text-2xl font-black text-neutral-900">Editar Cita #{cita.id}</h1>
        </div>

        {/* 🚩 PASAMOS TODO AL FORMULARIO: Ahora sí tendrá los nombres para el dropdown */}
        <CitaForm 
          mode="edit" 
          initial={cita} 
          clients={clientes} 
          services={servicios} 
          professionals={encargados} 
        />
      </section>
    </div>
  );
}