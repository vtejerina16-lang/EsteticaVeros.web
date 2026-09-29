// src/lib/roles.ts

import "server-only";

type JwtPayload = Record<string, unknown>;

export function getRoleFromToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson) as JwtPayload;

    const role = payload["role"];
    if (typeof role === "string") return role;

    const msRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (typeof msRole === "string") return msRole;

    return null;
  } catch {
    return null;
  }
}

export function isAdminRole(role: string | null): boolean {
  const r = (role ?? "").trim().toLowerCase();
  return r === "administrator" || r === "admin" || r === "adminstrator" || r === "administrador";
}