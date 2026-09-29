"use client";

import type { Service } from "../../_types/services.types";
import type { ServiceType } from "../../_constants/services-enums";

type CategoryOption = { id: number; name: string };

export function ServiceBasicFields({
  initial,
  type,
  setType,
  pending,
  categories,
}: {
  initial?: Service | null;
  type: ServiceType;
  setType: (t: ServiceType) => void;
  pending: boolean;
  categories: CategoryOption[];
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div>
        <label className="block text-xs font-semibold text-neutral-700">Nombre</label>
        <input
          name="name"
          defaultValue={initial?.name ?? ""}
          className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm outline-none focus:border-rose-300"
          required
          disabled={pending}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-700">Categoría</label>
        <select
          name="categoryId"
          defaultValue={String(initial?.categoryId ?? "")}
          className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm"
          disabled={pending}
        >
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-700">Tipo</label>
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as ServiceType)}
          className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm"
          disabled={pending}
        >
          <option value="simple">Simple</option>
          <option value="composite">Compuesto</option>
          <option value="package">Paquete</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-700">Duración (min)</label>
        <input
          name="durationMinutes"
          type="number"
          min={0}
          defaultValue={initial?.durationMinutes ?? ""}
          className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm"
          disabled={pending}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700 md:col-span-2">
        <input name="isActive" type="checkbox" defaultChecked={initial?.isActive ?? true} disabled={pending} />
        Activo
      </label>
    </div>
  );
}