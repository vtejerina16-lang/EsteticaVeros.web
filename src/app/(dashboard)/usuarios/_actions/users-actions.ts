"use server";

import "server-only";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "@/lib/auth";
import { HttpError } from "@/lib/http";

import {
  registerUser,
  deactivateUser,
  updateUser,
  type UpdateUserPayload,
  type UserRecordDto,
} from "../_services/users-service";

import type {
  CreateUserActionState,
  CreateUserField,
  CreateUserFieldErrors,
  RoleName,
} from "../_types.users";

type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; status?: number; message: string };

const fieldLabels: Record<CreateUserField, string> = {
  email: "El correo electrónico",
  password: "La contraseña",
  firstName: "Los nombres",
  lastName: "Los apellidos",
  phoneNumber: "El teléfono",
  roleName: "El rol",
};

function translateFieldMessage(field: CreateUserField, message: unknown): string {
  const text = String(message ?? "").toLowerCase();
  const label = fieldLabels[field];

  if (text.includes("required") || text.includes("missing")) return `${label} es obligatorio.`;
  if (text.includes("email")) return "Ingrese un correo electrónico válido.";
  if (text.includes("password")) return "La contraseña no cumple los requisitos solicitados.";
  if (text.includes("phone")) return "Ingrese un número de teléfono válido.";
  if (text.includes("role")) return "Seleccione un rol válido.";
  if (text.includes("length") || text.includes("character")) return `${label} tiene una longitud no válida.`;

  return `${label} no es válido.`;
}

function getFieldErrors(payload: any): CreateUserFieldErrors {
  const errors: CreateUserFieldErrors = {};
  const details = Array.isArray(payload?.detail) ? payload.detail : [];

  for (const detail of details) {
    const location = Array.isArray(detail?.loc) ? detail.loc : [];
    const field = location.at(-1);

    if (field && field in fieldLabels && !errors[field as CreateUserField]) {
      errors[field as CreateUserField] = translateFieldMessage(
        field as CreateUserField,
        detail?.msg,
      );
    }
  }

  return errors;
}

function pickMessage(payload: any): string {
  if (!payload) {
    return "Ocurrió un error inesperado. Intente nuevamente.";
  }

  const detail =
    typeof payload === "string"
      ? payload
      : payload?.detail || payload?.message || payload?.title;

  if (!detail) {
    return "Ocurrió un error inesperado. Intente nuevamente.";
  }

  const msg = String(detail).toLowerCase();

  if (msg.includes("already exists")) {
    return "Ya existe un usuario registrado con este correo electrónico.";
  }

  if (msg.includes("invalid")) {
    return "Revise los campos marcados y corrija la información.";
  }

  if (msg.includes("unauthorized")) {
    return "No tiene autorización para realizar esta operación.";
  }

  return "No fue posible completar la operación. Intente nuevamente.";
}

function isRoleName(value: string): value is RoleName {
  return value === "Administrator" || value === "Manager" || value === "Assistant";
}

function getPasswordError(password: string): string | undefined {
  const requirements: string[] = [];

  if (password.length < 8) requirements.push("al menos 8 caracteres");
  if (!/[A-Z]/.test(password)) requirements.push("una letra mayúscula");
  if (!/[a-z]/.test(password)) requirements.push("una letra minúscula");
  if (!/\d/.test(password)) requirements.push("un número");
  if (!/[^A-Za-z0-9]/.test(password)) requirements.push("un carácter especial");

  return requirements.length > 0
    ? `La contraseña debe tener ${requirements.join(", ")}.`
    : undefined;
}

export async function createUserAction(
  _prev: CreateUserActionState | undefined,
  formData: FormData
): Promise<CreateUserActionState> {

  const token = await getAccessToken();

  if (!token) redirect("/login");

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
  const roleNameRaw = String(formData.get("roleName") ?? "").trim();

  const errors: CreateUserFieldErrors = {};
  if (!email) errors.email = "El correo electrónico es obligatorio.";
  else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Ingrese un correo electrónico válido.";
  }
  if (!password) errors.password = "La contraseña es obligatoria.";
  else {
    const passwordError = getPasswordError(password);
    if (passwordError) errors.password = passwordError;
  }
  if (!firstName) errors.firstName = "Los nombres son obligatorios.";
  if (!lastName) errors.lastName = "Los apellidos son obligatorios.";
  if (!phoneNumber) errors.phoneNumber = "El teléfono es obligatorio.";
  if (!roleNameRaw) errors.roleName = "Seleccione un rol.";

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: "Revise los campos marcados antes de registrar el usuario.",
      errors,
    };
  }

  if (!isRoleName(roleNameRaw)) {
    return {
      ok: false,
      message:
        "Revise el campo marcado antes de registrar el usuario.",
      errors: { roleName: "Seleccione Administrador, Encargado o Asistente." },
    };
  }

  try {
    await registerUser(token, {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      roleName: roleNameRaw,
    });
  } catch (e) {
    if (e instanceof HttpError) {
      const errors = getFieldErrors(e.payload);
      const backendMessage = String(
        typeof e.payload === "string"
          ? e.payload
          : e.payload?.detail || e.payload?.message || "",
      ).toLowerCase();

      if (backendMessage.includes("already exists") || backendMessage.includes("already registered")) {
        errors.email = "Ya existe un usuario registrado con este correo electrónico.";
      }

      return {
        ok: false,
        message: pickMessage((e as any).payload),
        ...(Object.keys(errors).length > 0 ? { errors } : {}),
      };
    }

    return {
      ok: false,
      message: "No fue posible registrar el usuario. Intente nuevamente.",
    };
  }

  redirect("/usuarios");
}

export async function deactivateUserAction(
  userId: number
): Promise<ActionResult<null>> {

  const token = await getAccessToken();

  if (!token) {
    return {
      ok: false,
      status: 401,
      message: "Su sesión ha expirado. Inicie sesión nuevamente.",
    };
  }

  try {
    await deactivateUser(token, userId);

    revalidatePath("/usuarios");

    return { ok: true, data: null };
  } catch (e) {
    if (e instanceof HttpError) {
      return {
        ok: false,
        status: e.status,
        message: pickMessage((e as any).payload),
      };
    }

    return {
      ok: false,
      message: "No fue posible desactivar el usuario.",
    };
  }
}

export async function updateUserAction(
  userId: number,
  payload: UpdateUserPayload
): Promise<ActionResult<UserRecordDto>> {

  const token = await getAccessToken();

  if (!token) {
    return {
      ok: false,
      status: 401,
      message: "Su sesión ha expirado. Inicie sesión nuevamente.",
    };
  }

  try {
    const user = await updateUser(token, userId, payload);

    revalidatePath("/usuarios");

    return {
      ok: true,
      data: user,
    };
  } catch (e) {
    if (e instanceof HttpError) {
      return {
        ok: false,
        status: e.status,
        message: pickMessage((e as any).payload),
      };
    }

    return {
      ok: false,
      message: "No fue posible actualizar los datos del usuario.",
    };
  }
}