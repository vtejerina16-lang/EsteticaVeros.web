"use client";

import type { Service } from "../../_types/services.types";

export function ServiceVariabilityNote({ initial, pending }: { initial?: Service | null; pending: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-700">Notas</label>
      <textarea
        name="notes"
        defaultValue={initial?.notes ?? ""}
        rows={3}
        className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm"
        placeholder="Ej: Precio variable según largo/grosor/estado o material…"
        disabled={pending}
      />
    </div>
  );
}