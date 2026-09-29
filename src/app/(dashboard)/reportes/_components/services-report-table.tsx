import type { ServicesReportRow } from "../_types/report-types";

// Formateador de moneda para Bolivia (BOB)
function money(n: number) {
  return new Intl.NumberFormat("es-BO", { 
    style: "currency", 
    currency: "BOB", 
    maximumFractionDigits: 2 // Cambiado a 2 para ver centavos si es necesario
  }).format(n);
}

interface ServicesReportTableProps {
  rows?: ServicesReportRow[]; // Lo hacemos opcional por si la API tarda
}

export function ServicesReportTable({ rows = [] }: ServicesReportTableProps) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-rose-500">Análisis Operativo</p>
        <h2 className="text-xl font-black text-neutral-900">Rendimiento por Servicios</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-left">
          <thead>
            <tr className="border-b border-neutral-100 text-xs font-bold uppercase text-neutral-400">
              <th className="pb-3 pr-3">Servicio</th>
              <th className="pb-3 pr-3 text-right">Cantidad Vendida</th>
              <th className="pb-3 pr-0 text-right">Ingresos Totales</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {rows.length === 0 ? (
              <tr>
                <td className="py-10 text-center text-neutral-400 italic" colSpan={3}>
                  No se encontraron servicios realizados en este periodo.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-rose-50/30 transition-colors">
                  <td className="py-4 pr-3 font-bold text-neutral-800">
                    {r.serviceName}
                  </td>
                  <td className="py-4 pr-3 text-right font-medium text-neutral-600">
                    {r.qty} <span className="text-[10px] text-neutral-400 font-normal">citas</span>
                  </td>
                  <td className="py-4 pr-0 text-right font-black text-rose-600">
                    {money(r.revenue)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {rows.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-neutral-100 bg-neutral-50/50">
                <td className="py-4 pr-3 font-black text-neutral-900">TOTAL</td>
                <td className="py-4 pr-3 text-right font-bold text-neutral-900">
                  {rows.reduce((acc, curr) => acc + curr.qty, 0)}
                </td>
                <td className="py-4 pr-0 text-right font-black text-rose-600">
                  {money(rows.reduce((acc, curr) => acc + curr.revenue, 0))}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </section>
  );
}