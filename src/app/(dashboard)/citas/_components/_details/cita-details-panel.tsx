import Link from "next/link";
import type { Cita } from "../../_types";
import { CitaStatusBadge } from "../cita-status-badge";
import { CitaNotes } from "./cita-notes";
import { CitaTimeline } from "./cita-timeline";

const CHANNEL_LABEL: Record<string, string> = {
  whatsapp: "WhatsApp",
  phone: "Teléfono",
  walk_in: "Presencial",
  instagram: "Instagram",
  web: "Web",
};

export function CitaDetailsPanel({ cita }: { cita: Cita }) {
  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-rose-100 bg-white p-5 md:p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">Detalle de cita</p>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tighter">#{cita.id}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <CitaStatusBadge status={cita.status} />
              <span className="rounded-full border border-rose-100 bg-rose-50/50 px-3 py-1 text-[11px] font-bold text-neutral-600">
                🚀 {CHANNEL_LABEL[cita.channel] ?? cita.channel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/citas" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-bold text-neutral-700 transition-all hover:bg-neutral-50 active:scale-95">
              Volver
            </Link>
            <Link href={`/citas/${cita.id}/editar`} className="rounded-full bg-[#e90044] px-6 py-2 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-all hover:bg-[#c7003a] active:scale-95">
              Editar
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Cliente */}
          <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Cliente</p>
            <p className="mt-1 text-base font-extrabold text-neutral-900">{cita.client.name}</p>
          </div>

          {/* Servicio */}
          <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Servicio</p>
            <p className="mt-1 text-base font-extrabold text-neutral-900">{cita.service.name}</p>
            <p className="text-xs font-bold text-rose-500">{cita.service.durationMin} min</p>
          </div>

          {/* Profesional - YA NO MUESTRA "ENCARGADO" ESTÁTICO */}
          <div className="rounded-2xl border border-rose-100 bg-white p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Profesional</p>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white uppercase">
                {cita.professional?.name?.substring(0, 1) || "A"}
              </div>
              <p className="text-sm font-extrabold text-neutral-800">
                {cita.professional?.name || "Admin Sistema"}
              </p>
            </div>
          </div>

          {/* Horario */}
          <div className="rounded-2xl border border-rose-100 bg-white p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Horario de atención</p>
            <div className="mt-1 text-xs font-bold text-neutral-700">
              {new Date(cita.startAt).toLocaleTimeString("es-BO", { hour: '2-digit', minute: '2-digit', hour12: false })} 
              <span className="mx-1 text-neutral-300">→</span>
              {new Date(cita.endAt).toLocaleTimeString("es-BO", { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CitaNotes cita={cita} />
        <CitaTimeline cita={cita} />
      </div>
    </div>
  );
}