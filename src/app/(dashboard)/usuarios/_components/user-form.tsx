"use client";

import { useActionState } from "react";
import { createUserAction } from "../_actions/users-actions";
import type { CreateUserActionState } from "../_types.users";

const initialState: CreateUserActionState = {
  ok: false,
  message: "",
};

export function UserForm() {
  const [state, action, pending] = useActionState(createUserAction, initialState);

  return (
    <form action={action} className="space-y-4 rounded-xl border border-rose-100 p-6">
      <h3 className="text-lg font-semibold text-neutral-800">
        Crear usuario
      </h3>

      {/* EMAIL */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Correo electrónico</label>
        <input
          name="email"
          type="email"
          placeholder="usuario@correo.com"
          className="w-full rounded-md border px-3 py-2"
          required
        />
      </div>

      {/* PASSWORD */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Contraseña</label>
        <input
          name="password"
          type="password"
          placeholder="Ingrese una contraseña"
          className="w-full rounded-md border px-3 py-2"
          required
        />
      </div>

      {/* NOMBRE */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Nombre</label>
        <input
          name="firstName"
          placeholder="Ingrese el nombre"
          className="w-full rounded-md border px-3 py-2"
          required
        />
      </div>

      {/* APELLIDO */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Apellido</label>
        <input
          name="lastName"
          placeholder="Ingrese el apellido"
          className="w-full rounded-md border px-3 py-2"
          required
        />
      </div>

      {/* TELEFONO */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Teléfono</label>
        <input
          name="phoneNumber"
          placeholder="Ej: 70000000"
          className="w-full rounded-md border px-3 py-2"
          required
        />
      </div>

      {/* ROL */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Rol del usuario</label>
        <select
  name="roleName"
  className="w-full rounded-md border px-3 py-2"
  required
>
  <option value="">Seleccione un rol</option>
  <option value="Administrator">Administrador</option>
  <option value="Manager">Encargado</option>
  <option value="Assistant">Asistente</option>
</select>
      </div>

      {/* MENSAJE */}
      {state.message && (
        <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}>
          {state.message}
        </p>
      )}

      {/* BOTON */}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-[rgb(var(--brand))] px-4 py-2 font-medium text-white disabled:opacity-60"
      >
        {pending ? "Registrando..." : "Registrar usuario"}
      </button>
    </form>
  );
}