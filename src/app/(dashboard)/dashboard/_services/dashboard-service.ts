import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import type { 
  DashboardSummaryDto, 
  DashboardAppointmentDto, 
  DashboardPaymentDto,
  AppointmentStatus 
} from "../_types/dashboard-types";

type Args = { token: string };

export async function getDashboardSummary({ token }: Args): Promise<DashboardSummaryDto> {
  noStore();

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:57679";

  try {
    // 1. Cargamos los 5 módulos del backend en paralelo
    const [resApps, resPayments, resCash, resServices, resCustomers] = await Promise.all([
      fetch(`${base}/api/appointments`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }),
      fetch(`${base}/api/payments`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }),
      fetch(`${base}/api/cash-register-sessions`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }),
      fetch(`${base}/api/service-categories?is_active=true`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }),
      fetch(`${base}/api/customers`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
    ]);

    // Validamos que la API local responda bien
    if (!resApps.ok || !resPayments.ok || !resCash.ok || !resServices.ok || !resCustomers.ok) {
      throw new Error("Error de conexión con el backend local");
    }

    const [apps, pays, cash, services, customers] = await Promise.all([
      resApps.json(), resPayments.json(), resCash.json(), resServices.json(), resCustomers.json()
    ]);

    const rawApps = apps.appointments || [];
    const rawPays = pays.payments || [];
    const rawSessions = cash.sessions || [];
    const rawCats = services.categories || [];
    const rawCusts = customers.customers || []; // Ajustado para que lea tu nuevo cliente

    // 2. Lógica de Fechas (Horario Bolivia)
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 3. Estado de la Caja Registradora
    const activeSession = rawSessions.find((s: any) => s.closedAt === null);
    
    const cashBoxData = {
      isOpen: !!activeSession,
      openingAmount: activeSession ? Number(activeSession.initialAmount) : 0,
      currentAmount: activeSession ? Number(activeSession.expectedAmount) : 0,
      lastCloseAt: !activeSession && rawSessions.length > 0 ? rawSessions[0].closedAt : undefined
    };

    // 4. Mapeo para las tablas del dashboard
    const upcomingAppointments: DashboardAppointmentDto[] = rawApps.map((a: any) => ({
      id: String(a.id),
      startsAt: a.appointmentDate,
      clientName: a.customerName,
      serviceName: "Servicio", 
      staffName: "Vero", 
      status: (a.status?.toLowerCase() || "scheduled") as AppointmentStatus,
      amount: Number(a.totalAmount)
    }));

    const recentPayments: DashboardPaymentDto[] = rawPays.map((p: any) => ({
      id: String(p.id),
      paidAt: p.paymentDate,
      clientName: p.customerName,
      concept: p.notes || `Cobro #${p.paymentNumber}`,
      method: p.paymentMethodName?.toLowerCase().includes("qr") ? "qr" : "cash",
      amount: Number(p.amount),
      status: p.statusName?.toLowerCase() === "completado" ? "paid" : "pending"
    }));

    // 5. Retorno del objeto final (Lo que ven tus widgets)
    return {
      asOf: new Date().toISOString(),
      kpis: {
        appointmentsToday: rawApps.filter((a: any) => a.appointmentDate.startsWith(todayStr)).length,
        appointmentsNext7Days: rawApps.length,
        newClientsLast7Days: rawCusts.length, // <--- Aquí aparecerá tu cliente nuevo
        revenueToday: rawPays
          .filter((p: any) => p.paymentDate.startsWith(todayStr))
          .reduce((sum: number, p: any) => sum + Number(p.amount), 0),
        revenueThisMonth: rawPays
          .filter((p: any) => {
            const d = new Date(p.paymentDate);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
          })
          .reduce((sum: number, p: any) => sum + Number(p.amount), 0),
        activeServices: rawCats.length
      },
      cashBox: cashBoxData,
      upcomingAppointments: upcomingAppointments.slice(0, 5),
      recentPayments: recentPayments.slice(0, 5)
    };

  } catch (err) {
    console.error("Error crítico en local:", err);
    throw err; 
  }
}