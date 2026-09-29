import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { getClientes, getServicios, getUsuariosEncargados } from "../_services/citas-service"; //
import { CitaForm } from "../_components/_forms/cita-form"; //
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NuevaCitaPage() {
  // 1. Verificamos sesión antes de cargar datos
  const token = await getAccessToken();
  if (!token) redirect("/login");

  // 2. Cargamos todos los datos necesarios en paralelo para optimizar la velocidad
  const [clientes, servicios, usuarios] = await Promise.all([
    getClientes(),
    getServicios(),
    getUsuariosEncargados()
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Cabecera con botón de retorno al listado principal */}
      <div className="flex items-center gap-4">
        <Link 
          href="/citas" 
          className="group flex h-10 w-10 items-center justify-center rounded-xl border border-rose-100 bg-white transition-all hover:bg-rose-50"
        >
          <ChevronLeft className="h-5 w-5 text-rose-600 transition-transform group-hover:-translate-x-0.5" />
        </Link>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-rose-500">Alta de Reserva</p>
          <h1 className="text-2xl font-extrabold text-neutral-900">Agendar Nueva Cita</h1>
        </div>
      </div>

      {/* Contenedor del Formulario con los datos inyectados */}
      <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm shadow-rose-100/50">
        <CitaForm 
          mode="create" 
          clients={clientes} 
          services={servicios} 
          users={usuarios} 
        />
      </div>

      {/* Nota informativa para el usuario */}
      <div className="rounded-2xl bg-neutral-50 p-4 border border-dashed border-neutral-200">
        <p className="text-xs text-neutral-500 leading-relaxed">
          <span className="font-bold text-neutral-700">Nota:</span> Los horarios se basan en la disponibilidad real configurada en el sistema para Vero.
        </p>
      </div>
    </div>
  );
}