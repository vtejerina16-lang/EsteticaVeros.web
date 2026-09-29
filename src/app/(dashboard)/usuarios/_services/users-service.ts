// src/app/(dashboard)/usuarios/_services/users-service.ts

import "server-only";
import { fetchJson } from "@/lib/http";
import type { CreateUserRequest, RoleName } from "../_types.users";
import { UserRow } from "../_adapters/user-adapter";

const USERS_PATH = process.env.USERS_LIST_PATH ?? "/api/users";

export type UserDto = {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;

  address?: string | null;
  dateOfBirth?: string | null;
  profilePictureUrl?: string | null;

  role?: string | null;
  roleName: string | null | undefined;

  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt?: string | null;
  fullName?: string | null;
};

type UsersListResponse = {
  map(toUserRow: (dto: UserDto) => UserRow): unknown;
  users: UserDto[];
  page?: number;
  perPage?: number;
  totalCount?: number;
  totalPages?: number;
};

export type ListUsersParams = {
  page?: number;
  perPage?: number;
  isActive?: boolean;
  role?: string;
  search?: string;
};

export async function listUsers(
  token: string,
  params: ListUsersParams = {}
): Promise<UsersListResponse> {
  const qs = new URLSearchParams();
  qs.set("page", String(params.page ?? 1));
  qs.set("per_page", String(params.perPage ?? 10));

  if (params.isActive !== undefined) qs.set("is_active", String(params.isActive));
  if (params.role) qs.set("role", params.role);
  if (params.search) qs.set("search", params.search);

  const url = `${USERS_PATH}?${qs.toString()}`;
  return fetchJson<UsersListResponse>(url, { token });
}

export async function registerUser(token: string, payload: CreateUserRequest): Promise<unknown> {
  return fetchJson<unknown>(USERS_PATH, {
    method: "POST",
    token,
    body: payload,
  });
}

/** ====== Update + Deactivate ====== */

export type UpdateUserPayload = {
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  address?: string | null;
  dateOfBirth?: string | null; // ISO string o null
  roleName: RoleName; // Administrator | Manager | Assistant
  isActive: boolean;
};

export type UserRecordDto = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string | null;
  address: string | null;
  dateOfBirth: string | null;
  profilePictureUrl: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  role: string; // suele venir "Administrator" / "Manager" / "Assistant"
};

type UpdateUserResponse = { user: UserRecordDto } | { User: UserRecordDto };

export async function updateUser(
  token: string,
  userId: number,
  payload: UpdateUserPayload
): Promise<UserRecordDto> {
  const res = await fetchJson<UpdateUserResponse>(`${USERS_PATH}/${userId}`, {
    method: "PUT",
    token,
    body: payload,
  });

  const user = (res as any).user ?? (res as any).User;
  return user as UserRecordDto;
}

export async function deactivateUser(token: string, userId: number): Promise<void> {
  await fetchJson<void>(`${USERS_PATH}/${userId}`, {
    method: "DELETE",
    token,
  });
}