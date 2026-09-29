import type { BackendUserDto, UpdateProfileInput } from "../_types/profile-types";
import { fetchJson } from "@/lib/http";

export async function getMyProfile(token: string): Promise<BackendUserDto> {
  // 1. Obtenemos el ID del usuario actual
  const auth = await fetchJson<BackendUserDto>(`/api/auth/me`, { token });
  
  // 2. Retornamos el perfil completo usando el ID
  // Esto asegura que tengamos firstName, lastName y roleName correcto
  return await fetchJson<BackendUserDto>(`/api/users/${auth.id}`, { token });
}

export async function updateMyProfile(token: string, input: UpdateProfileInput): Promise<BackendUserDto> {
  const current = await getMyProfile(token);
  
  // Buscamos el rol en cualquiera de las dos propiedades posibles
  const userRole = current.roleName || current.role || "Assistant"; 

  const payload = {
    ...input,
    roleName: userRole, // Enviamos el rol real que ya tiene el usuario
    isActive: current.isActive ?? true,
  };

  return await fetchJson<BackendUserDto>(`/api/users/${current.id}`, {
    method: "PUT",
    token,
    body: payload,
  });
}