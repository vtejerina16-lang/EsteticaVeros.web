'use client';

import { useState, useEffect } from "react";
import { ReportFilters } from "./_components/report-filters";
import { ReportSummaryCards } from "./_components/report-summary-cards";
import { IncomeReportTable } from "./_components/income-report-table";
import { ServicesReportTable } from "./_components/services-report-table";
import { ExportActions } from "./_components/export-actions"; // <--- 1. IMPORTACIÓN FALTANTE
import { ReportsService } from "./_services/reports-service";
import { ReportType, ServicesReportRow } from "./_types/report-types";

export default function ReportsPage() {
  const [type, setType] = useState<ReportType>('payments');
  const [range, setRange] = useState({ from: '', to: '' });
  const [data, setData] = useState<any[]>([]); 
  const [servicesData, setServicesData] = useState<ServicesReportRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setData([]); 
      setServicesData([]);

      try {
        if (type === 'payments') {
          const res = await ReportsService.getPayments(range.from, range.to);
          setData(res);
        } 
        else if (type === 'movements') {
          const res = await ReportsService.getMovements(range.from, range.to);
          setData(res);
        }
        else if (type === 'reconciliations') {
          const res = await ReportsService.getReconciliations(range.from, range.to);
          setData(res);
        }
        else if (type === 'services') {
          const apps = await ReportsService.getAppointments(range.from, range.to);
          const agg: Record<string, ServicesReportRow> = {};
          
          apps.forEach((a: any) => {
            const name = a.serviceName || "Servicio General";
            if (!agg[name]) agg[name] = { id: name, serviceName: name, qty: 0, revenue: 0 };
            agg[name].qty += 1;
            agg[name].revenue += Number(a.totalAmount || 0);
          });
          
          setServicesData(Object.values(agg).sort((a, b) => b.revenue - a.revenue));
        }
      } catch (e) {
        console.error("Error en reporte:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [type, range]);

  return (
    <div className="p-8 space-y-8 bg-neutral-50 min-h-screen">
      {/* 2. COLOCAMOS EL BOTÓN EN EL HEADER */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter">
            Reportes de Estética
          </h1>
          <p className="text-neutral-500 font-medium">Control financiero y auditoría</p>
        </div>
        
        {/* El botón aparecerá a la derecha del título */}
        <ExportActions type={type} from={range.from} to={range.to} />
      </header>
      
      <ReportFilters 
        currentType={type} 
        onTypeChange={setType} 
        onRangeChange={setRange} 
      />

      <ReportSummaryCards 
        data={type === 'services' ? servicesData : data} 
        type={type} 
      />

      <main className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center animate-pulse text-rose-500 font-bold">
            Obteniendo datos de {type}...
          </div>
        ) : (
          <>
            {type === 'services' ? (
              <ServicesReportTable rows={servicesData} />
            ) : (
              <IncomeReportTable data={data} type={type} />
            )}
          </>
        )}
      </main>
    </div>
  );
}