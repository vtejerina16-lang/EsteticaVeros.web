import "server-only";

import type {
  CreateServiceCategoryInput,
  CreateServiceCategoryResult,
  ListServiceCategoriesResult,
  ServiceCategoryDetail,
  ServiceCategoryRecord,
  UpdateServiceCategoryInput,
  UpdateServiceCategoryResult,
} from "../_types/service-categories.types";

// ✅ configura esto en .env.local (ej)
// NEXT_PUBLIC_API_BASE_URL=https://localhost:57679
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

function pick<T = any>(obj: any, camel: string, pascal: string) {
  return (obj?.[camel] ?? obj?.[pascal]) as T;
}

function normalizeRecord(raw: any): ServiceCategoryRecord {
  return {
    id: pick<number>(raw, "id", "Id"),
    categoryNumber: pick<string>(raw, "categoryNumber", "CategoryNumber"),
    name: pick<string>(raw, "name", "Name"),
    displayOrder: pick<number>(raw, "displayOrder", "DisplayOrder"),
    iconName: pick<string | null>(raw, "iconName", "IconName") ?? null,
    colorCode: pick<string | null>(raw, "colorCode", "ColorCode") ?? null,
    isActive: pick<boolean>(raw, "isActive", "IsActive"),
  };
}

function normalizeDetail(raw: any): ServiceCategoryDetail {
  return {
    id: pick<number>(raw, "id", "Id"),
    categoryNumber: pick<string>(raw, "categoryNumber", "CategoryNumber"),
    name: pick<string>(raw, "name", "Name"),
    description: pick<string | null>(raw, "description", "Description") ?? null,
    displayOrder: pick<number>(raw, "displayOrder", "DisplayOrder"),
    iconName: pick<string | null>(raw, "iconName", "IconName") ?? null,
    colorCode: pick<string | null>(raw, "colorCode", "ColorCode") ?? null,
    isActive: pick<boolean>(raw, "isActive", "IsActive"),
    createdAt: pick<string>(raw, "createdAt", "CreatedAt"),
    updatedAt: pick<string | null>(raw, "updatedAt", "UpdatedAt") ?? null,
  };
}

async function api<T>(
  path: string,
  opts: { method?: string; token?: string; body?: unknown } = {},
) {
  const method = opts.method ?? "GET";
  const url = API_BASE ? `${API_BASE}${path}` : path;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const init: RequestInit = { method, headers };

  // ✅ Solo setear JSON si realmente hay body
  if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(opts.body);
  }

  const res = await fetch(url, init);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${method} ${url}: ${text || res.statusText}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** LIST */
export async function listServiceCategories(args: {
  token: string;
  isActive?: boolean;
}): Promise<ListServiceCategoriesResult> {
  const qs = typeof args.isActive === "boolean" ? `?is_active=${args.isActive}` : "";
  const raw = await api<any>(`/api/service-categories${qs}`, { token: args.token });

  const arr = pick<any[]>(raw, "categories", "Categories") ?? [];
  return { categories: arr.map(normalizeRecord) };
}

/** GET BY ID */
export async function getServiceCategoryById(args: {
  token: string;
  categoryId: number;
}): Promise<ServiceCategoryDetail> {
  const raw = await api<any>(`/api/service-categories/${args.categoryId}`, { token: args.token });
  return normalizeDetail(raw);
}

/** CREATE */
export async function createServiceCategory(args: {
  token: string;
  input: CreateServiceCategoryInput;
}): Promise<CreateServiceCategoryResult> {
  const raw = await api<any>(`/api/service-categories`, {
    method: "POST",
    token: args.token,
    body: {
      name: args.input.name,
      description: args.input.description ?? null,
      displayOrder: args.input.displayOrder ?? 0,
      iconName: args.input.iconName ?? null,
      colorCode: args.input.colorCode ?? null,
    },
  });

  const cat = pick<any>(raw, "category", "Category");
  return { category: normalizeRecord(cat) };
}

/** UPDATE */
export async function updateServiceCategory(args: {
  token: string;
  input: UpdateServiceCategoryInput;
}): Promise<UpdateServiceCategoryResult> {
  const raw = await api<any>(`/api/service-categories/${args.input.categoryId}`, {
    method: "PUT",
    token: args.token,
    body: {
      categoryId: args.input.categoryId,
      name: args.input.name,
      description: args.input.description ?? null,
      displayOrder: args.input.displayOrder ?? 0,
      iconName: args.input.iconName ?? null,
      colorCode: args.input.colorCode ?? null,
      isActive: args.input.isActive,
    },
  });

  const cat = pick<any>(raw, "category", "Category");
  return { category: normalizeDetail(cat) };
}

/** DELETE */
export async function deleteServiceCategory(args: { token: string; categoryId: number }): Promise<void> {
  await api<void>(`/api/service-categories/${args.categoryId}`, {
    method: "DELETE",
    token: args.token,
  });
}