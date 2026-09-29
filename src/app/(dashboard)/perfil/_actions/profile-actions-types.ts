import type { UpdateProfileActionState } from "../_types/profile-types";

// Al estar en un archivo sin "use server", Next.js permite exportar el objeto
export const updateProfileInitialState: UpdateProfileActionState = { 
  ok: false 
};