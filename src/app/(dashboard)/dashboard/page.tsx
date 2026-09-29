import "server-only";

import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";

import { getDashboardSummary } from "./_services/dashboard-service";
import { toDashboardVM } from "./_adapters/dashboard-adapter";

import { KpiGrid } from "./_components/kpi-grid";
import { QuickActions } from "./_components/quick-actions";
import { UpcomingAppointments } from "./_components/upcoming-appointments";
import { RecentPayments } from "./_components/recent-payments";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const dto = await getDashboardSummary({ token });
  const vm = toDashboardVM(dto);

  return (
    <section className="space-y-4">
      <KpiGrid items={vm.kpis} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <UpcomingAppointments rows={vm.upcomingAppointments} />
          <RecentPayments rows={vm.recentPayments} />
        </div>

        <div className="space-y-4">
          <QuickActions />
        </div>
      </div>
    </section>
  );
}