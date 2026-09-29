export type ClientGender = "Male" | "Female" | "Other" | "PreferNotToSay";
export type ClientStatusFilter = "all" | "true" | "false";

export interface Client {
  id: string;

  // Backend
  customerNumber?: string | null;
  loyaltyPoints?: number | null;

  // Nombre/contacto
  firstName: string;
  lastName: string;
  fullName?: string | null;
  phoneNumber: string;
  email?: string | null;

  // Detalle (GET by id)
  dateOfBirth?: string | null; // YYYY-MM-DD
  age?: number | null;
  gender?: ClientGender | null;

  address?: string | null;
  city?: string | null;

  allergies?: string | null;
  medicalConditions?: string | null;
  medications?: string | null;

  preferredAssistantId?: number | null;
  profilePictureUrl?: string | null;

  totalSpent?: number | null;
  totalVisits?: number | null;
  lastVisitDate?: string | null; // ISO

  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;

  // UI-only (por ahora no existe en backend)
  notes?: string | null;
}

export interface ClientsListQuery {
  search?: string;
  status?: ClientStatusFilter;
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ClientUpsertInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string | null;

  gender: ClientGender; // ✅ requerido por backend
  dateOfBirth?: string | null;

  address?: string | null;
  city?: string | null;

  allergies?: string | null;
  medicalConditions?: string | null;
  medications?: string | null;

  preferredAssistantId?: number | null;

  isActive: boolean;

  // UI-only
  notes?: string | null;
}

export type ClientFormFields =
  | "firstName"
  | "lastName"
  | "email"
  | "phoneNumber"
  | "dateOfBirth"
  | "gender"
  | "address"
  | "city"
  | "allergies"
  | "medicalConditions"
  | "medications"
  | "isActive";

export type ClientFormErrors = Partial<Record<ClientFormFields, string>>;

export interface ClientFormState {
  ok: boolean;
  message?: string;
  errors?: ClientFormErrors;
}