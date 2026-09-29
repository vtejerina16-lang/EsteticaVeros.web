/**
 * 🌟 ESTADOS DE PAGO
 * Incluimos 'Completed' para que los KPIs y filtros funcionen con el backend de C#.
 */
export type PaymentStatus = "Paid" | "Void" | "Pending" | "Completed";

/**
 * 💳 INTERFAZ PRINCIPAL (Lo que llega de la API)
 * Contiene todos los alias posibles para evitar errores de "Property does not exist".
 */
export interface Payment {
  id: number;
  paymentNumber?: string;
  
  // Relaciones y Nombres (C# usa customerName/methodName)
  customerId: number;
  customerName?: string; 
  clientName?: string;    // Alias para el frontend
  
  paymentMethodId: number;
  methodName?: string;    
  method?: string;        // Alias para el detalle
  
  appointmentId?: number;
  
  // Caja y Sesión (Manejamos todas las variantes del backend)
  cashRegisterSessionId?: number;
  sessionId?: number;
  cashSessionId?: number; 
  sessionNumber?: string;

  // Datos financieros
  amount: number;
  reference?: string;
  notes?: string;
  voidReason?: string;    // Razón de anulación si status === "Void"
  
  // Estados y Tiempos
  status: PaymentStatus;
  statusName?: string;
  statusDisplayName?: string;
  
  createdAt: string;
  paymentDate: string;    // Fecha real del cobro (importante para KPIs)
  updatedAt?: string;
  createdByUserId?: string;
}

/**
 * 📊 ESTRUCTURA PARA LA TABLA (UI)
 */
export interface PaymentRow {
  id: string;
  createdAt: string;
  client: string;
  concept: string;
  method: string;
  total: number;
  totalFormatted: string;
  status: PaymentStatus;
  cashSessionId?: number;
}

/**
 * 📥 DTOs ADICIONALES
 */
export interface CreatePaymentRequest {
  customerId: number;
  paymentMethodId: number;
  amount: number;
  appointmentId?: number;
  cashRegisterSessionId?: number;
  reference?: string;
  notes?: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  isActive: boolean;
  requiresCashRegister: boolean;
}