"use server";

import { revalidatePath } from "next/cache";
import { getAccessToken } from "@/lib/auth";
import { recordExpenseForOpenSession } from "../_services/cash-service";

export type ExpenseActionState = { ok: boolean; message?: string };

function str(fd: FormData, k: string) {
  return String(fd.get(k) ?? "").trim();
}

/**
 * ACCIÓN PARA REGISTRAR UN GASTO (SALIDA DE CAJA)
 */
export async function createExpenseAction(
  _prev: ExpenseActionState,
  formData: FormData
): Promise<ExpenseActionState> {
  const token = await getAccessToken();
  if (!token) return { ok: false, message: "Sesión no válida. Vuelve a iniciar sesión." };

  const amount = Number(formData.get("amount") ?? 0);
  const expenseCategory = str(formData, "expenseCategory");
  const description = str(formData, "description");

  // Validaciones básicas antes de enviar a la API
  if (amount <= 0) return { ok: false, message: "El monto del gasto debe ser mayor a 0." };
  if (!expenseCategory) return { ok: false, message: "Debes seleccionar una categoría." };

  // Llamada al servicio real (eliminamos usr_mock)
  const res = await recordExpenseForOpenSession(token, {
    amount,
    expenseCategory,
    description,
  });

  if (!res.ok) return { ok: false, message: res.message };

  // Actualizamos la caché de las rutas afectadas
  revalidatePath("/caja");
  revalidatePath("/caja/historial");
  
  // Si el servicio nos devuelve el ID de la sesión, revalidamos su página específica
  if (res.cashSessionId) {
    revalidatePath(`/caja/${res.cashSessionId}`);
  }

  return { ok: true, message: "Gasto registrado correctamente en la caja actual." };
}