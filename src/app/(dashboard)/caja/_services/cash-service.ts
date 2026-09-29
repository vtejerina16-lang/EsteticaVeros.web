// src/app/(dashboard)/caja/_services/cash-service.ts
import { CashSession, CashMovement } from "../_types/cash";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL; 

// ============================================================================
// 1. GESTIÓN DE CAJAS REGISTRADORAS
// ============================================================================

/**
 * ✅ LISTAR CAJAS REGISTRADORAS
 */
export async function listCashRegisters(token: string | null) {
  if (!token) return [];
  const res = await fetch(`${API_URL}/api/cash-registers`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.cashRegisters || []; 
}


// ============================================================================
// 2. GESTIÓN DE SESIONES DE CAJA
// ============================================================================

/**
 * ✅ OBTENER SESIÓN ABIERTA (DINÁMICA)
 * Busca en todas las cajas si existe alguna sesión con estado 'Open'
 */
export async function getCurrentMainSession(token: string | null): Promise<CashSession | null> {
  if (!token) return null;

  try {
    // 🌟 CAMBIO CLAVE: Usamos el listado general con filtro de estado
    const res = await fetch(`${API_URL}/api/cash-register-sessions?status=Open`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    
    if (!res.ok) return null;

    const data = await res.json();
    const list = data.sessions || data.value || data;

    // Si hay al menos una sesión abierta, devolvemos la primera que encontremos
    if (Array.isArray(list) && list.length > 0) {
      const activeSession = list[0];
      console.log("🕵️‍♂️ [DEBUG] Sesión detectada:", activeSession);
      
      return { 
        ...activeSession, 
        id: activeSession.id, 
        initialAmount: Number(activeSession.initialAmount || 0) 
      };
    }

    return null; // No hay sesiones abiertas en ninguna caja
  } catch (error) {
    console.error("Error buscando sesión activa:", error);
    return null;
  }
}

/**
 * ✅ LISTADO DE SESIONES
 */
export async function listSessions(token: string | null): Promise<CashSession[]> {
  // Quitamos el ID fijo para que traiga el historial de TODAS las cajas
  const res = await fetch(`${API_URL}/api/cash-register-sessions`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  
  if (!res.ok) return [];
  
  const data = await res.json().catch(() => null);
  
  // 🌟 EL FIX: Buscamos específicamente la propiedad "sessions" que envía tu C#
  const list = data?.sessions || data?.value || data;
  
  return Array.isArray(list) ? list : [];
}

/**
 * ✅ APERTURA DE CAJA (Ahora dinámica)
 */
export async function openMainSession(
  token: string | null,
  input: { cashRegisterId: number; openingFloat: number }
): Promise<{ ok: true; session: CashSession } | { ok: false; message: string }> {
  const res = await fetch(`${API_URL}/api/cash-register-sessions/open`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ 
      cashRegisterId: input.cashRegisterId, 
      initialAmount: input.openingFloat 
    }),
  });
  const data = await res.json().catch(() => null);
  
  if (!res.ok) {
    return { ok: false, message: data?.detail || data?.message || "Error al abrir la caja." };
  }
  return { ok: true, session: data?.session || data?.value || data };
}

/**
 * ✅ CIERRE DE CAJA
 */
export async function closeMainSession(
  token: string | null,
  input: { cashSessionId: number; actualAmount?: number; notes?: string }
): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await fetch(`${API_URL}/api/cash-register-sessions/${input.cashSessionId}/close`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ 
      actualAmount: input.actualAmount, 
      notes: input.notes 
    }),
  });
  
  if (!res.ok) return { ok: false, message: "Error al cerrar caja" };
  return { ok: true };
}


// ============================================================================
// 3. ARQUEOS Y CONCILIACIONES
// ============================================================================

/**
 * ✅ LISTAR CONCILIACIONES (ARQUEOS)
 * Trae todos los arqueos que los cajeros han enviado al cerrar turno.
 */
export async function listReconciliations(token: string | null) {
  if (!token) return [];
  
  const res = await fetch(`${API_URL}/api/cash-reconciliations`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  
  if (!res.ok) return [];
  
  const data = await res.json().catch(() => null);
  
  // 🌟 EL FIX: Atrapamos cualquier nombre que use tu C# para envolver la lista
  const list = data?.cashReconciliations || data?.reconciliations || data?.items || data?.value || data;
  
  return Array.isArray(list) ? list : [];
}

/**
 * ✅ CREAR ARQUEO DE CAJA
 * Se usa para registrar el dinero físico
 */
export async function createReconciliation(
  token: string | null,
  input: { cashRegisterSessionId: number; countedAmount: number; notes: string }
): Promise<{ ok: true; data: any } | { ok: false; message: string }> {
  const res = await fetch(`${API_URL}/api/cash-reconciliations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      cashRegisterSessionId: input.cashRegisterSessionId,
      countedAmount: input.countedAmount,
      denominationDetails: "{}", 
      notes: input.notes || "Cierre y arqueo de turno"
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    return { ok: false, message: error?.detail || "Error al crear el arqueo de caja." };
  }
  
  return { ok: true, data: await res.json() };
}

/**
 * ✅ APROBAR ARQUEO
 * Usado por Gerencia para dar el visto bueno a la diferencia del arqueo
 */
export async function approveReconciliation(
  token: string | null,
  reconciliationId: number,
  notes: string
) {
  const res = await fetch(`${API_URL}/api/cash-reconciliations/${reconciliationId}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ notes })
  });

  return res.ok;
}

/**
 * ✅ RECHAZAR ARQUEO (CORREGIDO)
 * Tu backend espera "reason" en lugar de "notes"
 */
export async function rejectReconciliation(
  token: string | null,
  reconciliationId: number,
  notes: string
) {
  console.log(`🚀 Intentando rechazar arqueo #${reconciliationId} con razón: ${notes}`);
  
  const res = await fetch(`${API_URL}/api/cash-reconciliations/${reconciliationId}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    // 🌟 CAMBIO AQUÍ: Enviamos "reason" porque así lo pide tu C#
    body: JSON.stringify({ reason: notes || "Rechazado por discrepancia" })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("❌ ERROR AL RECHAZAR:", res.status, errorData);
    return false;
  }

  console.log("✅ Arqueo rechazado con éxito.");
  return true;
}


// ============================================================================
// 4. MOVIMIENTOS DE CAJA (INGRESOS Y EGRESOS)
// ============================================================================

/**
 * ✅ LISTADO DE MOVIMIENTOS (VERSION FINAL)
 */
export async function listMovementsBySession(token: string | null, sessionId: number): Promise<CashMovement[]> {
  if (!token) return [];

  const url = `${API_URL}/api/cash-movements?cashRegisterSessionId=${sessionId}`;
  
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });

    if (!res.ok) return [];

    const data = await res.json();
    
    // 🌟 EL FIX: Según tu debug, la propiedad se llama "movements"
    const list = data.movements || []; 
    
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error("❌ Error al traer movimientos:", error);
    return [];
  }
}

/**
 * ✅ REGISTRAR GASTO MANUAL (Salida de dinero)
 */
export async function recordExpenseForOpenSession(
  token: string | null,
  input: { amount: number; expenseCategory: string; description: string }
): Promise<{ ok: true; cashSessionId: string; movementId: number } | { ok: false; message: string }> {
  const currentSession = await getCurrentMainSession(token);
  if (!currentSession) return { ok: false, message: "No hay una caja abierta." };

  const res = await fetch(`${API_URL}/api/cash-movements`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      cashRegisterSessionId: currentSession.id,
      type: 2, 
      amount: input.amount,
      description: `Gasto (${input.expenseCategory}): ${input.description}`,
      reference: "GASTO_MANUAL"
    }),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    return { ok: false, message: error?.detail || "Error al registrar gasto." };
  }
  
  const result = await res.json();
  return { ok: true, cashSessionId: String(currentSession.id), movementId: result.id };
}

/**
 * ✅ REGISTRAR INGRESO POR PAGO (Entrada de dinero)
 */
export async function recordCashSaleForPayment(
  token: string | null,
  input: { paymentId: string; amount: number; description?: string; cashRegisterSessionId: number }
): Promise<{ ok: true; cashSessionId: string; movementId: number } | { ok: false; message: string }> {
  const res = await fetch(`${API_URL}/api/cash-movements`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      cashRegisterSessionId: input.cashRegisterSessionId,
      type: 1, 
      amount: input.amount,
      description: input.description ?? `Cobro Pago ${input.paymentId}`,
      reference: input.paymentId
    }),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    return { ok: false, message: error?.detail || "Error al registrar ingreso." };
  }
  
  const result = await res.json();
  return { ok: true, cashSessionId: String(input.cashRegisterSessionId), movementId: result.id };
}
/**
 * ✅ CREAR NUEVA CAJA
 * Basado en POST /api/cash-registers
 */
export async function createCashRegister(token: string | null, input: { name: string; location: string }) {
  const res = await fetch(`${API_URL}/api/cash-registers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: input.name, location: input.location || "" })
  });
  return res.ok;
}

/**
 * ✅ ACTUALIZAR CAJA
 * Basado en PUT /api/cash-registers/{id}
 */
export async function updateCashRegister(token: string | null, id: number, input: { name: string; location: string }) {
  const res = await fetch(`${API_URL}/api/cash-registers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: input.name, location: input.location || "" })
  });
  return res.ok;
}

/**
 * ✅ ACTIVAR / DESACTIVAR CAJA
 * Basado en POST /api/cash-registers/{id}/activate (o deactivate)
 */
export async function toggleCashRegisterStatus(token: string | null, id: number, action: "activate" | "deactivate") {
  const res = await fetch(`${API_URL}/api/cash-registers/${id}/${action}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.ok;
}