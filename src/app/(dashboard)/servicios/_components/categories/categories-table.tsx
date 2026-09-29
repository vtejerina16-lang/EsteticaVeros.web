"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import type { ServiceCategoryRecord } from "../../_types/service-categories.types";
import {
  toggleServiceCategoryActiveAction,
  deleteServiceCategoryAction,
} from "../../_actions/service-categories-actions";
import { ConfirmDialog } from "../../../_components/confirm-dialog";

type ModalKind = "toggle" | "delete";

export function CategoriesTable({ items }: { items: ServiceCategoryRecord[] }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<ModalKind>("toggle");
  const [target, setTarget] = useState<{ id: number; name: string; isActive: boolean } | null>(null);

  const toggleFormRef = useRef<HTMLFormElement | null>(null);
  const deleteFormRef = useRef<HTMLFormElement | null>(null);

  const pending = false;

  function askToggle(id: number, name: string, isActive: boolean) {
    setKind("toggle");
    setTarget({ id, name, isActive });
    setOpen(true);
  }

  function askDelete(id: number, name: string, isActive: boolean) {
    setKind("delete");
    setTarget({ id, name, isActive });
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setTarget(null);
  }

  function confirm() {
    setOpen(false);
    setTarget(null);

    if (kind === "toggle") {
      toggleFormRef.current?.requestSubmit();
    } else {
      deleteFormRef.current?.requestSubmit();
    }
  }

  const title =
    kind === "delete"
      ? target
        ? `Eliminar “${target.name}”`
        : "Eliminar categoría"
      : target
      ? `${target.isActive ? "Desactivar" : "Activar"} “${target.name}”`
      : "Cambiar estado";

  const description =
    kind === "delete"
      ? "La categoría será eliminada. Si tiene servicios asociados, la operación puede ser rechazada."
      : target?.isActive
      ? "La categoría quedará inactiva y podría ocultarse en listados o filtros."
      : "La categoría volverá a estar disponible para su uso.";

  const confirmText =
    kind === "delete"
      ? "Sí, eliminar"
      : target?.isActive
      ? "Sí, desactivar"
      : "Sí, activar";

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-rose-100">
        <table className="w-full text-sm">
          <thead className="bg-rose-50">
            <tr className="text-left text-xs font-semibold text-neutral-700">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t border-rose-50">
                <td className="px-4 py-3 font-semibold text-neutral-900">{c.name}</td>
                <td className="px-4 py-3 text-neutral-700">{c.displayOrder}</td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      c.isActive ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {c.isActive ? "Activa" : "Inactiva"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end items-center gap-2">
                    <Link
                      href={`/servicios/categorias/${c.id}/editar`}
                      className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-rose-50 transition-colors"
                    >
                      Editar
                    </Link>

                    {c.isActive ? (
                      <button
                        type="button"
                        onClick={() => askToggle(c.id, c.name, Boolean(c.isActive))}
                        className="rounded-full border border-amber-300 text-amber-700 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-amber-50 transition-colors"
                      >
                        Desactivar
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => askToggle(c.id, c.name, Boolean(c.isActive))}
                          className="rounded-full border border-emerald-300 text-emerald-700 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-emerald-50 transition-colors"
                        >
                          Activar
                        </button>

                        <button
                          type="button"
                          onClick={() => askDelete(c.id, c.name, Boolean(c.isActive))}
                          className="rounded-full border border-rose-300 text-rose-700 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-rose-100 transition-colors"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {!items.length ? (
              <tr>
                <td className="px-4 py-6 text-sm text-neutral-600" colSpan={4}>
                  No hay categorías registradas.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <form ref={toggleFormRef} action={toggleServiceCategoryActiveAction} className="hidden">
        <input type="hidden" name="id" value={target?.id ?? ""} />
      </form>

      <form ref={deleteFormRef} action={deleteServiceCategoryAction} className="hidden">
        <input type="hidden" name="id" value={target?.id ?? ""} />
      </form>

      <ConfirmDialog
        open={open}
        title={title}
        description={description}
        confirmText={confirmText}
        cancelText="Cancelar"
        danger={kind === "delete"}
        pending={pending}
        onClose={close}
        onConfirm={confirm}
      />
    </>
  );
}