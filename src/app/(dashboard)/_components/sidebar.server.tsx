import "server-only";

import { getAccessToken } from "@/lib/auth";
import { getRoleFromToken, isAdminRole } from "@/lib/roles";
import { Sidebar } from "./sidebar";

export default async function SidebarServer() {
  const token = await getAccessToken();
  const role = token ? getRoleFromToken(token) : null;
  const isAdmin = isAdminRole(role);

  return <Sidebar isAdmin={isAdmin} />;
}