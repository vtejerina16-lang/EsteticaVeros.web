import type { Cita, CitaRow } from "../_types";

function pick<T = any>(obj: any, ...keys: string[]): T | undefined {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null) return value as T;
  }
}

function toLocalIso(value: any): string {
  const raw = value?.toString?.() ?? "";
  if (!raw) return new Date().toISOString().slice(0, 19);

  const normalized = raw.includes(" ") ? raw.replace(" ", "T") : raw;
  return normalized.split(".")[0].replace(/Z$/, "").slice(0, 19);
}

function addMinutes(localIso: string, minutes: number): string {
  const date = new Date(localIso);
  if (Number.isNaN(date.getTime())) return localIso;

  const end = new Date(date.getTime() + minutes * 60_000);
  const pad = (n: number) => String(n).padStart(2, "0");

  return [
    end.getFullYear(),
    pad(end.getMonth() + 1),
    pad(end.getDate()),
  ].join("-") + `T${pad(end.getHours())}:${pad(end.getMinutes())}:${pad(end.getSeconds())}`;
}

function normalizeStatus(status: any): Cita["status"] {
  const value = (status?.toString?.() ?? "").trim().toLowerCase();

  if (["pending", "pendiente", "programada", "scheduled"].includes(value)) return "Pendiente";
  if (["confirmed", "confirmada"].includes(value)) return "Confirmada";
  if (["checkedin", "checked_in", "cliente llegó", "cliente llego"].includes(value)) return "Cliente llegó";
  if (["inprogress", "in_progress", "en progreso"].includes(value)) return "En progreso";
  if (["completed", "completada", "finalizada"].includes(value)) return "Completada";
  if (["cancelled", "canceled", "cancelada"].includes(value)) return "Cancelada";
  if (["noshow", "no_show", "no show"].includes(value)) return "No Show";

  return "Pendiente";
}

export function adaptAppointmentFromBackend(dto: any): Cita {
  const data = dto.appointment || dto.Appointment || dto;
  const services = pick<any[]>(data, "services", "Services", "serviceItems", "ServiceItems") ?? [];
  const firstService = services[0] ?? {};

  const startAt = toLocalIso(pick(data, "appointmentDate", "AppointmentDate", "startAt", "StartAt", "startTime", "StartTime"));
  const duration = Number(pick(data, "estimatedDuration", "EstimatedDuration", "duration", "Duration") ?? 30);
  const assistantId = pick(data, "assignedAssistantId", "AssignedAssistantId", "professionalId", "ProfessionalId", "assistantId", "AssistantId");
  const assistantName = pick<string>(data, "assignedAssistantName", "AssignedAssistantName", "professionalName", "ProfessionalName", "assistantName", "AssistantName");

  return {
    id: (pick(data, "id", "Id") ?? "0").toString(),
    startAt,
    endAt: addMinutes(startAt, duration),
    client: {
      id: (pick(data, "customerId", "CustomerId", "clientId", "ClientId") ?? "0").toString(),
      name: pick(data, "customerName", "CustomerName", "clientName", "ClientName") || "Cliente Desconocido",
    },
    service: {
      id: (pick(firstService, "serviceId", "ServiceId", "id", "Id") ?? pick(data, "serviceId", "ServiceId") ?? "0").toString(),
      name: pick(firstService, "serviceName", "ServiceName", "name", "Name") ?? pick(data, "serviceName", "ServiceName") ?? "Servicio",
      durationMin: duration,
      price: Number(pick(data, "totalAmount", "TotalAmount", "price", "Price") ?? 0),
    },

    professional: assistantId
      ? { id: assistantId.toString(), name: assistantName || "Encargado asignado" }
      : undefined,

    status: normalizeStatus(pick(data, "statusName", "StatusName", "status", "Status")),
    channel: data.sourceName?.toLowerCase().includes("web") ? "web" : "whatsapp",
    notes: pick(data, "notes", "Notes") || "",
    createdAt: toLocalIso(pick(data, "createdAt", "CreatedAt")),
    updatedAt: toLocalIso(pick(data, "updatedAt", "UpdatedAt")),
  };
}

export function toCitaRow(c: Cita): CitaRow {
  const start = new Date(c.startAt);
  return {
    id: c.id,
    startAt: c.startAt,
    endAt: c.endAt,
    dateLabel: start.toLocaleDateString("es-BO", { weekday: "short", day: "2-digit", month: "short" }),
    timeLabel: start.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit", hour12: false }),
    clientName: c.client.name,
    serviceName: c.service.name,
    professionalName: c.professional?.name ?? "",

    status: c.status,
    channel: c.channel,

    // 👇 Añadidos para pasar al formulario de cobros
    clientId: c.client.id,
    serviceId: c.service.id,
    amount: c.service.price,
  };
}