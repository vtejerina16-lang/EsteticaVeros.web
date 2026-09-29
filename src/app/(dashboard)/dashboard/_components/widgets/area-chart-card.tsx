import { Card } from "../ui-card";
import { AreaChartSvg } from "./chart-svg";

function moneyBOB(n: number) {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    maximumFractionDigits: 0,
  }).format(n);
}

export function AreaChartCard({
  title,
  total,
  subtitle,
  months,
  seriesA,
  seriesB,
  actionLabel,
}: {
  title: string;
  total: number;
  subtitle?: string;
  months: string[];
  seriesA: number[];
  seriesB: number[];
  actionLabel?: string;
}) {
  return (
    <Card className="p-0">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-neutral-900">{title}</p>
            <p className="mt-2 text-4xl font-extrabold text-rose-600">{moneyBOB(total)}</p>
            {subtitle ? <p className="mt-1 text-xs text-neutral-500">{subtitle}</p> : null}
          </div>

          {actionLabel ? (
            <button className="h-10 rounded-2xl bg-rose-500 px-4 text-sm font-semibold text-white hover:bg-rose-600">
              {actionLabel} ▾
            </button>
          ) : null}
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="rounded-2xl border border-rose-100 bg-white/60 p-4">
          <AreaChartSvg months={months} a={seriesA} b={seriesB} />
          <div className="mt-3 flex items-center justify-center gap-6 text-xs font-semibold text-neutral-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Ingresos totales
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-300" />
              Gastos
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}