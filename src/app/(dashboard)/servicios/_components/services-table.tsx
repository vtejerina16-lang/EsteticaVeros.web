"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";

import type { Service } from "../_types/services.types";
import { deleteServiceAction, toggleServiceActiveAction } from "../_actions/services-actions";
import { ServicePriceChip } from "./service-price-chip";
import { ServiceStatusBadge } from "./service-status-badge";
import { ServiceTypeBadge } from "./service-type-badge";
import { ConfirmDialog } from "../../_components/confirm-dialog";

type CategoryOption = { id: number | string; name: string };
type ModalKind = "toggle" | "delete";

export function ServicesTable({
  items = [],
  categories = [],
}: {
  items?: Service[];
  categories?: CategoryOption[];
}) {
  const categoryNameById = (id?: number | string | null) => {
    if (id === undefined || id === null || Number(id) <= 0) {
      return "Sin categoría";
    }

    const found = categories.find(
      (c) => Number(c.id) === Number(id)
    );

    return found?.name ?? "Sin categoría";
  };

  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<ModalKind>("delete");
  const [target, setTarget] = useState<{
    id: string;
    name: string;
    isActive: boolean;
  } | null>(null);

  const toggleFormRef = useRef<HTMLFormElement | null>(null);
  const deleteFormRef = useRef<HTMLFormElement | null>(null);

  const [pending, start] = useTransition();

  function askToggle(id: string, name: string, isActive: boolean) {
    setKind("toggle");
    setTarget({ id, name, isActive });
    setOpen(true);
  }

  function askDelete(id: string, name: string, isActive: boolean) {
    setKind("delete");
    setTarget({ id, name, isActive });
    setOpen(true);
  }

  function confirm() {
    setOpen(false);

    start(() => {
      if (kind === "toggle") {
        toggleFormRef.current?.requestSubmit();
      } else {
        deleteFormRef.current?.requestSubmit();
      }
    });
  }

  const title =
    kind === "delete"
      ? `Eliminar “${target?.name}”`
      : `${target?.isActive ? "Desactivar" : "Activar"} “${target?.name}”`;

  const description =
    kind === "delete"
      ? "Esta acción no se puede deshacer y eliminará el servicio permanentemente."
      : target?.isActive
      ? "El servicio dejará de estar disponible para nuevas reservas."
      : "El servicio volverá a estar visible y disponible para reservas.";

  const confirmText =
    kind === "delete"
      ? "Sí, eliminar"
      : target?.isActive
      ? "Sí, desactivar"
      : "Sí, activar";

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/40 p-10 text-center text-sm text-neutral-600">
        No se encontraron servicios con los filtros actuales.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-rose-50">
            <tr className="text-left text-xs font-semibold text-neutral-700">
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-rose-50">
            {items.map((s) => (
              <tr
                key={s.id}
                className="hover:bg-rose-50/20 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-neutral-900">
                    {s.name}
                  </div>

                  <div className="text-xs text-neutral-500">
                    {s.durationMinutes
                      ? `${s.durationMinutes} min`
                      : "—"}
                  </div>
                </td>

                <td className="px-4 py-3 text-neutral-600 font-medium">
                  {categoryNameById(s.categoryId)}
                </td>

                <td className="px-4 py-3">
                  <ServiceTypeBadge type={s.type} />
                </td>

                <td className="px-4 py-3">
                  <ServicePriceChip s={s} />
                </td>

                <td className="px-4 py-3">
                  <ServiceStatusBadge isActive={s.isActive} />
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end items-center gap-2">
                    <Link
                      href={`/servicios/${s.id}/editar`}
                      className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-rose-50 transition-colors"
                    >
                      Editar
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        askToggle(s.id, s.name, !!s.isActive)
                      }
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors bg-white ${
                        s.isActive
                          ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                          : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      {s.isActive ? "Desactivar" : "Activar"}
                    </button>

                    {!s.isActive && (
                      <button
                        type="button"
                        onClick={() =>
                          askDelete(s.id, s.name, !!s.isActive)
                        }
                        className="rounded-full border border-rose-300 text-rose-700 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-rose-100 transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Forms ocultos para Server Actions */}
      <form
        ref={toggleFormRef}
        action={toggleServiceActiveAction}
        className="hidden"
      >
        <input
          type="hidden"
          name="id"
          value={target?.id ?? ""}
        />
      </form>

      <form
        ref={deleteFormRef}
        action={deleteServiceAction}
        className="hidden"
      >
        <input
          type="hidden"
          name="id"
          value={target?.id ?? ""}
        />
      </form>

      <ConfirmDialog
        open={open}
        title={title}
        description={description}
        confirmText={confirmText}
        cancelText="Cancelar"
        danger={kind === "delete"}
        pending={pending}
        onClose={() => setOpen(false)}
        onConfirm={confirm}
      />
    </>
  );
}