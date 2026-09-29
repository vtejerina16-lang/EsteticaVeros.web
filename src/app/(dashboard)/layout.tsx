// src/app/(dashboard)/layout.tsx
import "server-only";

import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { getRoleFromToken, isAdminRole } from "@/lib/roles";

import { Sidebar } from "./_components/sidebar";
import { Topbar } from "./_components/topbar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const role = getRoleFromToken(token);
  const isAdmin = isAdminRole(role);

  return (
    <div className="min-h-dvh bg-rose-50">
      {/* fondo suave tipo mockup */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_30%_0%,rgba(244,114,182,0.20),transparent_60%),radial-gradient(70%_60%_at_80%_30%,rgba(236,72,153,0.12),transparent_55%)]" />

      <div className="mx-auto flex min-h-dvh w-full max-w-[1400px] gap-5 p-4 md:p-6">
        <Sidebar isAdmin={isAdmin} />

        <div className="min-w-0 flex-1">
          <Topbar token={token} />
          <main className="mt-4">{children}</main>
        </div>
      </div>
    </div>
  );
}