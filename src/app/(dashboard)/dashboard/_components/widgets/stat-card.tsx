import { Card } from "../ui-card";

function moneyBOB(n: number) {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    maximumFractionDigits: 0,
  }).format(n);
}

export function StatCard({
  title,
  value,
  deltaText,
  money,
}: {
  title: string;
  value: string | number;
  deltaText?: string;
  money?: boolean;
}) {
  const v = typeof value === "number" ? (money ? moneyBOB(value) : String(value)) : value;

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-neutral-900">{title}</p>
          <p className="mt-2 text-3xl font-extrabold text-rose-600">{v}</p>
          {deltaText ? <p className="mt-1 text-xs text-neutral-500">{deltaText}</p> : null}
        </div>

        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 text-rose-700">
          📶
        </div>
      </div>
    </Card>
  );
}