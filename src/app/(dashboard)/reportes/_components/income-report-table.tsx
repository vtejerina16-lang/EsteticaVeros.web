import { ReportType } from "../_types/report-types";

interface IncomeReportTableProps {
  data: any[];
  type: ReportType;
}

export function IncomeReportTable({ data, type }: IncomeReportTableProps) {
  if (data.length === 0) {
    return <div className="p-20 text-center text-neutral-400 italic font-medium">No hay registros para este periodo.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead className="bg-neutral-50 border-b border-neutral-100">
          <tr>
            <th className="p-4 text-xs font-bold text-neutral-400 uppercase">Referencia</th>
            <th className="p-4 text-xs font-bold text-neutral-400 uppercase">Concepto / Cliente</th>
            <th className="p-4 text-xs font-bold text-neutral-400 uppercase">Fecha</th>
            <th className="p-4 text-xs font-bold text-neutral-400 uppercase text-right">Monto</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {data.map((item) => {
            // Lógica para detectar campos según el tipo de reporte
            const isRec = type === 'reconciliations';
            const isMov = type === 'movements';

            // 1. Determinar Referencia
            const ref = isRec ? item.reconciliationNumber : (item.paymentNumber || item.movementNumber || `#${item.id}`);
            
            // 2. Determinar Concepto
            const concepto = isRec ? `Arqueo Sesión: ${item.sessionNumber}` : (item.customerName || item.description || 'Venta Directa');
            const subConcepto = isRec ? item.statusName : (item.paymentMethodName || item.typeName);

            // 3. Determinar Fecha (Evita el Invalid Date)
            const rawDate = isRec ? item.reconciliationDate : (item.paymentDate || item.movementDate || item.createdAt);
            const fechaFormateada = rawDate ? new Date(rawDate).toLocaleDateString('es-BO') : 'S/Fecha';

            // 4. Determinar Monto
            const monto = isRec ? item.systemAmount : (item.amount || item.signedAmount || 0);

            return (
              <tr key={item.id} className="hover:bg-rose-50/30 transition-colors">
                <td className="p-4 font-mono text-xs text-rose-600 font-bold uppercase">
                  {ref}
                </td>
                <td className="p-4">
                  <p className="font-semibold text-neutral-800 leading-tight">{concepto}</p>
                  <p className="text-[10px] uppercase font-bold text-neutral-400 mt-1 tracking-wider">{subConcepto}</p>
                </td>
                <td className="p-4 text-sm text-neutral-500 font-medium">
                  {fechaFormateada}
                </td>
                <td className="p-4 text-right font-black text-neutral-900">
                  Bs {Number(monto).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}