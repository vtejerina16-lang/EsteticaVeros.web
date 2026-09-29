// src/app/(dashboard)/caja/_types/cash.ts

export type CashAccountType = "MAIN" | "PETTY";

/**
 * 🌟 Los estados reales que vienen de tu backend C#
 */
export type CashSessionStatus = "Open" | "Closed" | "Reconciled";

/** * En tu backend: 
 * 1 = Ingreso (Income)
 * 2 = Gasto/Salida (Expense) 
 */
export type CashMovementType = number; 

export interface CashAccount {
  id: number; 
  name: string; 
  type: CashAccountType;
  isActive: boolean;
  fixedFloat?: number; 
  minThreshold?: number; 
}

export interface CashSession {
  id: number;
  sessionNumber: string;      // SES-2026-000X
  cashRegisterId: number;
  cashRegisterName: string;    // 👈 Reparado: Ahora TS lo reconoce
  openedByUserId: number;
  closedByUserId: number | null;
  openedAt: string;
  closedAt: string | null;
  initialAmount: number;
  expectedAmount: number;
  actualAmount: number | null;
  difference: number | null;
  status: CashSessionStatus;   // Open, Closed, Reconciled
  statusName: string;          // Abierta, Cerrada, Conciliada
  notes: string | null;
}

export interface CashMovement {
  id: number;
  cashRegisterSessionId: number;
  type: CashMovementType;     // 1: Ingreso, 2: Egreso
  amount: number;
  description: string;
  reference?: string;
  createdAt: string;
}

/**
 * Categorías opcionales para tipado interno
 */
export type CashMovementCategory =
  | "SALE_CASH"
  | "CHANGE"
  | "WITHDRAWAL"
  | "EXPENSE"
  | "REFUND"
  | "TRANSFER"
  | "OTHER";