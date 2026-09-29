"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { HttpError } from "@/lib/http";
import type {
  ClientFormState,
  ClientUpsertInput,
  ClientGender,
  ClientFormFields,
} from "../_types.clients";
import { createClient, toggleClientStatus, updateClient } from "../_services/clients-service";

function isNextRedirectError(e: unknown): boolean {
  // redirect() lanza un error especial con digest "NEXT_REDIRECT;..."
  return typeof (e as any)?.digest === "string" && String((e as any).digest).startsWith("NEXT_REDIRECT");
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}
function bool(fd: FormData, key: string): boolean {
  const v = fd.get(key);
  return v === "on" || v === "true" || v === "1";
}

function parseGender(v: string): ClientGender | null {
  if (v === "Male" || v === "Female" || v === "Other" || v === "PreferNotToSay") return v;
  return null;
}

function extractBackendMessage(err: unknown): string {
  if (err instanceof HttpError) {
    const p: any = err.payload;

    const detail: string = Array.isArray(p?.detail)
      ? p.detail.map((item: any) => item?.msg || "").join(" ").toLowerCase()
      : String(p?.detail || "").toLowerCase();
    const title: string = String(p?.title || "").toLowerCase();

    // 🔥 1. ERRORES ESPECÍFICOS (duplicados)
    if (detail.includes("phone") && detail.includes("exist")) {
      return "Ya existe un cliente con este número de teléfono.";
    }

    if (detail.includes("email") && detail.includes("exist")) {
      return "Ya existe un cliente con este correo electrónico.";
    }

    if (detail.includes("customer") && detail.includes("exist")) {
      return "El cliente ya existe en el sistema.";
    }

    // 🔥 2. VALIDACIONES DEL BACKEND
    if (err.status === 400) {
      return "Revisa los campos marcados y corrige la información ingresada.";
    }

    // 🔥 3. NO ENCONTRADO
    if (err.status === 404) {
      return "No se encontró el cliente solicitado.";
    }

    // 🔥 4. ERRORES DE SERVIDOR
    if (err.status >= 500) {
      return "Ocurrió un error interno. Intenta nuevamente.";
    }

    // 🔥 5. MENSAJE ORIGINAL (fallback controlado)
    if (p?.detail && !Array.isArray(p.detail)) return String(p.detail);
    if (p?.title) return p.title;

    return `Error inesperado (${err.status})`;
  }

  if (err instanceof Error) return err.message;

  return "Ocurrió un error inesperado. Intenta nuevamente.";
}

const clientFieldLabels: Record<ClientFormFields, string> = {
  firstName: "El nombre",
  lastName: "El apellido",
  email: "El correo electrónico",
  phoneNumber: "El teléfono",
  dateOfBirth: "La fecha de nacimiento",
  gender: "El género",
  address: "La dirección",
  city: "La ciudad",
  allergies: "Las alergias",
  medicalConditions: "Las condiciones médicas",
  medications: "Las medicaciones",
  isActive: "El estado",
};

function fieldFromBackendLocation(value: unknown): ClientFormFields | undefined {
  if (typeof value !== "string") return undefined;

  const aliases: Record<string, ClientFormFields> = {
    first_name: "firstName",
    last_name: "lastName",
    phone: "phoneNumber",
    phone_number: "phoneNumber",
    date_of_birth: "dateOfBirth",
  };

  if (value in clientFieldLabels) return value as ClientFormFields;
  return aliases[value];
}

function getBackendFieldErrors(err: unknown): ClientFormState["errors"] {
  if (!(err instanceof HttpError)) return {};

  const payload: any = err.payload;
  const errors: ClientFormState["errors"] = {};
  const details = Array.isArray(payload?.detail) ? payload.detail : [];

  for (const detail of details) {
    const location = Array.isArray(detail?.loc) ? detail.loc : [];
    const field = fieldFromBackendLocation(location.at(-1));
    if (!field || errors[field]) continue;

    const text = String(detail?.msg ?? "").toLowerCase();
    const label = clientFieldLabels[field];
    errors[field] = text.includes("required") || text.includes("missing")
      ? `${label} es obligatorio.`
      : `${label} no es válido.`;
  }

  const detailText = String(
    typeof payload === "string" ? payload : payload?.detail || payload?.message || "",
  ).toLowerCase();

  if (detailText.includes("phone") && detailText.includes("exist")) {
    errors.phoneNumber = "Ya existe un cliente con este número de teléfono.";
  }

  if (detailText.includes("email") && detailText.includes("exist")) {
    errors.email = "Ya existe un cliente con este correo electrónico.";
  }

  if (detailText.includes("customer") && detailText.includes("exist")) {
    errors.firstName ??= "Ya existe un cliente con estos datos.";
    errors.lastName ??= "Verifica el nombre y apellido del cliente.";
  }

  return errors;
}

function getBackendErrorState(err: unknown): ClientFormState {
  const errors = getBackendFieldErrors(err);
  return {
    ok: false,
    message: extractBackendMessage(err),
    ...(Object.keys(errors).length > 0 ? { errors } : {}),
  };
}

function buildInput(fd: FormData): { input: ClientUpsertInput | null; errors: ClientFormState["errors"] } {
  const firstName = str(fd, "firstName");
  const lastName = str(fd, "lastName");
  const emailRaw = str(fd, "email");
  const phoneNumber = str(fd, "phoneNumber");

  const dateOfBirth = str(fd, "dateOfBirth");
  const genderRaw = str(fd, "gender");

  const address = str(fd, "address");
  const city = str(fd, "city");

  const allergies = str(fd, "allergies");
  const medicalConditions = str(fd, "medicalConditions");
  const medications = str(fd, "medications");

  const isActive = bool(fd, "isActive");

  const errors: ClientFormState["errors"] = {};

  if (!firstName) errors!.firstName = "Nombre es obligatorio.";
  if (!lastName) errors!.lastName = "Apellido es obligatorio.";
  if (!phoneNumber) errors!.phoneNumber = "Teléfono es obligatorio.";

  if (emailRaw) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw);
    if (!ok) errors!.email = "Email inválido.";
  }

  const gender = parseGender(genderRaw);
  if (!gender) errors!.gender = "Selecciona el género.";

  if (Object.keys(errors).length) return { input: null, errors };

  return {
    input: {
      firstName,
      lastName,
      phoneNumber,
      email: emailRaw ? emailRaw : null,

      gender: gender!, // requerido por backend
      dateOfBirth: dateOfBirth ? dateOfBirth : null,

      address: address ? address : null,
      city: city ? city : null,

      allergies: allergies ? allergies : null,
      medicalConditions: medicalConditions ? medicalConditions : null,
      medications: medications ? medications : null,

      preferredAssistantId: null,

      isActive,
      notes: null,
    },
    errors,
  };
}

export async function createClientAction(_: ClientFormState, formData: FormData): Promise<ClientFormState> {
  const { input, errors } = buildInput(formData);
  if (!input) return { ok: false, message: "Corrige los campos marcados.", errors };

  try {
    const created = await createClient(input);
    revalidatePath("/clientes");
    redirect(`/clientes/${created.id}`);
  } catch (e) {
    if (isNextRedirectError(e)) throw e; // ✅ NO tragar redirect
    return getBackendErrorState(e);
  }
}

export async function updateClientAction(
  id: string,
  _: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const { input, errors } = buildInput(formData);
  if (!input) return { ok: false, message: "Corrige los campos marcados.", errors };

  try {
    await updateClient(id, input);
    revalidatePath("/clientes");
    revalidatePath(`/clientes/${id}`);
    redirect(`/clientes/${id}`); // ✅ sal de modo edición
  } catch (e) {
    if (isNextRedirectError(e)) throw e; // ✅ ESTE era tu bug
    return getBackendErrorState(e);
  }
}

export async function toggleClientStatusAction(id: string, isActive: boolean): Promise<void> {
  await toggleClientStatus(id, isActive);
  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}`);
}