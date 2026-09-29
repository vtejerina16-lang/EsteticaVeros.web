import { categoryNameById } from "../../_constants/services-categories";
import { pricingLabel, typeLabel } from "../../_constants/services-enums";
import type { Service } from "../../_types/services.types";

export function ServiceDetailsCard({ s }: { s: Service }) {
  const price =
    s.pricingType === "fixed"
      ? `Bs ${s.price ?? 0}`
      : s.pricingType === "from"
      ? `Desde Bs ${s.priceFrom ?? 0}`
      : `Bs ${s.priceFrom ?? 0} – ${s.priceTo ?? 0}`;

  return (
    <div className="rounded-2xl border border-rose-100 p-4">
      <div className="text-xs font-semibold text-neutral-600">Información</div>
      <div className="mt-1 text-lg font-extrabold text-neutral-900">{s.name}</div>

      <div className="mt-2 text-sm text-neutral-700">
        {categoryNameById(s.categoryId)} · {typeLabel(s.type)} · {pricingLabel(s.pricingType)}
      </div>

      <div className="mt-2 text-sm text-neutral-700">
        Precio: <span className="font-semibold">{price}</span>
      </div>

      <div className="mt-2 text-sm text-neutral-700">
        Duración: <span className="font-semibold">{s.durationMinutes ? `${s.durationMinutes} min` : "—"}</span>
      </div>

      <div className="mt-2 text-sm text-neutral-700">
        Notas: <span className="font-semibold">{s.notes ?? "—"}</span>
      </div>
    </div>
  );
}