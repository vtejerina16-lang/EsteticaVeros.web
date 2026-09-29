// src/app/(dashboard)/clientes/_components/empty-state.tsx

import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  secondaryHref,
  secondaryLabel,
}: Props) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-rose-600">Sin resultados</p>
        <h2 className="text-lg font-extrabold text-neutral-900">{title}</h2>
        {description ? <p className="text-sm text-neutral-600">{description}</p> : null}
      </div>

      {(actionHref && actionLabel) || (secondaryHref && secondaryLabel) ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {actionHref && actionLabel ? (
            <Link
              href={actionHref}
              className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              {actionLabel}
            </Link>
          ) : null}

          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}