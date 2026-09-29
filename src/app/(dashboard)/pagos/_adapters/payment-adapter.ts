import type { Payment, PaymentRow } from "../_types/payments";
import { formatBs, formatLocalTime } from "../../caja/_adapters/cash-adapter";

/**
 * ETIQUETAS VISUALES PARA MÉTODOS
 */
const methodLabel: Record<string | number, string> = {
  1: "💵 Efectivo",
  2: "💳 Tarjeta",
  3: "📱 Transferencia",
  4: "🔳 QR",
  cash: "💵 Efectivo",
  card: "💳 Tarjeta",
  transfer: "📱 Transferencia",
  qr: "🔳 QR",
};

/**
 * ADAPTADOR: Transforma el objeto de C# al formato que la Tabla entiende.
 */
export function toPaymentRow(p: Payment): PaymentRow {
  return {
    // 1. ID siempre como string para la URL
    id: String(p.id), 
    
    // 2. Fecha formateada para Bolivia
    createdAt: formatLocalTime(p.createdAt),
    
    // 3. Resolución de nombre del cliente (Prioriza C#)
    client: p.customerName || p.clientName || "Cliente General",
    
    // 4. Concepto dinámico
    concept: p.appointmentId 
      ? `📅 Cita #${p.appointmentId}` 
      : "🛍️ Venta Directa / Otros",
    
    // 5. Método con Emoji (Busca por ID o por Nombre)
    method: methodLabel[p.paymentMethodId] || p.methodName || p.method || "Otro",
    
    // 6. Montos
    total: p.amount, 
    totalFormatted: formatBs(p.amount),
    
    // 7. Estado
    status: p.status,

    // 8. Sesión de caja (Maneja cualquier alias del backend)
    cashSessionId: p.cashRegisterSessionId || p.sessionId || p.cashSessionId,
  };
}

/**
 * COLORES DE ESTADO (Badges)
 * Corregido para que 'Completed' (C#) se vea verde igual que 'Paid'.
 */
export function getPaymentStatusClass(status: string) {
  const s = status?.toLowerCase();
  
  // Éxito (Verde)
  if (s === "paid" || s === "completed" || s === "pagado") {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }
  
  // Anulado (Rojo)
  if (s === "void" || s === "anulado") {
    return "bg-rose-50 text-rose-700 border-rose-100";
  }
  
  // Pendiente (Amarillo)
  return "bg-amber-50 text-amber-700 border-amber-100";
}