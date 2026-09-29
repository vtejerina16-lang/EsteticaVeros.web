import { Card } from "../ui-card";
import { MiniChartSvg } from "./mini-chart-svg";

function moneyBOB(n: number) {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    maximumFractionDigits: 0,
  }).format(n);
}

export function MiniChartCard({
  title,
  total,
  series,
}: {
  title: string;
  total: number;
  series: number[];
}) {
  return (
    <Card>
      <p className="text-sm font-extrabold text-neutral-900">{title}</p>
      <p className="mt-2 text-3xl font-extrabold text-rose-600">{moneyBOB(total)}</p>
      <div className="mt-3 rounded-2xl border border-rose-100 bg-white/60 p-3">
        <MiniChartSvg series={series} />
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-neutral-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          Ingresos totales
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-300" />
          Gastos
        </span>
      </div>
    </Card>
  );
}