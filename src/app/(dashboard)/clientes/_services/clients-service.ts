import "server-only";

import { getAccessToken } from "@/lib/auth";
import { fetchJson } from "@/lib/http";

import type { Client, ClientsListQuery, ClientUpsertInput, Paginated } from "../_types.clients";
import {
  apiDetailToClient,
  apiRecordToClient,
  clientToCreateApi,
  clientToUpdateApi,
  normalizeListResponse,
  type ApiCreateCustomerResponse,
  type ApiCustomerDetailResponse,
  type ApiCustomersListResponse,
  type ApiUpdateCustomerResponse,
} from "../_adapters/clients-adapter";

async function getToken(token?: string): Promise<string | undefined> {
  if (token) return token;
  const t = await getAccessToken();
  return t ?? undefined;
}

export async function listClients(query: ClientsListQuery, token?: string): Promise<Paginated<Client>> {
  const t = await getToken(token);

  const params = new URLSearchParams();
  params.set("page", String(query.page ?? 1));
  params.set("per_page", String(query.pageSize ?? 10));

  if (query.status && query.status !== "all") {
    params.set("is_active", query.status === "true" ? "true" : "false");
  }
  if (query.search?.trim()) params.set("search", query.search.trim());

  const res = await fetchJson<ApiCustomersListResponse>(`/api/customers?${params.toString()}`, { token: t });

  const norm = normalizeListResponse(res);
  const items = norm.customers.map(apiRecordToClient);

  return {
    items,
    page: norm.page,
    pageSize: norm.perPage,
    total: norm.totalCount,
    totalPages: norm.totalPages,
  };
}

export async function getClientById(id: string, token?: string): Promise<Client | null> {
  const t = await getToken(token);
  const res = await fetchJson<ApiCustomerDetailResponse>(`/api/customers/${id}`, { token: t });
  return apiDetailToClient(res);
}

export async function createClient(input: ClientUpsertInput, token?: string): Promise<Client> {
  const t = await getToken(token);

  const res = await fetchJson<ApiCreateCustomerResponse>(`/api/customers`, {
    method: "POST",
    token: t,
    body: clientToCreateApi(input),
  });

  const customer = res.customer ?? res.Customer;
  if (!customer) throw new Error("Respuesta inesperada: falta customer");
  return apiRecordToClient(customer);
}

export async function updateClient(id: string, input: ClientUpsertInput, token?: string): Promise<Client> {
  const t = await getToken(token);

  const customerId = Number(id);
  if (!Number.isFinite(customerId)) throw new Error("CustomerId inválido");

  const res = await fetchJson<ApiUpdateCustomerResponse>(`/api/customers/${customerId}`, {
    method: "PUT",
    token: t,
    body: clientToUpdateApi(customerId, input),
  });

  const customer = res.customer ?? res.Customer;
  if (!customer) throw new Error("Respuesta inesperada: falta customer");
  return apiDetailToClient(customer);
}

/**
 * Backend no tiene endpoint PATCH status.
 * => GET detalle y PUT con IsActive cambiado.
 */
export async function toggleClientStatus(id: string, isActive: boolean, token?: string): Promise<Client> {
  const current = await getClientById(id, token);
  if (!current) throw new Error("Cliente no encontrado");

  const input: ClientUpsertInput = {
    firstName: current.firstName,
    lastName: current.lastName,
    phoneNumber: current.phoneNumber,
    email: current.email ?? null,

    gender: current.gender ?? "PreferNotToSay", // backend requiere gender sí o sí
    dateOfBirth: current.dateOfBirth ?? null,

    address: current.address ?? null,
    city: current.city ?? null,

    allergies: current.allergies ?? null,
    medicalConditions: current.medicalConditions ?? null,
    medications: current.medications ?? null,

    preferredAssistantId: current.preferredAssistantId ?? null,

    isActive,
    notes: null,
  };

  return updateClient(id, input, token);
}