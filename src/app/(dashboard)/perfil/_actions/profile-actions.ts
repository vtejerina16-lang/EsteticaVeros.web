"use server";

import { getAccessToken } from "@/lib/auth"; 
import { updateMyProfile } from "../_services/profile-service";
import { revalidatePath } from "next/cache";
import type { UpdateProfileActionState, UpdateProfileInput } from "../_types/profile-types";

/**
 * Acción del servidor para procesar la actualización del perfil.
 * @param _prev Estado anterior del formulario (requerido por useActionState).
 * @param formData Datos capturados del formulario HTML.
 */
export async function updateProfileAction(
  _prev: UpdateProfileActionState,
  formData: FormData
): Promise<UpdateProfileActionState> {
  const token = await getAccessToken();
  
  if (!token) {
    return { ok: false, message: "Sesión expirada. Por favor, inicia sesión de nuevo." };
  }

  // Helper para convertir strings vacíos en null (evita errores de tipo en el backend)
  const getField = (name: string): string | null => {
    const value = formData.get(name) as string;
    return value?.trim() === "" ? null : value;
  };

  // Construcción del objeto de entrada según UpdateProfileInput
  const input: UpdateProfileInput = {
    firstName: (formData.get("firstName") as string) || "",
    lastName: (formData.get("lastName") as string) || "",
    phoneNumber: getField("phoneNumber"),
    address: getField("address"),
    dateOfBirth: getField("dateOfBirth"),
  };

  // Validaciones de lado del servidor
  const errors: UpdateProfileActionState["fieldErrors"] = {};
  if (!input.firstName) errors.firstName = "El nombre es obligatorio.";
  if (!input.lastName) errors.lastName = "El apellido es obligatorio.";

  if (Object.keys(errors).length > 0) {
    return { 
      ok: false, 
      message: "Por favor, corrige los errores en el formulario.", 
      fieldErrors: errors 
    };
  }

  try {
    // Llamada al servicio que coordina con el backend C#
    await updateMyProfile(token, input);
    
    // Invalidamos la caché para que el layout y la página muestren la nueva data
    revalidatePath("/perfil"); 
    
    return { 
      ok: true, 
      message: "¡Perfil actualizado correctamente!" 
    };
  } catch (e) {
    console.error("Error en updateProfileAction:", e);
    // CORRECCIÓN: Ahora devuelve ok: false en caso de error real
    return { 
      ok: false, 
      message: "Hubo un error al guardar los cambios en el servidor." 
    };
  }
}