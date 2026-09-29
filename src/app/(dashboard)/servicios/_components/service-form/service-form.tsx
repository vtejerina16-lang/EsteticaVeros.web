"use client";

import { useActionState, useMemo, useState } from "react";
import type { PricingType, ServiceType } from "../../_constants/services-enums";
import type { Service, ServicePickerItem } from "../../_types/services.types";
import { upsertServiceAction } from "../../_actions/services-actions";
import { ServiceBasicFields } from "./service-basic-fields";
import { ServicePricingFields } from "./service-pricing-fields";
import { ServiceVariabilityNote } from "./service-variability-note";
import { ServiceComponentsPicker } from "./service-components-picker";
import { ServiceSubmitBar } from "./service-submit-bar";

type CategoryOption = { id: number; name: string };

type Props = {
  initial?: Service | null;
  pickerItems: ServicePickerItem[] | unknown; // 👈 por seguridad
  categories: CategoryOption[];              // ✅ AGREGAR
};

type ActionState = { ok: boolean; message?: string };
const initialState: ActionState = { ok: false };

export function ServiceForm({ initial, pickerItems, categories }: Props) { // ✅ RECIBIR
  const [state, action, pending] = useActionState(upsertServiceAction, initialState);

  const [type, setType] = useState<ServiceType>(initial?.type ?? "simple");
  const [pricingType, setPricingType] = useState<PricingType>(initial?.pricingType ?? "fixed");

  const safePicker: ServicePickerItem[] = Array.isArray(pickerItems) ? (pickerItems as ServicePickerItem[]) : [];

  const initialSelected = useMemo(() => new Set((initial?.components ?? []).map((c) => c.serviceId)), [initial]);
  const [componentIds, setComponentIds] = useState<string[]>(Array.from(initialSelected));

  const selectable = useMemo(() => {
    const selfId = initial?.id;
    return safePicker.filter((x) => x.id !== selfId).sort((a, b) => a.name.localeCompare(b.name));
  }, [safePicker, initial?.id]);

  return (
    <form action={action} className="mt-5 space-y-4">
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      {state?.message ? (
        <div
          className={`rounded-2xl border p-3 text-sm ${
            state.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <ServiceBasicFields
        initial={initial}
        type={type}
        setType={setType}
        pending={pending}
        categories={categories}     // ✅ PASAR
      />

      <ServicePricingFields initial={initial} pricingType={pricingType} setPricingType={setPricingType} pending={pending} />
      <ServiceVariabilityNote initial={initial} pending={pending} />

      {type === "composite" || type === "package" ? (
        <ServiceComponentsPicker
  selectable={selectable}
  selectedIds={componentIds}
  setSelectedIds={setComponentIds}
  pending={pending}
  categories={categories}
/>
      ) : null}

      <ServiceSubmitBar isEdit={Boolean(initial?.id)} pending={pending} />
    </form>
  );
}