// src/app/(dashboard)/usuarios/layout.tsx

import "server-only";

import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { getRoleFromToken, isAdminRole } from "@/lib/roles";

export default async function UsuariosLayout({ children }: { children: React.ReactNode }) {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const role = getRoleFromToken(token);

  if (!isAdminRole(role)) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}