"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deactivateUserAction, updateUserAction } from "../_actions/users-actions";
import type { UserRow } from "../_adapters/user-adapter";
import type { RoleName } from "../_types.users";

function splitName(fullName: string) {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0]!, lastName: "" };

  return { firstName: parts[0]!, lastName: parts.slice(1).join(" ") };
}

function normalizeRoleToApi(role: string): RoleName {
  const r = (role ?? "").trim().toLowerCase();

  if (r.includes("admin")) return "Administrator";
  if (r.includes("manager") || r.includes("recepcion")) return "Manager";
  if (r.includes("assistant") || r.includes("asistente")) return "Assistant";

  return "Assistant";
}

function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  if (value.includes("T")) return value.split("T")[0] ?? "";
  return value.trim();
}

function normalizeDateToApi(dateInput: string): string | null {
  const v = (dateInput ?? "").trim();
  return v ? v : null;
}

export function UserActions({ user }: { user: UserRow }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const [open, setOpen] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const initial = useMemo(() => splitName(user.fullName), [user.fullName]);

  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [roleName, setRoleName] = useState<RoleName>(normalizeRoleToApi(user.roleName));
  const [isActive, setIsActive] = useState(!!user.isActive);
  const [dateOfBirth, setDateOfBirth] = useState<string>(toDateInputValue(user.dateOfBirth));

  const openEdit = () => {
    const n = splitName(user.fullName);

    setFirstName(n.firstName);
    setLastName(n.lastName);
    setRoleName(normalizeRoleToApi(user.roleName));
    setIsActive(!!user.isActive);
    setDateOfBirth(toDateInputValue(user.dateOfBirth));

    setError(null);
    setOpen(true);
  };

  const onDeactivate = () => {
    setConfirmDeactivate(true);
  };

  const confirmDeactivateUser = () => {
    start(async () => {
      const res = await deactivateUserAction(user.id);

      if (!res.ok) {
        alert(res.message);
        return;
      }

      setConfirmDeactivate(false);
      router.refresh();
    });
  };

  const onSave = () => {
    setError(null);

    if (firstName.trim().length < 2)
      return setError("El nombre debe tener al menos 2 caracteres.");

    if (lastName.trim().length < 2)
      return setError("El apellido debe tener al menos 2 caracteres.");

    start(async () => {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        roleName,
        isActive,
        phoneNumber: null,
        address: null,
        dateOfBirth: normalizeDateToApi(dateOfBirth),
      };

      const res = await updateUserAction(user.id, payload);

      if (!res.ok) {
        setError(res.message);
        return;
      }

      setOpen(false);
      router.refresh();
    });
  };

  return (
    <div className="flex justify-end gap-2">

      <button
        className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-rose-50 disabled:opacity-60"
        disabled={pending}
        onClick={openEdit}
      >
        Editar
      </button>

      <button
        className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
        disabled={pending}
        onClick={onDeactivate}
      >
        Desactivar
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-rose-100 bg-white p-4 shadow-xl">

            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold text-neutral-900">
                  Editar usuario
                </div>

                <div className="text-xs text-neutral-500">
                  {user.email} · ID {user.id}
                </div>
              </div>

              <button
                className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold hover:bg-rose-50 disabled:opacity-60"
                onClick={() => setOpen(false)}
                disabled={pending}
              >
                Cerrar
              </button>
            </div>

            {error && (
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">

              <label className="text-xs font-semibold text-neutral-700">
                Nombre
                <input
                  className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={pending}
                />
              </label>

              <label className="text-xs font-semibold text-neutral-700">
                Apellido
                <input
                  className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={pending}
                />
              </label>

              <label className="text-xs font-semibold text-neutral-700 md:col-span-2">
                Rol
                <select
                  className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value as RoleName)}
                  disabled={pending}
                >
                  <option value="Administrator">Administrador</option>
                  <option value="Manager">Encargado</option>
                  <option value="Assistant">Asistente</option>
                </select>
              </label>

              <label className="text-xs font-semibold text-neutral-700 md:col-span-2">
                Fecha de nacimiento
                <input
                  type="date"
                  className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={pending}
                />
              </label>

              <label className="flex items-center gap-2 pt-2 text-xs font-semibold text-neutral-700 md:col-span-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={pending}
                />
                Usuario activo
              </label>

            </div>

            <div className="mt-4 flex justify-end gap-2">

              <button
                className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-rose-50"
                onClick={() => setOpen(false)}
                disabled={pending}
              >
                Cancelar
              </button>

              <button
                className="rounded-full bg-[rgb(var(--brand))] px-4 py-2 text-sm font-semibold text-white"
                onClick={onSave}
                disabled={pending}
              >
                Guardar cambios
              </button>

            </div>
          </div>
        </div>
      )}
      {confirmDeactivate && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-5 shadow-xl">

            <div className="text-sm font-bold text-neutral-900">
              Confirmar desactivación
            </div>

            <div className="mt-2 text-sm text-neutral-600">
              ¿Está seguro de desactivar este usuario?
            </div>

            <div className="mt-3 text-xs text-neutral-500">
              Usuario: {user.email} <br />
            </div>

            <div className="mt-5 flex justify-end gap-2">

              <button
                className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold hover:bg-rose-50"
                onClick={() => setConfirmDeactivate(false)}
                disabled={pending}
              >
                Cancelar
              </button>

              <button
                className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                onClick={confirmDeactivateUser}
                disabled={pending}
              >
                Sí, desactivar
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}