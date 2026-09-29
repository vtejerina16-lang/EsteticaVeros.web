// src/app/(dashboard)/usuarios/nuevo/new-user-form.tsx

"use client";

import { useActionState } from "react";
import { createUserAction } from "../_actions/users-actions";
import type { CreateUserActionState } from "../_types.users";

const initialState: CreateUserActionState = { ok: false, message: "" };

export function NewUserForm() {
  const [state, formAction, pending] = useActionState(createUserAction, initialState);
  const fieldError = (field: keyof NonNullable<typeof state.errors>) => state.errors?.[field];
  const inputClass = (field: keyof NonNullable<typeof state.errors>) =>
    `w-full rounded-full border ${fieldError(field) ? "border-red-400" : "border-rose-200"} bg-rose-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200`;

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">Nombres *</label>
          <input
            name="firstName"
            className={inputClass("firstName")}
            placeholder="Juan"
            aria-invalid={!!fieldError("firstName")}
            aria-describedby={fieldError("firstName") ? "firstName-error" : undefined}
            required
          />
          {fieldError("firstName") && <p id="firstName-error" className="text-xs text-red-600">{fieldError("firstName")}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">Apellidos *</label>
          <input
            name="lastName"
            className={inputClass("lastName")}
            placeholder="Pérez"
            aria-invalid={!!fieldError("lastName")}
            aria-describedby={fieldError("lastName") ? "lastName-error" : undefined}
            required
          />
          {fieldError("lastName") && <p id="lastName-error" className="text-xs text-red-600">{fieldError("lastName")}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">Email *</label>
          <input
            name="email"
            type="email"
            className={inputClass("email")}
            placeholder="juan.perez@ejemplo.com"
            aria-invalid={!!fieldError("email")}
            aria-describedby={fieldError("email") ? "email-error" : undefined}
            required
          />
          {fieldError("email") && <p id="email-error" className="text-xs text-red-600">{fieldError("email")}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">Teléfono *</label>
          <input
            name="phoneNumber"
            className={inputClass("phoneNumber")}
            placeholder="12345678"
            aria-invalid={!!fieldError("phoneNumber")}
            aria-describedby={fieldError("phoneNumber") ? "phoneNumber-error" : undefined}
            required
          />
          {fieldError("phoneNumber") && <p id="phoneNumber-error" className="text-xs text-red-600">{fieldError("phoneNumber")}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">Rol *</label>
          <select
            name="roleName"
            className={`${inputClass("roleName")} bg-white text-neutral-800`}
            aria-invalid={!!fieldError("roleName")}
            aria-describedby={fieldError("roleName") ? "roleName-error" : undefined}
            required
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona un rol
            </option>
            <option value="Administrator">Administrador</option>
            <option value="Manager">Encargado</option>
            <option value="Assistant">Asistente</option>
          </select>
          {fieldError("roleName") && <p id="roleName-error" className="text-xs text-red-600">{fieldError("roleName")}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">Contraseña *</label>
          <input
            name="password"
            type="password"
            className={inputClass("password")}
            placeholder="Password123!"
            minLength={8}
            aria-invalid={!!fieldError("password")}
            aria-describedby={`password-help${fieldError("password") ? " password-error" : ""}`}
            required
          />
          <p id="password-help" className="text-xs text-neutral-500">
            Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
          </p>
          {fieldError("password") && <p id="password-error" className="text-xs text-red-600">{fieldError("password")}</p>}
        </div>
      </div>

      {!state.ok && state.message ? <p className="text-sm text-rose-700">{state.message}</p> : null}

      <div className="flex justify-end gap-2 pt-2">
        <a
          href="/usuarios"
          className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-rose-50"
        >
          Cancelar
        </a>

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[rgb(var(--brand))] px-5 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
        >
          {pending ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}