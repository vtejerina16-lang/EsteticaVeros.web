export type CitaStatus =
  | "Pendiente"
  | "Confirmada"
  | "Cliente llegó"
  | "En progreso"
  | "Completada"
  | "Cancelada"
  | "No Show";
export type CitaChannel = "whatsapp" | "phone" | "walk_in" | "instagram" | "web";
export type UpdateCitaInput = Partial<CreateCitaInput>;
export type Cita = {
  id: string;
  startAt: string; // ISO: YYYY-MM-DDTHH:mm
  endAt: string;
  client: { id: string; name: string; phone?: string };
  service: { id: string; name: string; durationMin: number; price?: number };
  professional?: { id: string; name: string };
  status: CitaStatus;
  channel: CitaChannel;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
export type CitaRow = {
  id: string;
  startAt: string;
  endAt: string;
  dateLabel: string;
  timeLabel: string;
  clientName: string;
  serviceName: string;
  professionalName: string;
  status: CitaStatus;
  channel: CitaChannel;
  // 👇 Añadimos estos campos para los cobros y redirecciones
  clientId?: string;
  serviceId?: string;
  amount?: number;
};
export type ListCitasParams = {
  search?: string;
  status?: CitaStatus | "all";
  page?: number;
  perPage?: number;
};

export type ListCitasResult = {
  items: Cita[];
  totalCount: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export type CreateCitaInput = {
  clientId: string;
  serviceId: string;
  professionalId?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  channel?: CitaChannel;
};
