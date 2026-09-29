export type ReportType = 'payments' | 'movements' | 'reconciliations' | 'sessions' | 'services';

export interface PaymentDTO {
  id: number;
  paymentNumber: string;
  appointmentId: number | null;
  customerId: number;
  customerName: string;
  paymentMethodId: number;
  paymentMethodName: string;
  cashRegisterSessionId: number | null;
  sessionNumber: string | null;
  amount: number;
  paymentDate: string;
  notes: string | null;
  reference: string | null;
  status: string;      // Viene como "Completed"
  statusName: string;  // Viene como "Completado"
  createdAt: string;
}

export interface ServicesReportRow {
  id: number | string;
  serviceName: string;
  qty: number;
  revenue: number;
}

export interface CashMovementDTO {
  id: number;
  movementNumber: string;
  cashRegisterSessionId: number;
  sessionNumber: string;
  type: number;
  typeName: string;
  amount: number;
  signedAmount: number;
  description: string;
  movementDate: string;
}

export interface CashReconciliationDTO {
  id: number;
  reconciliationNumber: string;
  systemAmount: number;
  countedAmount: number;
  difference: number;
  hasDifference: boolean;
  statusName: string;
  reconciliationDate: string;
}

export interface ServicesReportRow {
  id: number | string;
  serviceName: string;
  qty: number;
  revenue: number;
}