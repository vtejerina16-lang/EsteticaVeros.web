import type {
  DashboardSummaryDto,
  DashboardAppointmentDto,
  DashboardPaymentDto,
  AppointmentStatus,
  PaymentMethod,
  DashboardVM,
  UpcomingAppointmentRow,
  RecentPaymentRow,
} from "../_types/dashboard-types";

const TZ = "America/La_Paz";

// Helper para formatear dinero en Bolivianos
function moneyBOB(n: number) {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    maximumFractionDigits: 0,
  }).format(n);
}

// Helper para fechas legibles
function formatDateTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("es-BO", {
    timeZone: TZ,
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function toDashboardVM(dto: DashboardSummaryDto): DashboardVM {
  const cashLabel = dto.cashBox.isOpen ? "Caja abierta" : "Caja cerrada";
  
  const kpis = [
    { title: "Citas hoy", value: String(dto.kpis.appointmentsToday), hint: "Agenda del día", icon: "📅" },
    { title: "Próx. 7 días", value: String(dto.kpis.appointmentsNext7Days), hint: "Carga semanal", icon: "🗓️" },
    { title: "Clientes nuevos (7d)", value: String(dto.kpis.newClientsLast7Days), hint: "Crecimiento", icon: "✨" },
    { title: "Ingresos hoy", value: moneyBOB(dto.kpis.revenueToday), hint: "Cobrado hoy", icon: "💸" },
    { title: "Ingresos mes", value: moneyBOB(dto.kpis.revenueThisMonth), hint: "Acumulado", icon: "📈" },
    { title: "Servicios activos", value: String(dto.kpis.activeServices), hint: "Catálogo vigente", icon: "✂️" },
    { title: cashLabel, value: moneyBOB(dto.cashBox.currentAmount), hint: `Apertura: ${moneyBOB(dto.cashBox.openingAmount)}`, icon: "🧾" },
  ];

  return {
    subtitle: `Actualizado: ${new Date(dto.asOf).toLocaleString("es-BO")}`,
    kpis,
    upcomingAppointments: dto.upcomingAppointments.map(a => ({
      id: a.id,
      when: formatDateTime(a.startsAt),
      client: a.clientName,
      service: a.serviceName,
      staff: a.staffName,
      status: a.status,
      amount: moneyBOB(a.amount),
    })),
    recentPayments: dto.recentPayments.map(p => ({
      id: p.id,
      when: formatDateTime(p.paidAt),
      client: p.clientName,
      concept: p.concept,
      method: p.method,
      amount: moneyBOB(p.amount),
      status: p.status,
    })),
  };
  
}