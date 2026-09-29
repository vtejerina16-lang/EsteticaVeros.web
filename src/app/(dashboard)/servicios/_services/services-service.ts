import "server-only";

import { getAccessToken } from "@/lib/auth";
import type {
  ListServicesInput,
  ListServicesResult,
  Service,
  ServicePickerItem,
  UpsertServiceInput,
} from "../_types/services.types";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

// ===== AUXILIARES Y PICK =====

function pick<T = any>(obj: any, camel: string, pascal: string) {
  return (obj?.[camel] ?? obj?.[pascal]) as T;
}

function asNumber(x: any): number {
  if (typeof x === "number") return x;
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

function mapTypeNameToUi(serviceTypeName: string): "simple" | "composite" | "package" {
  const t = (serviceTypeName ?? "").toLowerCase();
  if (t.includes("package") || t.includes("paquete")) return "package";
  if (t.includes("composite") || t.includes("compuesto")) return "composite";
  return "simple";
}

function mapTypeToInt(type?: string): number {
  if (!type || type === "all") return 0;
  if (type === "package") return 3;
  if (type === "composite") return 2;
  return 1;
}

// ===== GET CATEGORY ID =====

function getCategoryId(
  raw: any,
  _uiType: "simple" | "composite" | "package"
): number {
  if (!raw) return 0;

  const direct =
    pick<any>(raw, "categoryId", "CategoryId") ??
    pick<any>(raw, "serviceCategoryId", "ServiceCategoryId") ??
    raw?.categoryId ??
    raw?.CategoryId ??
    raw?.serviceCategoryId ??
    raw?.ServiceCategoryId;

  const nested =
    raw?.category ??
    raw?.Category ??
    raw?.serviceCategory ??
    raw?.ServiceCategory;

  const nestedId = nested
    ? (pick<any>(nested, "id", "Id") ?? nested?.id ?? nested?.Id)
    : undefined;

  const value = direct ?? nestedId;

  const id = Number(value);

  return Number.isFinite(id) && id > 0 ? id : 0;
}

// ===== NORMALIZADORES =====

function extractChildServiceIdsFromItems(items: any[]): number[] {
  const out: number[] = [];
  for (const it of items ?? []) {
    const v =
      pick<number | null>(it, "serviceId", "ServiceId") ??
      pick<number | null>(it, "childServiceId", "ChildServiceId") ??
      pick<number | null>(it, "id", "Id");

    const n = Number(v);
    if (Number.isFinite(n) && n > 0) out.push(n);
  }
  return Array.from(new Set(out));
}

function normalizeServiceFromDetail(raw: any): Service {
  const serviceTypeInt = pick<number>(raw, "serviceType", "ServiceType");
  const uiType = serviceTypeInt === 3 ? "package" : serviceTypeInt === 2 ? "composite" : "simple";

  const id = pick<number>(raw, "id", "Id");
  const name = pick<string>(raw, "name", "Name");

  const categoryId = getCategoryId(raw, uiType);

  const items = pick<any[]>(raw, "serviceItems", "ServiceItems") ?? [];
  const childIds = extractChildServiceIdsFromItems(items);

  const components =
    uiType === "composite" || uiType === "package"
      ? childIds.map((sid, idx) => ({ serviceId: String(sid), quantity: 1, order: idx + 1 }))
      : [];

  return {
    id: String(id),
    name: name ?? "",
    categoryId: categoryId as any,
    subcategoryId: null,

    type: uiType,
    pricingType: "fixed",
    price: asNumber(pick<any>(raw, "basePrice", "BasePrice")),
    priceFrom: null,
    priceTo: null,

    durationMinutes: asNumber(pick<any>(raw, "duration", "Duration")),
    notes: pick<string | null>(raw, "notes", "Notes") ?? null,
    isActive: Boolean(pick<any>(raw, "isActive", "IsActive")),

    components,
  };
}

function normalizeServiceRecord(raw: any): {
  id: number;
  name: string;
  serviceTypeName: string;
  categoryId: number;
  isActive: boolean;
} {
  const stName = pick<string>(raw, "serviceType", "ServiceType") ?? "";
  return {
    id: pick<number>(raw, "id", "Id"),
    name: pick<string>(raw, "name", "Name") ?? "",
    serviceTypeName: stName,
    categoryId: getCategoryId(raw, mapTypeNameToUi(stName)),
    isActive: Boolean(pick<any>(raw, "isActive", "IsActive")),
  };
}

function deriveBasePrice(ui: UpsertServiceInput): number {
  if (ui.pricingType === "fixed") return Number(ui.price ?? ui.priceFrom ?? 0);
  if (ui.pricingType === "from") return Number(ui.priceFrom ?? ui.price ?? 0);
  return Number(ui.priceFrom ?? ui.price ?? 0);
}

function appendPriceNote(ui: UpsertServiceInput): string | null {
  const notes = (ui.notes ?? "").trim();

  if (ui.pricingType === "from") {
    const tag = `Desde Bs ${ui.priceFrom ?? ui.price ?? 0}`;
    return notes ? `${notes}\n${tag}` : tag;
  }

  if (ui.pricingType === "range") {
    const tag = `Rango Bs ${ui.priceFrom ?? 0} - ${ui.priceTo ?? 0}`;
    return notes ? `${notes}\n${tag}` : tag;
  }

  return notes || null;
}

// ===== CLIENTE API =====

async function api<T>(path: string, init?: RequestInit & { token?: string }): Promise<T> {
  const token = init?.token ?? (await getAccessToken());
  if (!token) throw new Error("No autenticado");

  if (!API_BASE) throw new Error("Falta NEXT_PUBLIC_API_BASE_URL en .env.local");
  const url = new URL(path, API_BASE).toString();

  const method = (init?.method ?? "GET").toUpperCase();
  const hasBody = init?.body != null && method !== "GET" && method !== "HEAD";

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (hasBody && !headers["Content-Type"]) headers["Content-Type"] = "application/json";

  const res = await fetch(url, { ...init, headers, cache: "no-store" });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ===== METODOS EXPORTADOS =====

export async function getServiceById(id: string): Promise<Service | null> {
  const serviceId = Number(id);
  if (!Number.isFinite(serviceId)) return null;
  const raw = await api<any>(`/api/services/${serviceId}`);
  return normalizeServiceFromDetail(raw);
}

export async function listServices(input: ListServicesInput & { token?: string }): Promise<ListServicesResult> {
  const qs = new URLSearchParams();

  const st = mapTypeToInt(input.type);
  if (st) qs.set("service_type", String(st));

  // ✅ CORREGIDO: Permite enviar la categoría también si es un paquete
  if (input.category && input.category !== "all") {
    qs.set("category_id", String(Number(input.category)));
  }

  if (input.status && input.status !== "all") {
    qs.set("is_active", input.status === "active" ? "true" : "false");
  }

  const path = `/api/services${qs.toString() ? `?${qs.toString()}` : ""}`;
  const raw = await api<any>(path, { token: input.token });

  const arr = pick<any[]>(raw, "services", "Services");
  const records = Array.isArray(arr) ? arr.map(normalizeServiceRecord) : [];

  const search = (input.search ?? "").trim().toLowerCase();
  const filtered = search ? records.filter((r) => r.name.toLowerCase().includes(search)) : records;

  const totalCount = filtered.length;
  const perPage = input.perPage;
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
  const page = Math.min(Math.max(1, input.page), totalPages);

  const start = (page - 1) * perPage;
  const pageSlice = filtered.slice(start, start + perPage);

  const details = await Promise.all(
    pageSlice.map((r) => api<any>(`/api/services/${r.id}`, { token: input.token }))
  );
  
  const items: Service[] = details.map((detail, index) => {
    const service = normalizeServiceFromDetail(detail);
    const listedCategoryId = pageSlice[index]?.categoryId ?? 0;

    return service.categoryId > 0 || listedCategoryId <= 0
      ? service
      : { ...service, categoryId: listedCategoryId as any };
  });

  return { items, totalCount, page, perPage, totalPages };
}

export async function listPickerServices(): Promise<ServicePickerItem[]> {
  const raw = await api<any>(`/api/services?is_active=true`);
  const arr = pick<any[]>(raw, "services", "Services");
  if (!Array.isArray(arr)) return [];

  const records = arr.map(normalizeServiceRecord);

  return records.map((r) => ({
    id: String(r.id),
    name: r.name,
    categoryId: r.categoryId as any,
    type: mapTypeNameToUi(r.serviceTypeName),
    isActive: r.isActive,
  }));
}

export async function createService(input: UpsertServiceInput): Promise<void> {
  const typeInt = mapTypeToInt(input.type);
  if (!typeInt) throw new Error("Tipo inválido");

  const childIds = (input.components ?? [])
    .map((c) => Number(c.serviceId))
    .filter((n) => Number.isFinite(n) && n > 0);

  const payload = {
    serviceType: typeInt,
    ServiceType: typeInt,

    categoryId: Number(input.categoryId),
    CategoryId: Number(input.categoryId),
    serviceCategoryId: Number(input.categoryId),
    ServiceCategoryId: Number(input.categoryId),

    name: input.name,
    description: null,
    shortDescription: null,
    duration: Number(input.durationMinutes ?? 0),
    basePrice: deriveBasePrice(input),
    originalPrice: null,
    discountPercentage: null,
    loyaltyPointsEarned: 0,
    requiresDeposit: false,
    depositAmount: null,
    isFeatured: false,
    displayOrder: 0,
    imageUrl: null,
    notes: appendPriceNote(input),
    preparationInstructions: null,
    contraindications: null,
    childServiceIds: typeInt === 2 || typeInt === 3 ? childIds : null,
  };

  await api(`/api/services`, { method: "POST", body: JSON.stringify(payload) });
}

export async function updateService(serviceId: number, input: UpsertServiceInput): Promise<void> {
  const current = await api<any>(`/api/services/${serviceId}`);
  const existing = normalizeServiceFromDetail(current);

  const childIds = (input.components ?? existing.components ?? [])
    .map((c) => Number(c.serviceId))
    .filter((n) => Number.isFinite(n) && n > 0);

  const typeInt = mapTypeToInt(input.type ?? existing.type);

  // ✅ CORREGIDO: Se eliminó el (typeInt === 3 ? null : ...)
  const targetCategoryId = Number(input.categoryId ?? existing.categoryId);

  const payload = {
    id: serviceId,
    Id: serviceId,
    serviceId,
    ServiceId: serviceId,
    serviceType: typeInt,
    ServiceType: typeInt,
    name: input.name,
    Name: input.name,
    
    categoryId: targetCategoryId,
    CategoryId: targetCategoryId,
    serviceCategoryId: targetCategoryId,
    ServiceCategoryId: targetCategoryId,

    description: pick<string | null>(current, "description", "Description") ?? null,
    shortDescription: pick<string | null>(current, "shortDescription", "ShortDescription") ?? null,
    duration: Number(input.durationMinutes ?? existing.durationMinutes ?? 0),
    basePrice: deriveBasePrice(input),

    originalPrice: pick<number | null>(current, "originalPrice", "OriginalPrice") ?? null,
    discountPercentage: pick<number | null>(current, "discountPercentage", "DiscountPercentage") ?? null,
    loyaltyPointsEarned: pick<number>(current, "loyaltyPointsEarned", "LoyaltyPointsEarned") ?? 0,
    requiresDeposit: false,
    depositAmount: null,

    isActive: Boolean(input.isActive),
    isFeatured: pick<boolean>(current, "isFeatured", "IsFeatured") ?? false,
    displayOrder: pick<number>(current, "displayOrder", "DisplayOrder") ?? 0,
    imageUrl: pick<string | null>(current, "imageUrl", "ImageUrl") ?? null,
    notes: appendPriceNote(input),
    preparationInstructions: pick<string | null>(current, "preparationInstructions", "PreparationInstructions") ?? null,
    contraindications: pick<string | null>(current, "contraindications", "Contraindications") ?? null,

    childServiceIds: typeInt === 2 || typeInt === 3 ? childIds : null,
  };

  await api(`/api/services/${serviceId}`, { method: "PUT", body: JSON.stringify(payload) });
}

export async function toggleServiceActive(serviceId: number): Promise<void> {
  const current = await api<any>(`/api/services/${serviceId}`);
  const existing = normalizeServiceFromDetail(current);
  await updateService(serviceId, { ...existing, isActive: !existing.isActive });
}

export async function deleteService(serviceId: number): Promise<void> {
  await api(`/api/services/${serviceId}`, { method: "DELETE" });
}