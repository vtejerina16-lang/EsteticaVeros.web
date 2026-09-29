import Link from "next/link";
import { Card } from "../ui-card";

function moneyBOB(n: number) {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    maximumFractionDigits: 0,
  }).format(n);
}

export function CashCard({
  title,
  amount,
  hint,
  primaryHref,
  secondaryHref,
}: {
  title: string;
  amount: number;
  hint?: string;
  primaryHref: string;
  secondaryHref: string;
}) {
  return (
    <Card>
      <p className="text-sm font-extrabold text-neutral-900">{title}</p>
      <p className="mt-2 text-3xl font-extrabold text-rose-600">{moneyBOB(amount)}</p>
      {hint ? <p className="mt-1 text-xs text-neutral-500">{hint}</p> : null}

      <div className="mt-4 flex gap-3">
        <Link
          href={primaryHref}
          className="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-rose-600"
        >
          Registrar ingreso
        </Link>

        <Link
          href={secondaryHref}
          className="inline-flex h-10 items-center justify-center rounded-2xl border border-rose-100 bg-white px-4 text-sm font-semibold text-rose-700 hover:bg-rose-50"
        >
          Registrar gasto
        </Link>
      </div>
    </Card>
  );
}