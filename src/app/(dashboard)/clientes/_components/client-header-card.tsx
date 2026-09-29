"use client";

import { useState } from "react";
import Link from "next/link";
import type { Client } from "../_types.clients";
import { toggleClientStatusAction } from "../_actions/clients-actions";

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

export function ClientHeaderCard({ client }: { client: Client }) {
  const full =
    client.fullName ?? `${client.firstName} ${client.lastName}`.trim();

  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold text-rose-600">Ficha</p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-extrabold text-neutral-900">
              {full}
            </h1>
            {badge(client.isActive)}
          </div>

          <div className="mt-2 text-sm text-neutral-700">
            <span className="font-semibold">Tel:</span> {client.phoneNumber}
            <span className="mx-2 text-neutral-300">|</span>
            <span className="font-semibold">Email:</span>{" "}
            {client.email ?? "—"}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/clientes/${client.id}?edit=1`}
            className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
          >
            Editar
          </Link>

          {/* FORM PRINCIPAL */}
          <form
            action={toggleClientStatusAction.bind(
              null,
              client.id,
              !client.isActive
            )}
            onSubmit={(e) => {
              if (!confirmOpen) {
                e.preventDefault();
                setConfirmOpen(true);
              }
            }}
          >
            <button
              type="submit"
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              {client.isActive ? "Desactivar" : "Activar"}
            </button>
          </form>

          <Link
            href="/clientes"
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Volver
          </Link>
        </div>
      </div>

      {/* MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-lg font-semibold">
              {client.isActive
                ? "Desactivar cliente"
                : "Activar cliente"}
            </h2>

            <p className="mb-6 text-sm text-gray-600">
              {client.isActive
                ? `¿Deseas desactivar a ${full}? El cliente quedará inactivo pero no se eliminará.`
                : `¿Deseas activar a ${full}? Volverá a estar disponible.`}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>

              {/* FORM CONFIRMACIÓN */}
              <form
                action={async () => {
                  setConfirmOpen(false);
                  await toggleClientStatusAction(
                    client.id,
                    !client.isActive
                  );
                }}
              >
                <button
                  type="submit"
                  className={`rounded-lg px-4 py-2 text-white ${
                    client.isActive
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {client.isActive ? "Desactivar" : "Activar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}