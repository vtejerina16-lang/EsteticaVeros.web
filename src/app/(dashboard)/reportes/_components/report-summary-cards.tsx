import { ReportType } from "../_types/report-types";

interface SummaryProps {
  data: any[];
  type: ReportType;
}

export function ReportSummaryCards({ data, type }: SummaryProps) {
  // Sumamos según el campo disponible en cada tipo de objeto
  const total = data.reduce((acc, curr) => {
    if (type === 'reconciliations') return acc + Number(curr.systemAmount || 0);
    if (type === 'payments') return acc + Number(curr.amount || 0);
    if (type === 'movements') return acc + Number(curr.amount || curr.signedAmount || 0);
    return acc;
  }, 0);

  const count = data.length;

  // Título dinámico para la tarjeta
  const labels: Record<string, string> = {
    payments: 'Total Ventas',
    movements: 'Total Movimientos',
    reconciliations: 'Efectivo en Sistema',
    services: 'Ingreso por Servicios'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm transition-all hover:shadow-md">
        <p className="text-[10px] font-black text-neutral-400 uppercase mb-1 tracking-widest">
          {labels[type] || 'Total'}
        </p>
        <p className="text-3xl font-black text-rose-600">
          Bs {total.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm transition-all hover:shadow-md">
        <p className="text-[10px] font-black text-neutral-400 uppercase mb-1 tracking-widest">Registros</p>
        <p className="text-3xl font-black text-neutral-800">{count}</p>
      </div>
    </div>
  );
}