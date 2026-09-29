"use client";

import type { PricingType } from "../../_constants/services-enums";
import type { Service } from "../../_types/services.types";

export function ServicePricingFields({
  initial,
  pricingType,
  setPricingType,
  pending,
}: {
  initial?: Service | null;
  pricingType: PricingType;
  setPricingType: (p: PricingType) => void;
  pending: boolean;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div>
        <label className="block text-xs font-semibold text-neutral-700">Tipo de precio</label>
        <select
          name="pricingType"
          value={pricingType}
          onChange={(e) => setPricingType(e.target.value as PricingType)}
          className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm"
          disabled={pending}
        >
          <option value="fixed">Fijo</option>
          <option value="from">Desde</option>
          <option value="range">Rango</option>
        </select>
      </div>

      {pricingType === "fixed" ? (
        <div>
          <label className="block text-xs font-semibold text-neutral-700">Precio (Bs)</label>
          <input
            name="price"
            type="number"
            min={0}
            defaultValue={initial?.price ?? ""}
            className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm"
            required
            disabled={pending}
          />
        </div>
      ) : null}

      {pricingType === "from" ? (
        <div>
          <label className="block text-xs font-semibold text-neutral-700">Desde (Bs)</label>
          <input
            name="priceFrom"
            type="number"
            min={0}
            defaultValue={initial?.priceFrom ?? ""}
            className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm"
            required
            disabled={pending}
          />
        </div>
      ) : null}

      {pricingType === "range" ? (
        <>
          <div>
            <label className="block text-xs font-semibold text-neutral-700">Desde (Bs)</label>
            <input
              name="priceFrom"
              type="number"
              min={0}
              defaultValue={initial?.priceFrom ?? ""}
              className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm"
              required
              disabled={pending}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700">Hasta (Bs)</label>
            <input
              name="priceTo"
              type="number"
              min={0}
              defaultValue={initial?.priceTo ?? ""}
              className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm"
              required
              disabled={pending}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}