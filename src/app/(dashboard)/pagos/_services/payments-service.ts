// src/app/(dashboard)/pagos/_services/payments-service.ts
import { Payment, CreatePaymentRequest } from "../_types/payments";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * ✅ LISTAR PAGOS (Sincronizado con Swagger C#)
 */
// src/app/(dashboard)/pagos/_services/payments-service.ts

export async function getPayments(token: string, filters: any = {}) {
  try {
    const query = new URLSearchParams();
    
    // 🌟 1. FORZAR VALORES POR DEFECTO (Evita errores de división por cero en C#)
    const page = filters.page || 1;
    const perPage = filters.perPage || 10;
    query.set("page", String(page));
    query.set("per_page", String(perPage));

    // 🌟 2. SOLO AGREGAR SI TIENEN VALOR (Evita enviar "status=undefined")
    if (filters.search) query.set("search", filters.search);
    if (filters.customerId) query.set("customerId", String(filters.customerId));
    if (filters.cashRegisterSessionId) query.set("cashRegisterSessionId", String(filters.cashRegisterSessionId));

    const statusVal = String(filters.status || "").toLowerCase();
    if (statusVal && statusVal !== "all" && statusVal !== "undefined") {
      query.set("status", filters.status); // En minúsculas como pide el Swagger
    }

    // 🌟 3. LIMPIEZA DE URL (Elimina el '?' si no hay nada más)
    const queryString = query.toString();
    const url = `${API_URL}/api/payments${queryString ? `?${queryString}` : ""}`;
    
    console.log("📡 [PAGOS-API] Llamando a:", url);

    const res = await fetch(url, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json" // 👈 Aseguramos que el servidor sepa qué enviar
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      // Intentamos leer el mensaje de error de C# para saber qué falló exactamente
      const errorData = await res.json().catch(() => ({}));
      console.error(`❌ [PAGOS-API] Error ${res.status}:`, errorData);
      return { items: [], totalCount: 0, totalPages: 1, page: 1 };
    }

    const data = await res.json();
    
    // El backend devuelve 'payments' según Swagger
    const list = data.payments || data.value?.payments || [];

    return {
      items: list,
      totalCount: data.totalCount || list.length,
      totalPages: data.totalPages || 1,
      page: data.page || 1
    };
  } catch (error) {
    console.error("💀 [PAGOS-API] Fallo crítico de conexión:", error);
    return { items: [], totalCount: 0, totalPages: 1, page: 1 };
  }
}

/**
 * ✅ LISTAR MÉTODOS DE PAGO
 */
export async function getPaymentMethods(token: string) {
  try {
    const res = await fetch(`${API_URL}/api/payment-methods`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.paymentMethods || [];
  } catch (error) {
    return [];
  }
}

/**
 * ✅ BUSCAR CLIENTES (Para el Selector/Autocomplete)
 */
export async function searchCustomers(token: string, term: string) {
  try {
    const res = await fetch(`${API_URL}/api/customers?search=${term}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.customers || data.value?.customers || [];
  } catch (error) {
    return [];
  }
}

/**
 * ✅ OBTENER PAGO POR ID
 */
export async function getPaymentById(token: string, id: string | number): Promise<Payment | null> {
  try {
    const url = `${API_URL}/api/payments/${id}`;
    console.log("📡 [DETALLE-API] Solicitando pago:", url);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });

    if (!res.ok) {
      // 🕵️‍♂️ Si entra aquí, el servidor falló (Status 500 o 404)
      console.error(`❌ [DETALLE-API] Error ${res.status} al buscar ID ${id}`);
      return null;
    }

    const data = await res.json();
    console.log("📦 [DETALLE-API] Datos recibidos:", data);

    return data.value || data;
  } catch (error) {
    console.error("💀 [DETALLE-API] Error de conexión:", error);
    return null;
  }
}

/**
 * ✅ CREAR COBRO
 */
export async function createPayment(token: string, body: CreatePaymentRequest) {
  try {
    const res = await fetch(`${API_URL}/api/payments`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(body),
    });
    
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { 
        ok: false, 
        message: data?.detail || data?.message || "Error al procesar el pago." 
      };
    }

    return { ok: true, id: data?.value || data };
  } catch (error) {
    return { ok: false, message: "No se pudo conectar con el servidor." };
  }
}

/**
 * ✅ REEMBOLSAR PAGO
 */
export async function refundPayment(token: string, input: { paymentId: number; reason: string }) {
  try {
    const res = await fetch(`${API_URL}/api/payments/${input.paymentId}/refund`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ reason: input.reason }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, message: data?.detail || "Error al reembolsar." };

    return { ok: true };
  } catch (error) {
    return { ok: false, message: "Error de conexión." };
  }
}

/**
 * ✅ ANULAR COBRO
 */
export async function voidPayment(token: string, input: { paymentId: number; reason: string }) {
  try {
    const res = await fetch(`${API_URL}/api/payments/${input.paymentId}/cancel`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ reason: input.reason }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, message: data?.detail || "Error al anular." };

    return { ok: true };
  } catch (error) {
    return { ok: false, message: "Error de conexión." };
  }
}

/**
 * ✅ ACTUALIZAR COBRO
 */
export async function updatePayment(token: string, paymentId: number, body: CreatePaymentRequest) {
  try {
    const res = await fetch(`${API_URL}/api/payments/${paymentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentId,
        ...body,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        ok: false,
        message: data?.detail || data?.message || "Error al actualizar el pago.",
      };
    }

    return { ok: true, id: data?.value || data };
  } catch {
    return { ok: false, message: "No se pudo conectar con el servidor." };
  }
}
