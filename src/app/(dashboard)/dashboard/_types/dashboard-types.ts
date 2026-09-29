export type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";

export type PaymentMethod = "cash" | "qr";

// --- DTOs (Lo que viene del Service/API) ---
export type DashboardAppointmentDto = {
  id: string;
  startsAt: string;
  clientName: string;
  serviceName: string;
  staffName: string;
  status: AppointmentStatus;
  amount: number;
};

export type DashboardPaymentDto = {
  id: string;
  paidAt: string;
  clientName: string;
  concept: string;
  method: PaymentMethod;
  amount: number;
  status: "paid" | "pending" | "void";
};

export type DashboardCashBoxDto = {
  isOpen: boolean;
  openingAmount: number;
  currentAmount: number;
  lastCloseAt?: string;
};

export type DashboardSummaryDto = {
  asOf: string;
  kpis: {
    appointmentsToday: number;
    appointmentsNext7Days: number;
    newClientsLast7Days: number;
    revenueToday: number;
    revenueThisMonth: number;
    activeServices: number;
  };
  cashBox: DashboardCashBoxDto;
  upcomingAppointments: DashboardAppointmentDto[];
  recentPayments: DashboardPaymentDto[];
};

// --- View Models (Lo que consume la UI/Widgets) ---
export type KpiItem = {
  title: string;
  value: string;
  hint?: string;
  icon?: string;
};

export type UpcomingAppointmentRow = {
  id: string;
  when: string;
  client: string;
  service: string;
  staff: string;
  status: AppointmentStatus;
  amount: string;
};

export type RecentPaymentRow = {
  id: string;
  when: string;
  client: string;
  concept: string;
  method: PaymentMethod;
  amount: string;
  status: "paid" | "pending" | "void";
};

export type DashboardVM = {
  subtitle: string;
  kpis: KpiItem[];
  upcomingAppointments: UpcomingAppointmentRow[];
  recentPayments: RecentPaymentRow[];
};