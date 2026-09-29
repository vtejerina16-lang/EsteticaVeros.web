"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAppointment, updateAppointment, getAvailableSlots } from "../../_actions/citas-actions";
import { CitaFormFields } from "./cita-form-fields";
import { CitaRowActions } from "../cita-row-actions";
import { toast } from "sonner"; 

interface CitaFormProps {
  mode?: "create" | "edit";
  initial?: any;
  clients?: any[];
  services?: any[];
  professionals?: any[];
  users?: any[]; 
}

export function CitaForm({ 
  mode = "create", 
  initial, 
  clients = [], 
  services = [], 
  professionals = [],
  users = [] 
}: CitaFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const listaEncargados = professionals.length > 0 ? professionals : users;

  const [customerId, setCustomerId] = useState(initial?.client?.id?.toString() ?? "");
  const [serviceId, setServiceId] = useState(initial?.service?.id?.toString() ?? "");
  const [encargadoId, setEncargadoId] = useState(initial?.professional?.id?.toString() ?? "");
  const [date, setDate] = useState(initial?.startAt?.split("T")[0] ?? "");
  const [time, setTime] = useState(initial?.startAt?.split("T")[1]?.substring(0, 5) ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const previousSlotKey = useRef(`${serviceId}|${date}|${encargadoId}`);

  type Slot = { time: string; isAvailable: boolean };
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function validateForm() {
    const errors: string[] = [];
    const normalizedCustomer = customerId.trim();
    const normalizedService = serviceId.trim();
    const normalizedDate = date.trim();
    const normalizedTime = time.trim();

    if (!normalizedCustomer) {
      errors.push("Selecciona un cliente para la cita.");
    }

    if (!normalizedService) {
      errors.push("Selecciona un servicio para la cita.");
    }

    if (!normalizedDate) {
      errors.push("Selecciona una fecha válida para la cita.");
    }

    if (!normalizedTime) {
      errors.push("Selecciona un horario disponible.");
    }

    if (normalizedDate && mode === "create") {
      const selectedDate = new Date(`${normalizedDate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (Number.isNaN(selectedDate.getTime())) {
        errors.push("La fecha seleccionada no tiene un formato válido.");
      } else if (selectedDate < today) {
        errors.push("La fecha no puede ser anterior a hoy.");
      }
    }

    if (normalizedTime && !/^\d{2}:\d{2}$/.test(normalizedTime)) {
      errors.push("El horario debe tener formato HH:MM.");
    }

    if (notes.trim().length > 300) {
      errors.push("Las notas no pueden superar los 300 caracteres.");
    }

    return errors;
  }

  // Carga de horarios
  useEffect(() => {
    if (!serviceId || !date) return;

    async function load() {
      const slotKey = `${serviceId}|${date}|${encargadoId}`;
      const initialSlotKey = `${initial?.service?.id?.toString() ?? ""}|${initial?.startAt?.split("T")[0] ?? ""}|${initial?.professional?.id?.toString() ?? ""}`;

      if (previousSlotKey.current !== slotKey && slotKey !== initialSlotKey) {
        setTime("");
      }
      previousSlotKey.current = slotKey;

      setLoadingSlots(true);
      try {
        const selectedService = services.find(s => s.id.toString() === serviceId.toString());
        const duration = selectedService?.durationMin || 30;
        const available = await getAvailableSlots({ serviceId, date, duration, professionalId: encargadoId || undefined }); 

        const normalized: Slot[] = available.map((s: any) => ({ time: s.time, isAvailable: !!s.isAvailable }));

        if (mode === "edit" && initial?.startAt?.split("T")[0] === date) {
          const currentTime = initial?.startAt?.split("T")[1]?.substring(0, 5);
          if (currentTime) {
            const idx = normalized.findIndex(s => s.time === currentTime);
            if (idx === -1) {
              normalized.push({ time: currentTime, isAvailable: true });
            } else {
              normalized[idx].isAvailable = true;
            }
            normalized.sort((a, b) => a.time.localeCompare(b.time));
          }
        }

        setSlots(normalized);
      } catch (err) {
        toast.error("Error al cargar horarios");
      } finally {
        setLoadingSlots(false);
      }
    }
    load();
  }, [serviceId, date, services, mode, initial, encargadoId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      const message = validationErrors[0];
      setFormError(message);
      return toast.warning("Revisa los datos", {
        description: message,
      });
    }

    setFormError(null);

    startTransition(async () => {
      try {
        const payload = {
          clientId: customerId,
          serviceId: serviceId,
          professionalId: (encargadoId && encargadoId !== "") ? encargadoId : undefined,
          date,
          time,
          appointmentDate: `${date}T${time}:00`, // Se envía también el formato ISO por compatibilidad
          notes: notes.trim(),
        };

        if (mode === "create") {
          await createAppointment(payload);
          toast.success("¡Cita creada!", { description: "La reserva se registró correctamente." });
        } else {
          // Pasa tanto el id como el payload completo
          await updateAppointment(initial.id || initial._id, payload);
          toast.success("Cita actualizada correctamente");
        }

        router.push("/citas");
        router.refresh();
      } catch (error: any) {
        const serverMsg = error?.payload?.message || error?.payload?.detail || error?.message || "Revisa los datos e intenta nuevamente.";
        setFormError(serverMsg);
        toast.error("Error al guardar", {
          description: serverMsg,
        });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-8">
      {formError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {formError}
        </div>
      ) : null}

      <CitaFormFields
        customerId={customerId} setCustomerId={setCustomerId} clients={clients}
        serviceId={serviceId} setServiceId={setServiceId} services={services}
        professionalId={encargadoId} setProfessionalId={setEncargadoId} 
        professionals={listaEncargados}
        date={date} setDate={setDate}
        notes={notes} setNotes={setNotes}
      />

      {/* Selector de Horarios */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2">
          Seleccionar Horario {time && <span className="text-[#e90044]">— Seleccionado: {time}</span>}
        </label>
        
        {loadingSlots ? (
          <div className="grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 rounded-xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-8">
            {slots.map(s => (
              <button
                key={s.time}
                type="button"
                onClick={() => s.isAvailable && setTime(s.time)}
                disabled={!s.isAvailable}
                className={`py-3 rounded-xl border text-sm font-bold transition-all duration-200 ${
                  time === s.time
                    ? 'bg-[#e90044] text-white border-[#e90044] shadow-lg shadow-rose-200 scale-105 z-10'
                    : s.isAvailable
                      ? 'bg-white border-neutral-100 text-neutral-700 hover:border-rose-300 hover:bg-rose-50/30'
                      : 'bg-neutral-50 border-neutral-100 text-neutral-300 cursor-not-allowed'
                }`}
                title={!s.isAvailable ? 'Horario ocupado' : ''}
              >
                {s.time}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-sm text-neutral-400 italic bg-neutral-50 p-6 rounded-2xl border border-dashed border-neutral-200 text-center">
            {serviceId && date ? "No hay horarios disponibles para este día." : "Selecciona servicio y fecha para consultar disponibilidad."}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4">
        {mode === "edit" && initial && (
          <div className="flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
            <div className="flex justify-between items-center">
               <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Estado de la cita</p>
               <span className="text-[10px] font-medium text-neutral-300 italic">Cambios inmediatos</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <CitaRowActions id={initial.id} status={initial.status} />
            </div>
          </div>
        )}

        <button 
          type="submit"
          disabled={isPending || !time} 
          className={`w-full rounded-2xl py-4 text-white shadow-xl transition-all active:scale-[0.98] disabled:opacity-40 disabled:grayscale ${
            isPending ? 'bg-neutral-400' : 'bg-[#e90044] shadow-rose-200 hover:bg-[#c7003a]'
          }`}
        >
          <span className="font-bold tracking-tight">
            {isPending ? "GUARDANDO..." : mode === "create" ? "CONFIRMAR RESERVA" : "ACTUALIZAR DATOS"}
          </span>
        </button>
      </div>
    </form>
  );
}