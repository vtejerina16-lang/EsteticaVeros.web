// src/app/(dashboard)/usuarios/_adapters/user-adapter.ts

import "server-only";
import type { UserDto } from "../_services/users-service";
import type { RoleName } from "../_types.users";

export type UserRow = {
  id: number;
  email: string;

  firstName: string;
  lastName: string;
  fullName: string;

  phoneNumber: string | null;
  address: string | null;
  dateOfBirth: string | null;

  lastAccess: string | null;
  roleName: RoleName; // rol canónico del backend
  isActive: boolean;
};

function normalizeRole(role: string | null | undefined): RoleName {
  const r = (role ?? "").trim().toLowerCase();

  // Admin
  if (r === "administrator" || r === "admin" || r === "administrador" || r === "administator")
    return "Administrator";

  // Manager (compatibilidad con roles anteriores tipo Receptionist/Recepcionista)
  if (
    r === "manager" ||
    r === "receptionist" ||
    r === "reception" ||
    r === "recepcion" ||
    r === "recepcionista"
  )
    return "Manager";

  // Assistant (compatibilidad con roles anteriores tipo Specialist)
  if (r === "assistant" || r === "asistente" || r === "specialist" || r === "personal") return "Assistant";

  // Fallback conservador
  return "Assistant";
}

export function toUserRow(dto: UserDto): UserRow {
  const firstName = dto.firstName ?? "";
  const lastName = dto.lastName ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || dto.fullName?.trim() || "—";

  const last = dto.lastLoginAt ? new Date(dto.lastLoginAt).toLocaleString() : null;

  return {
    id: dto.id,
    email: dto.email ?? "—",

    firstName,
    lastName,
    fullName,

    phoneNumber: dto.phoneNumber ?? null,
    address: dto.address ?? null,
    dateOfBirth: dto.dateOfBirth ?? null,

    lastAccess: last,
    roleName: normalizeRole(dto.role ?? dto.roleName),
    isActive: dto.isActive ?? true,
  };
}