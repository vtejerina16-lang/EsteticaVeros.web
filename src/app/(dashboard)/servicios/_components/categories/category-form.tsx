"use client";

import { useActionState } from "react";
import type { ServiceCategoryDetail } from "../../_types/service-categories.types";
import { upsertServiceCategoryAction } from "../../_actions/service-categories-actions";

type Props = { initial?: ServiceCategoryDetail | null };
type State = { ok: boolean; message?: string };
const initialState: State = { ok: false };

export function CategoryForm({ initial }: Props) {
  const [state, action, pending] = useActionState(upsertServiceCategoryAction, initialState);

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

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-neutral-700">Nombre</label>
          <input
            name="name"
            defaultValue={initial?.name ?? ""}
            className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm"
            required
            disabled={pending}
          />
        </div>

        {initial?.id ? (
          <div>
            <label className="block text-xs font-semibold text-neutral-700">Orden</label>
            <input
              name="displayOrder"
              type="number"
              min={1}
              defaultValue={initial.displayOrder ?? 1}
              className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm"
              disabled={pending}
            />
          </div>
        ) : (
          <div className="flex items-end">
            <p className="text-xs text-neutral-500">
              El orden se asignará automáticamente de forma secuencial.
            </p>
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-neutral-700 md:col-span-2">
          <input name="isActive" type="checkbox" defaultChecked={initial?.isActive ?? true} disabled={pending} />
          Activa
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
        >
          {initial?.id ? "Guardar cambios" : "Crear categoría"}
        </button>
      </div>
    </form>
  );
}