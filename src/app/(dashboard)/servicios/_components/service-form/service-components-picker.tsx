"use client";

import type { ServicePickerItem } from "../../_types/services.types";

type CategoryOption = { id: number; name: string };

export function ServiceComponentsPicker({
  selectable,
  selectedIds,
  setSelectedIds,
  pending,
  categories = [],
}: {
  selectable: ServicePickerItem[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  pending: boolean;
  categories: CategoryOption[];
}) {
  const categoryNameById = (id: number) => categories.find((c) => c.id === id)?.name ?? "—";

  function toggle(id: string) {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  }

  return (
    <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4">
      <div className="text-sm font-semibold text-neutral-900">Componentes (incluye)</div>
      <p className="mt-1 text-xs text-neutral-600">Selecciona servicios incluidos.</p>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {selectable.map((x) => {
          const checked = selectedIds.includes(x.id);
          return (
            <label
              key={x.id}
              className="flex items-center justify-between rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2">
                <input type="checkbox" checked={checked} onChange={() => toggle(x.id)} disabled={pending} />
                <span className="font-medium">{x.name}</span>
                <span className="text-xs text-neutral-500">({categoryNameById(Number(x.categoryId))})</span>
              </span>

              {checked ? (
                <>
                  <input name="components_id" type="hidden" value={x.id} />
                  <input
                    name="components_qty"
                    type="number"
                    min={1}
                    defaultValue={1}
                    className="w-16 rounded-xl border border-rose-100 px-2 py-1 text-xs"
                    disabled={pending}
                  />
                </>
              ) : null}
            </label>
          );
        })}
      </div>
    </div>
  );
}