import type { Service } from "../_types/services.types";

export function ServicePriceChip({ s }: { s: Service }) {
  const text =
    s.pricingType === "fixed"
      ? `Bs ${s.price ?? 0}`
      : s.pricingType === "from"
      ? `Desde Bs ${s.priceFrom ?? 0}`
      : `Bs ${s.priceFrom ?? 0} – ${s.priceTo ?? 0}`;

  return <span className="text-sm text-neutral-700">{text}</span>;
}