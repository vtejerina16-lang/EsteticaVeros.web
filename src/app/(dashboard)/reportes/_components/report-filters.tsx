import { Dispatch, SetStateAction } from "react";
import { ReportType } from "../_types/report-types";

interface ReportFiltersProps {
  currentType: ReportType;
  onTypeChange: Dispatch<SetStateAction<ReportType>>;
  onRangeChange: Dispatch<SetStateAction<{ from: string; to: string }>>;
}

export function ReportFilters({ currentType, onTypeChange, onRangeChange }: ReportFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
      <div>
        <label className="block text-xs font-bold text-neutral-400 uppercase mb-2 ml-1">Tipo de Reporte</label>
        <select 
          value={currentType}
          onChange={(e) => onTypeChange(e.target.value as ReportType)}
          className="w-full p-3 bg-neutral-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-rose-500"
        >
          <option value="payments">Ventas y Pagos</option>
          <option value="movements">Movimientos de Caja</option>
          <option value="reconciliations">Conciliaciones</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-neutral-400 uppercase mb-2 ml-1">Desde</label>
        <input 
          type="date" 
          onChange={(e) => onRangeChange(prev => ({ ...prev, from: e.target.value }))}
          className="w-full p-3 bg-neutral-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-rose-500" 
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-neutral-400 uppercase mb-2 ml-1">Hasta</label>
        <input 
          type="date" 
          onChange={(e) => onRangeChange(prev => ({ ...prev, to: e.target.value }))}
          className="w-full p-3 bg-neutral-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-rose-500" 
        />
      </div>
    </div>
  );
}