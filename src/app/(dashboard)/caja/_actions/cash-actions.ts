// src/app/(dashboard)/caja/_actions/cash-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { getAccessToken } from "@/lib/auth";
import { openMainSession, closeMainSession, createReconciliation } from "../_services/cash-service";
import { approveReconciliation, rejectReconciliation } from "../_services/cash-service";
import { createCashRegister, updateCashRegister, toggleCashRegisterStatus } from "../_services/cash-service";
export type CashActionState = { 
  ok: boolean; 
  message?: string; 
  sessionId?: string | number 
};
/**
 * ✅ ACCIÓN DEL ADMIN: CREAR CAJA
 */
export async function addRegisterAction(formData: FormData) {
  const token = await getAccessToken();
  if (!token) return;
  const name = String(formData.get("name"));
  const location = String(formData.get("location"));
  
  await createCashRegister(token, { name, location });
  revalidatePath("/configuracion/cajas");
  revalidatePath("/caja"); // Para que aparezca en el menú desplegable del cajero
}

/**
 * ✅ ACCIÓN DEL ADMIN: ACTIVAR/DESACTIVAR CAJA
 */
export async function toggleRegisterAction(formData: FormData) {
  const token = await getAccessToken();
  if (!token) return;
  const id = Number(formData.get("registerId"));
  const currentStatus = formData.get("currentStatus") === "true";
  
  // Si está activa, la desactivamos. Si está inactiva, la activamos.
  const actionToTake = currentStatus ? "deactivate" : "activate";
  await toggleCashRegisterStatus(token, id, actionToTake);
  
  revalidatePath("/configuracion/cajas");
  revalidatePath("/caja");
}
/**
 * ✅ ABRIR CAJA
 */
export async function openCashAction(
  _prev: CashActionState,
  formData: FormData
): Promise<CashActionState> {
  const token = await getAccessToken();
  if (!token) return { ok: false, message: "Sesión expirada. Por favor, inicia sesión de nuevo." };

  const openingFloat = Number(formData.get("openingFloat") ?? 0);
  const cashRegisterId = Number(formData.get("cashRegisterId") ?? 1);

  const res = await openMainSession(token, { cashRegisterId, openingFloat });
  if (!res.ok) return { ok: false, message: res.message };

  revalidatePath("/caja");
  revalidatePath("/caja/historial");
  revalidatePath("/pagos/nuevo");

  return { 
    ok: true, 
    message: "¡Caja abierta con éxito! Ya puedes registrar cobros.", 
    sessionId: res.session.id 
  };
}

/**
 * ✅ ACCIÓN PARA CERRAR CAJA Y REGISTRAR ARQUEO
 * (Orden corregido: 1ro Cerrar Sesión, 2do Crear Arqueo)
 */
export async function closeCashAction(
  _prev: CashActionState,
  formData: FormData
): Promise<CashActionState> {
  const token = await getAccessToken();
  if (!token) return { ok: false, message: "Sesión no válida." };

  const cashSessionId = Number(formData.get("cashSessionId") ?? 0);
  const closingCashCounted = Number(formData.get("closingCashCounted") ?? 0);
  const notes = String(formData.get("notes") ?? "").trim();

  if (!cashSessionId) return { ok: false, message: "Error técnico: ID de sesión ausente." };

  // ========================================================================
  // PASO 1: CERRAR LA SESIÓN PRIMERO (Exigencia del backend C#)
  // ========================================================================
  const closeRes = await closeMainSession(token, {
    cashSessionId,
    notes, // Le pasamos las notas al cierre
  });

  if (!closeRes.ok) {
    return { 
      ok: false, 
      message: closeRes.message || "Falló el cierre de la sesión. Revisa tu conexión." 
    };
  }

  // ========================================================================
  // PASO 2: REGISTRAR EL ARQUEO (Dinero físico) AHORA QUE ESTÁ CERRADA
  // ========================================================================
  const arqueoRes = await createReconciliation(token, {
    cashRegisterSessionId: cashSessionId,
    countedAmount: closingCashCounted,
    notes: notes || "Arqueo de cierre regular" // Le pasamos las notas al arqueo también
  });

  if (!arqueoRes.ok) {
    // Si falla el arqueo, avisamos que la caja sí se cerró, pero faltó el arqueo
    return { 
      ok: false, 
      message: arqueoRes.message || "Sesión cerrada, pero hubo un error al registrar el dinero contado." 
    };
  }

  // ========================================================================
  // PASO 3: REFRESCAR PANTALLAS
  // ========================================================================
  revalidatePath("/caja");
  revalidatePath("/caja/historial");
  revalidatePath(`/caja/${cashSessionId}`);
  revalidatePath("/pagos/nuevo"); 

  return { 
    ok: true, 
    message: "¡Caja cerrada y arqueo enviado a Gerencia con éxito!", 
    sessionId: cashSessionId 
  };
}
/**
 * ✅ ACCIÓN DEL GERENTE: APROBAR ARQUEO
 */
export async function approveReconciliationAction(formData: FormData) {
  const token = await getAccessToken();
  if (!token) return;
  
  const id = Number(formData.get("reconciliationId"));
  const notes = "Aprobado por Gerencia sin observaciones"; // Podríamos hacerlo dinámico luego

  const ok = await approveReconciliation(token, id, notes);
  if (ok) revalidatePath("/caja/historial");
}

/**
 * ✅ ACCIÓN DEL GERENTE: RECHAZAR ARQUEO
 */
export async function rejectReconciliationAction(formData: FormData) {
  const token = await getAccessToken();
  if (!token) return;
  
  const id = Number(formData.get("reconciliationId"));
  const notes = "Rechazado por discrepancia en montos"; // Podríamos hacerlo dinámico luego

  const ok = await rejectReconciliation(token, id, notes);
  if (ok) revalidatePath("/caja/historial");
}