import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { listCashRegisters } from "../../caja/_services/cash-service";
import { addRegisterAction, toggleRegisterAction } from "../../caja/_actions/cash-actions";

export const dynamic = "force-dynamic";

export default async function ConfigCajasPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  // Traemos todas las cajas
  const registers = await listCashRegisters(token);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter">Gestión de Cajas</h1>
        <p className="text-sm text-neutral-500 mt-1">Crea, edita o desactiva las cajas registradoras de tus sucursales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* FORMULARIO PARA CREAR NUEVA CAJA */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-800 mb-6">Añadir Nueva Caja</h3>
            <form action={addRegisterAction} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-neutral-400 uppercase ml-2 block mb-1">Nombre de la Caja</label>
                <input name="name" required placeholder="Ej: Caja Salón VIP" className="w-full bg-neutral-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-neutral-900 transition-all border-none" />
              </div>
              <div>
                <label className="text-[10px] font-black text-neutral-400 uppercase ml-2 block mb-1">Ubicación / Sucursal</label>
                <input name="location" placeholder="Ej: Planta Baja" className="w-full bg-neutral-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-neutral-900 transition-all border-none" />
              </div>
              <button className="w-full bg-neutral-900 text-white font-black py-3 rounded-xl hover:bg-neutral-800 transition-all uppercase tracking-widest text-[10px]">
                Crear Caja Registradora
              </button>
            </form>
          </div>
        </div>

        {/* TABLA DE CAJAS EXISTENTES */}
        <div className="md:col-span-2">
          <div className="bg-white overflow-hidden rounded-[2rem] border border-neutral-100 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50/50 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100">
                <tr>
                  <th className="px-6 py-4">Caja Registradora</th>
                  <th className="px-6 py-4">Ubicación</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {registers.map((reg: any) => (
                  <tr key={reg.id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-neutral-900">{reg.name}</td>
                    <td className="px-6 py-4 text-neutral-500">{reg.location || "—"}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${reg.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        {reg.isActive ? "ACTIVA" : "INACTIVA"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* BOTÓN PARA ACTIVAR/DESACTIVAR */}
                      <form action={toggleRegisterAction}>
                        <input type="hidden" name="registerId" value={reg.id} />
                        <input type="hidden" name="currentStatus" value={String(reg.isActive)} />
                        <button className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${reg.isActive ? "text-rose-600 bg-rose-50 hover:bg-rose-100" : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"}`}>
                          {reg.isActive ? "Desactivar" : "Activar"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {registers.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-10 text-neutral-400">No hay cajas registradas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}