"use server";

import { fetchJson } from "@/lib/http";
import { getAccessToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { adaptAppointmentFromBackend } from "../_adapters/cita-adapter";
import type { CreateCitaInput, Cita, UpdateCitaInput } from "../_types";

/**
 * 🔹 Obtener horarios disponibles
 */
export async function getAvailableSlots(params: {
  serviceId: string;
  date: string;
  duration?: number;
  professionalId?: string | number | null;
}): Promise<{ time: string; isAvailable: boolean }[]> {
  try {
    const token = await getAccessToken();
    const qObj: Record<string, string> = {
      date: params.date,
      serviceId: params.serviceId,
      estimated_duration: (params.duration || 30).toString(),
    };

    if (params.professionalId) qObj.assignedAssistantId = String(params.professionalId);

    const query = new URLSearchParams(qObj).toString();
    
    const res = await fetchJson<any>(`/api/appointments/available-slots?${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const rawSlots = res?.slots || [];

    if (!Array.isArray(rawSlots)) return [];

    return rawSlots.map((s: any) => {
      const timePart = (s.startTime || s.start_time || s.startAt || s.startAtTime || "").toString();
      const time = timePart.includes("T") ? timePart.split("T")[1].substring(0, 5) : (timePart.split(" ")[1] || timePart).substring(0, 5);
      return { time, isAvailable: !!s.isAvailable };
    });
  } catch (error: any) {
    console.error("❌ Error en slots:", error.payload || error);
    return [];
  }
}

/**
 * 🔹 Crear una nueva cita
 */
export async function createAppointment(data: CreateCitaInput): Promise<Cita> {
  const token = await getAccessToken();

  const assistantId = data.professionalId && data.professionalId !== ""
    ? parseInt(data.professionalId, 10)
    : null;

  // Verificar conflicto
  if (assistantId) {
    try {
      const q = new URLSearchParams({
        date: data.date,
        assignedAssistantId: String(assistantId),
      }).toString();

      const existing = await fetchJson<any>(`/api/appointments?${q}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const items = existing.appointments || existing.items || (Array.isArray(existing) ? existing : []);
      const conflict = items.some((it: any) => {
        const appt = it.appointmentDate || it.startAt || it.appointment_date || it.start_time;
        if (!appt) return false;
        const apptStr = appt.toString();
        const apptDate = apptStr.includes("T") ? apptStr.split("T")[0] : apptStr.split(" ")[0];
        const apptTime = apptStr.includes("T") ? apptStr.split("T")[1].substring(0,5) : (apptStr.split(" ")[1] || apptStr).substring(0,5);
        return apptDate === data.date && apptTime === data.time;
      });

      if (conflict) {
        throw new Error("Ya existe una cita con ese encargado a la misma hora.");
      }
    } catch (err: any) {
      if (err instanceof Error && err.message === "Ya existe una cita con ese encargado a la misma hora.") throw err;
    }
  }

  const body = {
    customerId: parseInt(data.clientId, 10),
    appointmentDate: `${data.date}T${data.time}:00`, 
    source: 2, 
    serviceId: parseInt(data.serviceId, 10),
    serviceIds: [parseInt(data.serviceId, 10)],
    assignedAssistantId: (assistantId && !isNaN(assistantId)) ? assistantId : null,
    notes: data.notes ? data.notes.trim() : ""
  };

  const res = await fetchJson<any>("/api/appointments", {
    method: "POST",
    body: body,
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json" 
    }
  });

  revalidatePath("/citas");
  return adaptAppointmentFromBackend(res);
}

/**
 * 🔹 Actualizar una cita existente
 */
export async function updateAppointment(id: string, data: UpdateCitaInput): Promise<Cita> {
  const token = await getAccessToken();
  
  const numericId = parseInt(id, 10);
  const assistantId = data.professionalId && data.professionalId !== ""
    ? parseInt(data.professionalId, 10)
    : null;

  // 1. Validar conflicto de horarios si cambió la fecha, hora o el asistente
  if (assistantId && data.date && data.time) {
    try {
      const q = new URLSearchParams({
        date: data.date,
        assignedAssistantId: String(assistantId),
      }).toString();

      const existing = await fetchJson<any>(`/api/appointments?${q}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const items = existing.appointments || existing.items || (Array.isArray(existing) ? existing : []);
      const conflict = items.some((it: any) => {
        const appt = it.appointmentDate || it.startAt || it.appointment_date || it.start_time;
        const apptId = it.id?.toString?.() || it.appointmentId?.toString?.();
        
        // Ignorar la cita que estamos editando
        if (apptId && apptId === id) return false;
        if (!appt) return false;
        
        const apptStr = appt.toString();
        const apptDate = apptStr.includes("T") ? apptStr.split("T")[0] : apptStr.split(" ")[0];
        const apptTime = apptStr.includes("T") ? apptStr.split("T")[1].substring(0,5) : (apptStr.split(" ")[1] || apptStr).substring(0,5);
        return apptDate === data.date && apptTime === data.time;
      });

      if (conflict) {
        throw new Error("El horario seleccionado ya está ocupado por otra cita del mismo encargado.");
      }
    } catch (err: any) {
      if (err instanceof Error && (err.message === "El horario seleccionado ya está ocupado por otra cita del mismo encargado.")) {
        throw err;
      }
    }
  }

  // 2. Construir el payload exacto que espera UpdateAppointmentRequest
  const serviceIdParsed = data.serviceId ? parseInt(data.serviceId, 10) : null;
  const formattedDate = data.date && data.time ? `${data.date}T${data.time}:00` : undefined;

  const body = {
    appointmentId: !isNaN(numericId) ? numericId : id,
    ...(formattedDate && { appointmentDate: formattedDate }),
    ...(serviceIdParsed && { serviceIds: [serviceIdParsed] }),
    assignedAssistantId: (assistantId && !isNaN(assistantId)) ? assistantId : null,
    notes: data.notes ? data.notes.trim() : "",
    customerNotes: "",
    internalNotes: ""
  };

  const res = await fetchJson<any>(`/api/appointments/${id}`, {
    method: "PUT",
    body: body,
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json" 
    }
  });
  
  revalidatePath("/citas");
  revalidatePath(`/citas/${id}`, "page");
  revalidatePath(`/citas/${id}/editar`, "page");
  
  return adaptAppointmentFromBackend(res);
}
/**
 * 🔹 Cambiar estado (Confirmar, Iniciar, etc.)
 */
export async function patchCitaStatus(
  id: string, 
  action: "confirm" | "check-in" | "no-show" | "start" | "complete"
) {
  const token = await getAccessToken();
  
  const endpointMap: Record<string, string> = { 
    "confirm": "confirm", 
    "check-in": "check-in", 
    "no-show": "no-show",
    "start": "start",      
    "complete": "complete" 
  };

  try {
    let body: any = {};
    if (action === "no-show") body = { reason: "Cliente no asistió" };
    if (action === "complete") body = { notes: "Servicio completado" };

    const res = await fetchJson<any>(`/api/appointments/${id}/${endpointMap[action]}`, {
      method: "POST",
      body: body, 
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json" 
      }
    });

    revalidatePath("/citas");
    revalidatePath(`/citas/${id}`, "page");

    return { success: true, data: res };
  } catch (error: any) {
    console.error(`❌ Error en acción ${action}:`, error);
    const errorMsg = error.payload?.message || error.payload?.detail || "Error en el servidor";
    return { success: false, error: errorMsg };
  }
}