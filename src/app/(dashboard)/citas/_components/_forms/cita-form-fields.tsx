"use client";

import { SeleccionarCliente } from "./seleccionar-cliente";
import { SeleccionarServicio } from "./seleccionar-servicio";

interface CitaFormFieldsProps {
  customerId: string;
  setCustomerId: (id: string) => void;
  clients: any[];
  serviceId: string;
  setServiceId: (id: string) => void;
  services: any[];
  professionalId: string;
  setProfessionalId: (id: string) => void;
  professionals: any[];
  date: string;
  setDate: (date: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

export function CitaFormFields({
  customerId,
  setCustomerId,
  clients,
  serviceId,
  setServiceId,
  services,
  professionalId,
  setProfessionalId,
  professionals,
  date,
  setDate,
  notes,
  setNotes
}: CitaFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      
      {/* 1. Selector de Cliente */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1 flex items-center gap-1">
          Cliente <span className="text-rose-500">*</span>
        </label>
        <SeleccionarCliente 
          value={customerId} 
          onChange={(val: any) => setCustomerId(val.toString())}
          clients={clients} 
        />
      </div>
      
      {/* 2. Selector de Servicio */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1 flex items-center gap-1">
          Servicio <span className="text-rose-500">*</span>
        </label>
        <SeleccionarServicio 
          value={serviceId} 
          onChange={(val: any) => setServiceId(val.toString())}
          services={services} 
        />
      </div>

      {/* 3. Selector de Profesional (Encargado) */}
      <div className="md:col-span-2 flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">
          ¿Quién realizará el servicio? (Encargado o asistente)
        </label>
        <div className="relative group">
          <select
            value={professionalId}
            onChange={(e) => setProfessionalId(e.target.value)}
            className="w-full rounded-2xl border border-rose-100 bg-white px-5 py-4 text-sm font-semibold text-neutral-800 outline-none focus:ring-2 focus:ring-[#e90044]/20 focus:border-[#e90044] transition-all appearance-none cursor-pointer shadow-sm hover:border-rose-200"
          >
            <option value="">Cualquier encargado o asistente disponible</option>
            {professionals?.map((p: any) => (
              <option key={p.id} value={p.id.toString()}>
                👤 {p.name}
              </option>
            ))}
          </select>
          {/* Icono de flecha personalizado */}
          <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-neutral-400 group-hover:text-[#e90044]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>

      {/* 4. Selector de Fecha */}
      <div className="md:col-span-1 flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1 flex items-center gap-1">
          Fecha <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-2xl border border-rose-100 bg-white px-5 py-4 text-sm font-semibold text-neutral-800 outline-none focus:ring-2 focus:ring-[#e90044]/20 focus:border-[#e90044] transition-all cursor-text"
          />
        </div>
      </div>

      {/* 5. Notas */}
      <div className="md:col-span-2 flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">
          Notas / Requerimientos
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: La cliente es alérgica a ciertos esmaltes, o prefiere café frío..."
          className="h-32 w-full rounded-2xl border border-rose-100 bg-white px-5 py-4 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-[#e90044]/20 focus:border-[#e90044] resize-none transition-all placeholder:text-neutral-300 placeholder:italic"
        />
      </div>
    </div>
  );
}