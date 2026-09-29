import type { Client, ClientGender, ClientUpsertInput } from "../_types.clients";

/**
 * Backend: SmartEnum Gender
 * 1=Male, 2=Female, 3=Other, 4=PreferNotToSay
 */

export type ApiCustomerRecord = {
  id?: number; Id?: number;
  customerNumber?: string; CustomerNumber?: string;
  fullName?: string; FullName?: string;
  phoneNumber?: string; PhoneNumber?: string;
  email?: string | null; Email?: string | null;
  loyaltyPoints?: number; LoyaltyPoints?: number;
  isActive?: boolean; IsActive?: boolean;
};

export type ApiCustomersListResponse = {
  customers?: ApiCustomerRecord[]; Customers?: ApiCustomerRecord[];
  page?: number; Page?: number;
  perPage?: number; PerPage?: number;
  totalCount?: number; TotalCount?: number;
  totalPages?: number; TotalPages?: number;
};

export type ApiCustomerDetailResponse = {
  id?: number; Id?: number;
  customerNumber?: string; CustomerNumber?: string;

  firstName?: string; FirstName?: string;
  lastName?: string; LastName?: string;
  fullName?: string; FullName?: string;

  phoneNumber?: string; PhoneNumber?: string;
  email?: string | null; Email?: string | null;

  dateOfBirth?: string | null; DateOfBirth?: string | null;
  age?: number | null; Age?: number | null;

  // en tu API es string (ej: "Male", "Female", "Other", "PreferNotToSay")
  gender?: string; Gender?: string;

  address?: string | null; Address?: string | null;
  city?: string | null; City?: string | null;

  allergies?: string | null; Allergies?: string | null;
  medicalConditions?: string | null; MedicalConditions?: string | null;
  medications?: string | null; Medications?: string | null;

  preferredAssistantId?: number | null; PreferredAssistantId?: number | null;
  profilePictureUrl?: string | null; ProfilePictureUrl?: string | null;

  loyaltyPoints?: number; LoyaltyPoints?: number;
  totalSpent?: number; TotalSpent?: number;
  totalVisits?: number; TotalVisits?: number;
  lastVisitDate?: string | null; LastVisitDate?: string | null;

  isActive?: boolean; IsActive?: boolean;
  createdAt?: string; CreatedAt?: string;
  updatedAt?: string | null; UpdatedAt?: string | null;
};

export type ApiCreateCustomerResponse = { customer?: ApiCustomerRecord; Customer?: ApiCustomerRecord };
export type ApiUpdateCustomerResponse = { customer?: ApiCustomerDetailResponse; Customer?: ApiCustomerDetailResponse };

function pick<T>(obj: any, ...keys: string[]): T | undefined {
  for (const k of keys) if (obj?.[k] !== undefined) return obj[k] as T;
  return undefined;
}

function toDateOnly(value?: string | null): string | null {
  if (!value) return null;
  const s = String(value);
  return s.length >= 10 ? s.slice(0, 10) : s;
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const t = (fullName ?? "").trim();
  if (!t) return { firstName: "", lastName: "" };
  const parts = t.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  const lastName = parts.pop() ?? "";
  return { firstName: parts.join(" "), lastName };
}

function apiGenderLabelToUi(label?: string): ClientGender | null {
  const g = (label ?? "").trim().toLowerCase();
  if (!g) return null;

  // English exact (tu backend)
  if (g === "female") return "Female";
  if (g === "male") return "Male";
  if (g === "other") return "Other";
  if (g === "prefernottosay" || g.includes("prefer")) return "PreferNotToSay";

  // Spanish fallback (por si en algún punto cambian)
  if (g.includes("fem")) return "Female";
  if (g.includes("masc")) return "Male";
  if (g.includes("otro")) return "Other";

  return "PreferNotToSay";
}

function uiGenderToApiInt(g: ClientGender): number {
  switch (g) {
    case "Male":
      return 1;
    case "Female":
      return 2;
    case "Other":
      return 3;
    case "PreferNotToSay":
    default:
      return 4; // ✅ CORRECTO en tu backend
  }
}

export function normalizeListResponse(res: ApiCustomersListResponse) {
  const customers = (res.customers ?? res.Customers ?? []) as ApiCustomerRecord[];
  const page = (res.page ?? res.Page ?? 1) as number;
  const perPage = (res.perPage ?? res.PerPage ?? 10) as number;
  const totalCount = (res.totalCount ?? res.TotalCount ?? customers.length) as number;
  const totalPages = (res.totalPages ?? res.TotalPages ?? 1) as number;

  return { customers, page, perPage, totalCount, totalPages };
}

export function apiRecordToClient(rec: ApiCustomerRecord): Client {
  const id = pick<number>(rec, "id", "Id") ?? 0;
  const fullName = pick<string>(rec, "fullName", "FullName") ?? "";
  const { firstName, lastName } = splitFullName(fullName);

  return {
    id: String(id),
    customerNumber: pick<string>(rec, "customerNumber", "CustomerNumber") ?? null,
    loyaltyPoints: pick<number>(rec, "loyaltyPoints", "LoyaltyPoints") ?? 0,
    firstName,
    lastName,
    fullName: fullName || null,
    phoneNumber: pick<string>(rec, "phoneNumber", "PhoneNumber") ?? "",
    email: pick<string | null>(rec, "email", "Email") ?? null,
    dateOfBirth: null,
    age: null,
    gender: null,
    address: null,
    city: null,
    allergies: null,
    medicalConditions: null,
    medications: null,
    preferredAssistantId: null,
    profilePictureUrl: null,
    totalSpent: null,
    totalVisits: null,
    lastVisitDate: null,
    isActive: pick<boolean>(rec, "isActive", "IsActive") ?? true,
    createdAt: null,
    updatedAt: null,
    notes: null,
  };
}

export function apiDetailToClient(dto: ApiCustomerDetailResponse): Client {
  const id = pick<number>(dto, "id", "Id") ?? 0;

  return {
    id: String(id),
    customerNumber: pick<string>(dto, "customerNumber", "CustomerNumber") ?? null,
    loyaltyPoints: pick<number>(dto, "loyaltyPoints", "LoyaltyPoints") ?? 0,

    firstName: pick<string>(dto, "firstName", "FirstName") ?? "",
    lastName: pick<string>(dto, "lastName", "LastName") ?? "",
    fullName: pick<string>(dto, "fullName", "FullName") ?? null,

    phoneNumber: pick<string>(dto, "phoneNumber", "PhoneNumber") ?? "",
    email: pick<string | null>(dto, "email", "Email") ?? null,

    dateOfBirth: toDateOnly(pick<string | null>(dto, "dateOfBirth", "DateOfBirth")),
    age: pick<number | null>(dto, "age", "Age") ?? null,
    gender: apiGenderLabelToUi(pick<string>(dto, "gender", "Gender")),

    address: pick<string | null>(dto, "address", "Address") ?? null,
    city: pick<string | null>(dto, "city", "City") ?? null,

    allergies: pick<string | null>(dto, "allergies", "Allergies") ?? null,
    medicalConditions: pick<string | null>(dto, "medicalConditions", "MedicalConditions") ?? null,
    medications: pick<string | null>(dto, "medications", "Medications") ?? null,

    preferredAssistantId: pick<number | null>(dto, "preferredAssistantId", "PreferredAssistantId") ?? null,
    profilePictureUrl: pick<string | null>(dto, "profilePictureUrl", "ProfilePictureUrl") ?? null,

    totalSpent: pick<number>(dto, "totalSpent", "TotalSpent") ?? 0,
    totalVisits: pick<number>(dto, "totalVisits", "TotalVisits") ?? 0,
    lastVisitDate: pick<string | null>(dto, "lastVisitDate", "LastVisitDate") ?? null,

    isActive: pick<boolean>(dto, "isActive", "IsActive") ?? true,
    createdAt: pick<string | null>(dto, "createdAt", "CreatedAt") ?? null,
    updatedAt: pick<string | null>(dto, "updatedAt", "UpdatedAt") ?? null,

    notes: null,
  };
}

export function clientToCreateApi(input: ClientUpsertInput): Record<string, unknown> {
  return {
    FirstName: input.firstName,
    LastName: input.lastName,
    PhoneNumber: input.phoneNumber,
    Gender: uiGenderToApiInt(input.gender),
    Email: input.email ?? null,
    DateOfBirth: input.dateOfBirth ?? null,
    Address: input.address ?? null,
    City: input.city ?? null,
    Allergies: input.allergies ?? null,
    MedicalConditions: input.medicalConditions ?? null,
    Medications: input.medications ?? null,
    PreferredAssistantId: input.preferredAssistantId ?? null,
  };
}

export function clientToUpdateApi(customerId: number, input: ClientUpsertInput): Record<string, unknown> {
  return {
    CustomerId: customerId,
    FirstName: input.firstName,
    LastName: input.lastName,
    PhoneNumber: input.phoneNumber,
    Gender: uiGenderToApiInt(input.gender),
    Email: input.email ?? null,
    DateOfBirth: input.dateOfBirth ?? null,
    Address: input.address ?? null,
    City: input.city ?? null,
    Allergies: input.allergies ?? null,
    MedicalConditions: input.medicalConditions ?? null,
    Medications: input.medications ?? null,
    PreferredAssistantId: input.preferredAssistantId ?? null,
    IsActive: input.isActive,
  };
}