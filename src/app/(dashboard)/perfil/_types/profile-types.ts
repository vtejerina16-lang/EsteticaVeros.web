// src/app/(dashboard)/perfil/_types/profile-types.ts

/**
 * Coincide exactamente con el UserRecord y CurrentUserResponse del backend C#
 */
export type BackendUserDto = {
  id: number | string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  // Agregamos ambos para que no falle el mapeo
  role?: string; 
  roleName?: string;
  isActive?: boolean;
};

/**
 * Datos que el usuario puede enviar para actualizar
 */
export type UpdateProfileInput = {
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  address: string | null;
  dateOfBirth: string | null;
};

/**
 * Estructura de datos para la vista (Componentes)
 */
export type ProfileVM = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  roleName: string;
  isActive: boolean;
};

/**
 * Estado para el hook useActionState en el formulario
 * ESTE ES EL QUE TE FALTABA EXPORTAR
 */
export type UpdateProfileActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<keyof UpdateProfileInput, string>>;
};