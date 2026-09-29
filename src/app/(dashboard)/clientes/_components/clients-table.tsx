"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type { Client, ClientStatusFilter, Paginated } from "../_types.clients";
import { toggleClientStatusAction } from "../_actions/clients-actions";
import { Pagination } from "./pagination";

function badge(active: boolean) {
  return active ? (
    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
      Activo
    </span>
  ) : (
    <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700">
      Inactivo
    </span>
  );
}

export function ClientsTable({
  data,
  query,
}: {
  data: Paginated<Client>;
  query: { search: string; status: ClientStatusFilter; page: number; pageSize: number };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [selectedClient, setSelectedClient] = useState<{
    id: string;
    name: string;
    nextActive: boolean;
  } | null>(null);

  function handleToggleClick(id: string, name: string, nextActive: boolean) {
    setSelectedClient({ id, name, nextActive });
  }

  function handleConfirm() {
    if (!selectedClient) return;

    startTransition(async () => {
      await toggleClientStatusAction(
        selectedClient.id,
        selectedClient.nextActive
      );

      setSelectedClient(null); // cerrar modal
      router.refresh();        // 🔥 refrescar datos
    });
  }

  return (
    <div className="rounded-2xl border border-rose-100 bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div>
          <p className="text-xs font-semibold text-rose-600">Listado</p>
          <h2 className="text-base font-extrabold text-neutral-900">Clientes</h2>
        </div>

        <Link
          href="/clientes/nuevo"
          className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Nuevo cliente
        </Link>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-t border-rose-100 bg-rose-50/40">
            <tr className="text-left text-xs font-semibold text-neutral-700">
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Puntos</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-rose-100">
            {data.items.map((c) => {
              const name = c.fullName ?? `${c.firstName} ${c.lastName}`.trim();

              return (
                <tr key={c.id} className="hover:bg-rose-50/30">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-neutral-900">{name}</div>
                    <div className="text-xs text-neutral-600">{c.email ?? "—"}</div>
                  </td>

                  <td className="px-4 py-3">{c.phoneNumber}</td>
                  <td className="px-4 py-3">{c.customerNumber ?? "—"}</td>
                  <td className="px-4 py-3">{c.loyaltyPoints ?? 0}</td>
                  <td className="px-4 py-3">{badge(c.isActive)}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/clientes/${c.id}`}
                        className="rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        Ver
                      </Link>

                      <button
                        onClick={() =>
                          handleToggleClick(c.id, name, !c.isActive)
                        }
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                      >
                        {c.isActive ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {data.items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-600">
                  No hay clientes con estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <Pagination
        base={{ search: query.search, status: query.status }}
        page={data.page}
        pageSize={data.pageSize}
        total={data.total}
        totalPages={data.totalPages}
      />

      {/* MODAL */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="text-sm font-bold text-neutral-900">
              Confirmar acción
            </h3>

            <p className="mt-2 text-sm text-neutral-700">
              {selectedClient.nextActive
                ? `¿Activar a "${selectedClient.name}"?`
                : `¿Desactivar a "${selectedClient.name}"?`}
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelectedClient(null)}
                disabled={pending}
                className="rounded px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirm}
                disabled={pending}
                className="rounded bg-rose-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
              >
                {pending ? "Procesando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}