// src/app/(dashboard)/perfil/_actions/update-profile-action.ts
"use server";

import { getAccessToken } from "@/lib/auth";
import { updateMyProfile } from "../_services/profile-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { UpdateProfileActionState, UpdateProfileInput } from "../_types/profile-types";

export async function updateProfileAction(
  _prev: UpdateProfileActionState,
  formData: FormData
): Promise<UpdateProfileActionState> {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const input: UpdateProfileInput = {
    firstName: (formData.get("firstName") as string) ?? "",
    lastName: (formData.get("lastName") as string) ?? "",
    phoneNumber: ((formData.get("phoneNumber") as string) || "").trim() || null,
    address: ((formData.get("address") as string) || "").trim() || null,
    dateOfBirth: ((formData.get("dateOfBirth") as string) || "").trim() || null,
  };

  // Validaciones
  const errors: UpdateProfileActionState["fieldErrors"] = {};
  if (!input.firstName) errors.firstName = "El nombre es obligatorio.";
  if (!input.lastName) errors.lastName = "El apellido es obligatorio.";
  if (Object.keys(errors).length) return { ok: false, message: "Revisa los campos.", fieldErrors: errors };

  // Actualiza perfil
  await updateMyProfile(token, input);
  revalidatePath("/perfil");
  return { ok: true, message: "Perfil actualizado correctamente." };
}