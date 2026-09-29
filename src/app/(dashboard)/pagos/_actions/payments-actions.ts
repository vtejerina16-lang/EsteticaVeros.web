"use server";

import { revalidatePath } from "next/cache";
import { getAccessToken } from "@/lib/auth";
// 🌟 IMPORTACIONES CONSOLIDADAS
import { 
  createPayment, 
  updatePayment,
  voidPayment, 
  refundPayment, 
  getPaymentMethods, 
  searchCustomers 
} from "../_services/payments-service";
import { getCurrentMainSession } from "../../caja/_services/cash-service";

// 1. DEFINICIÓN DE LA URL (Soluciona el error 'Cannot find name API_URL')
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:57679";

// 2. ESTADO DE LA ACCIÓN
export type PaymentActionState = { 
  ok: boolean; 
  message: string; 
  id?: number 
};

// Helper para limpiar strings
function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key)?.toString().trim();
  return v === "" ? undefined : v;
}

/**
 * ✅ ACCIÓN PARA CREAR UN PAGO
 * Maneja la lógica de caja automática y revalidación de rutas.
 */
export async function createPaymentAction(
  _prev: PaymentActionState, 
  formData: FormData
): Promise<PaymentActionState> {
  const token = await getAccessToken();
  if (!token) return { ok: false, message: "Sesión expirada. Vuelve a entrar." };

  try {
    const customerId = Number(formData.get("customerId"));
    const paymentMethodId = Number(formData.get("paymentMethodId"));
    const amount = Number(formData.get("amount"));
    const appointmentIdStr = formData.get("appointmentId");
    
    // Validación de Caja
    const methods = await getPaymentMethods(token);
    const selectedMethod = methods.find((m: any) => m.id === paymentMethodId);

    let cashRegisterSessionId: number | undefined = undefined;

    if (selectedMethod?.requiresCashRegister) {
      const session = await getCurrentMainSession(token);
      if (!session || session.status !== "Open") {
        return { 
          ok: false, 
          message: `El método '${selectedMethod.name}' requiere que la caja esté abierta.` 
        };
      }
      cashRegisterSessionId = session.id;
    }

    const res = await createPayment(token, {
      customerId,
      paymentMethodId,
      amount,
      appointmentId: appointmentIdStr ? Number(appointmentIdStr) : undefined,
      cashRegisterSessionId,
      reference: str(formData, "reference"),
      notes: str(formData, "notes"),
    });

    if (!res.ok) return { ok: false, message: res.message || "Error al registrar el cobro." };

    revalidatePath("/pagos");
    revalidatePath("/caja");
    if (appointmentIdStr) revalidatePath(`/citas/${appointmentIdStr}`);

    return { 
      ok: true, 
      id: res.id, 
      message: "¡Pago registrado con éxito y balance de caja actualizado!" 
    };

  } catch (error) {
    console.error("❌ Action Error:", error);
    return { ok: false, message: "Error interno al procesar el pago." };
  }
}

/**
 * ✅ ACCIÓN PARA ANULAR UN PAGO
 * Traduce los errores del backend para que Vero los entienda
 */
export async function voidPaymentAction(prevState: any, formData: FormData): Promise<PaymentActionState> {
  const paymentId = formData.get("paymentId");
  const reason = formData.get("reason");
  const token = await getAccessToken();

  if (!token) return { ok: false, message: "Sesión expirada." };

  try {
    const res = await fetch(`${API_URL}/api/payments/${paymentId}/void`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    });

    if (!res.ok) {
      const errorData = await res.json();
      const rawMsg = errorData.message || "";

      // 🌟 TRADUCCIONES PERSONALIZADAS
      if (rawMsg.includes("Cannot cancel a completed payment")) {
        return { 
          ok: false, 
          message: "No se puede anular un pago ya completado. Por favor, usa la opción de 'Reembolso' para devolver el dinero." 
        };
      }
      return { ok: false, message: rawMsg || "Error al intentar anular el pago." };
    }

    revalidatePath("/pagos");
    return { ok: true, message: "¡La transacción ha sido anulada correctamente!" };

  } catch (e) {
    return { ok: false, message: "No se pudo conectar con el servidor." };
  }
} 

/**
 * ✅ ACCIÓN PARA REEMBOLSAR UN PAGO
 * Ideal cuando el pago ya está 'Completed'
 */
export async function refundPaymentAction(
  _prev: PaymentActionState, 
  formData: FormData
): Promise<PaymentActionState> {
  const token = await getAccessToken();
  if (!token) return { ok: false, message: "Sesión no válida." };

  const paymentId = Number(formData.get("paymentId"));
  const reason = str(formData, "reason");

  if (!paymentId) return { ok: false, message: "ID de pago inválido." };
  if (!reason) return { ok: false, message: "Debes escribir un motivo para el reembolso." };

  const res = await refundPayment(token, { paymentId, reason });
  
  if (!res.ok) return { ok: false, message: res.message || "Error al procesar el reembolso." };

  revalidatePath("/pagos");
  revalidatePath("/caja");

  return { ok: true, message: "¡Reembolso procesado! El dinero se ha descontado de la caja." };
}

/**
 * ✅ ACCIÓN PARA BÚSQUEDA DE CLIENTES (Debounced en el cliente)
 */
export async function searchCustomersAction(query: string) {
  const token = await getAccessToken();
  if (!token) return [];
  return await searchCustomers(token, query); 
}

/**
 * ✅ ACCIÓN PARA ACTUALIZAR UN PAGO
 */
export async function updatePaymentAction(
  _prev: PaymentActionState,
  formData: FormData
): Promise<PaymentActionState> {
  const token = await getAccessToken();
  if (!token) return { ok: false, message: "Sesión expirada. Vuelve a entrar." };

  try {
    const paymentId = Number(formData.get("paymentId"));
    const customerId = Number(formData.get("customerId"));
    const paymentMethodId = Number(formData.get("paymentMethodId"));
    const amount = Number(formData.get("amount"));
    const appointmentIdStr = formData.get("appointmentId");

    if (!paymentId) return { ok: false, message: "ID de pago inválido." };
    if (!customerId) return { ok: false, message: "Selecciona un cliente." };
    if (!paymentMethodId) return { ok: false, message: "Selecciona un método de pago." };
    if (!Number.isFinite(amount) || amount <= 0) return { ok: false, message: "Monto inválido." };

    const methods = await getPaymentMethods(token);
    const selectedMethod = methods.find((m: any) => m.id === paymentMethodId);

    let cashRegisterSessionId: number | undefined = Number(formData.get("cashRegisterSessionId")) || undefined;

    if (selectedMethod?.requiresCashRegister && !cashRegisterSessionId) {
      const session = await getCurrentMainSession(token);
      if (!session || session.status !== "Open") {
        return {
          ok: false,
          message: `El método '${selectedMethod.name}' requiere que la caja esté abierta.`,
        };
      }
      cashRegisterSessionId = session.id;
    }

    const res = await updatePayment(token, paymentId, {
      customerId,
      paymentMethodId,
      amount,
      appointmentId: appointmentIdStr ? Number(appointmentIdStr) : undefined,
      cashRegisterSessionId,
      reference: str(formData, "reference"),
      notes: str(formData, "notes"),
    });

    if (!res.ok) return { ok: false, message: res.message || "Error al actualizar el cobro." };

    revalidatePath("/pagos");
    revalidatePath(`/pagos/${paymentId}`);
    revalidatePath("/caja");
    if (appointmentIdStr) revalidatePath(`/citas/${appointmentIdStr}`);

    return {
      ok: true,
      id: paymentId,
      message: "¡Pago actualizado con éxito!",
    };
  } catch (error) {
    console.error("❌ Update Payment Action Error:", error);
    return { ok: false, message: "Error interno al actualizar el pago." };
  }
}
