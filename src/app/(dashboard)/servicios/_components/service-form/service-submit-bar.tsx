"use client";

export function ServiceSubmitBar({ isEdit, pending }: { isEdit: boolean; pending: boolean }) {
  return (
    <div className="flex items-center justify-end">
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
      >
        {isEdit ? "Guardar cambios" : "Crear servicio"}
      </button>
    </div>
  );
}