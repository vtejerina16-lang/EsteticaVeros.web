import { 
  PaymentDTO, 
  CashMovementDTO, 
  CashReconciliationDTO 
} from "../_types/report-types";

const BASE_URL = "https://localhost:57679/api";

export const ReportsService = {
  /**
   * Obtiene el listado de pagos (Ventas)
   */
  getPayments: async (from?: string, to?: string): Promise<PaymentDTO[]> => {
    const params = new URLSearchParams();
    if (from && from !== '') params.append('startDate', from);
    if (to && to !== '') params.append('endDate', to);

    const queryStr = params.toString();
    const url = `${BASE_URL}/payments${queryStr ? `?${queryStr}` : ''}`;

    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
        const errorDetail = await res.text();
        console.error("Detalle del error en Pagos:", errorDetail);
        throw new Error(`Error ${res.status}: Fallo al procesar los pagos.`);
    }
    
    const data = await res.json();
    return data.payments || [];
  },

  /**
   * Obtiene citas para el reporte de servicios
   */
  getAppointments: async (from?: string, to?: string): Promise<any[]> => {
    const params = new URLSearchParams();
    if (from && from !== '') params.append('start_date', from);
    if (to && to !== '') params.append('end_date', to);

    const queryStr = params.toString();
    const url = `${BASE_URL}/appointments${queryStr ? `?${queryStr}` : ''}`;

    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
        const errorDetail = await res.text();
        console.error("Detalle del error en Citas:", errorDetail);
        throw new Error(`Error ${res.status}: Fallo al procesar las citas.`);
    }

    const data = await res.json();
    return data.appointments || [];
  },

  /**
   * Obtiene movimientos de caja
   */
  getMovements: async (from?: string, to?: string): Promise<CashMovementDTO[]> => {
    const params = new URLSearchParams();
    if (from && from !== '') params.append('startDate', from);
    if (to && to !== '') params.append('endDate', to);

    const queryStr = params.toString();
    const url = `${BASE_URL}/cash-movements${queryStr ? `?${queryStr}` : ''}`;

    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
        const errorDetail = await res.text();
        console.error("Detalle del error en Movimientos:", errorDetail);
        throw new Error(`Error ${res.status}: Fallo al procesar los movimientos.`);
    }

    const data = await res.json();
    return data.movements || [];
  },

  /**
   * Obtiene conciliaciones de caja
   */
  getReconciliations: async (from?: string, to?: string): Promise<CashReconciliationDTO[]> => {
    const params = new URLSearchParams();
    if (from && from !== '') params.append('startDate', from);
    if (to && to !== '') params.append('endDate', to);

    const queryStr = params.toString();
    const url = `${BASE_URL}/cash-reconciliations${queryStr ? `?${queryStr}` : ''}`;

    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
        const errorDetail = await res.text();
        console.error("Detalle del error en Conciliaciones:", errorDetail);
        throw new Error(`Error ${res.status}: Fallo al procesar las conciliaciones.`);
    }

    const data = await res.json();
    return data.reconciliations || [];
  }
};