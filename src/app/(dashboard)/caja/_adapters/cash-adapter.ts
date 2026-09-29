import type { CashAccount, CashMovement, CashSession } from "../_types/cash";

/**
 * ETIQUETAS DE TEXTO
 */

export const accountTypeLabel: Record<CashAccount["type"], string> = {
  MAIN: "Caja Principal",
  PETTY: "Caja Chica",
};

export const sessionStatusLabel: Record<CashSession["status"], string> = {
  OPEN: "Abierta",
  CLOSED: "Cerrada",
};

// Ajustado a los valores numéricos de tu backend de C#
export const movementTypeLabel: Record<number, string> = {
  1: "Entrada",
  2: "Salida",
  3: "Retiro",
  4: "Depósito",
  5: "Transferencia",
  6: "Ajuste",
};

export const categoryLabel: Record<CashMovement["category"] | string, string> = {
  SALE_CASH: "Venta (efectivo)",
  CHANGE: "Cambio / Ajuste",
  WITHDRAWAL: "Retiro de efectivo",
  EXPENSE: "Gasto registrado",
  REFUND: "Reembolso / Reverso",
  TRANSFER: "Transferencia entre cajas",
  OTHER: "Otro concepto",
};

/**
 * FORMATEADORES DE UI
 */

export function formatBs(n: number) {
  return `${n.toFixed(2)} Bs`;
}

/**
 * Devuelve el color de texto según el tipo de movimiento
 * @param type 1 para ingresos (verde), otros para egresos (rojo)
 */
export function getTypeColor(type: number) {
  return type === 1 ? "text-green-600 font-bold" : "text-red-600 font-bold";
}

/**
 * Devuelve la clase de Tailwind para el badge de estado de sesión
 */
export function getStatusBadgeClass(status: CashSession["status"]) {
  return status === "OPEN"
    ? "bg-green-100 text-green-700 border-green-200"
    : "bg-gray-100 text-gray-700 border-gray-200";
}

/**
 * Formatea la fecha ISO del backend a algo legible para el usuario
 */
export function formatLocalTime(isoString: string) {
  if (!isoString) return "--:--";
  const date = new Date(isoString);
  return date.toLocaleString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}