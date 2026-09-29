export type CitaActionState = {
  ok: boolean;
  id?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const initialCitaActionState: CitaActionState = { ok: false };