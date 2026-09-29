"use client";

import { useActionState } from "react";
import type { Client, ClientFormState, ClientGender } from "../_types.clients";
import { createClientAction, updateClientAction } from "../_actions/clients-actions";

const initialState: ClientFormState = { ok: false };

type Props =
  | { mode: "create"; clientId?: never; initial?: Partial<Client> }
  | { mode: "edit"; clientId: string; initial: Client };

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs font-semibold text-rose-600">{msg}</p>;
}

export function ClientForm(props: Props) {
  const actionFn =
    props.mode === "create"
      ? createClientAction
      : updateClientAction.bind(null, props.clientId);

  const [state, formAction, pending] = useActionState(actionFn as any, initialState);

  const init = props.initial ?? {};

  const genders: { value: ClientGender | ""; label: string }[] = [
    { value: "", label: "Selecciona…" },
    { value: "Male", label: "Masculino" },
    { value: "Female", label: "Femenino" },
    { value: "Other", label: "Otro" },
    { value: "PreferNotToSay", label: "Prefiero no decir" },
  ];

  return (
    <form action={formAction} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-rose-600">
            {props.mode === "create" ? "Alta" : "Edición"}
          </p>
          <h2 className="text-lg font-extrabold text-neutral-900">
            {props.mode === "create" ? "Nuevo Cliente" : "Editar Cliente"}
          </h2>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar"}
        </button>
      </div>

      {state.message ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {state.message}
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-6">
          <label className="block text-xs font-semibold text-neutral-700">Nombre</label>
          <input
            name="firstName"
            defaultValue={init.firstName ?? ""}
            className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
          <FieldError msg={state.errors?.firstName} />
        </div>

        <div className="md:col-span-6">
          <label className="block text-xs font-semibold text-neutral-700">Apellido</label>
          <input
            name="lastName"
            defaultValue={init.lastName ?? ""}
            className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
          <FieldError msg={state.errors?.lastName} />
        </div>

        <div className="md:col-span-6">
          <label className="block text-xs font-semibold text-neutral-700">Teléfono</label>
          <input
            name="phoneNumber"
            defaultValue={init.phoneNumber ?? ""}
            className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
          <FieldError msg={state.errors?.phoneNumber} />
        </div>

        <div className="md:col-span-6">
          <label className="block text-xs font-semibold text-neutral-700">Email (opcional)</label>
          <input
            name="email"
            defaultValue={init.email ?? ""}
            className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
          <FieldError msg={state.errors?.email} />
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-neutral-700">Cumpleaños</label>
          <input
            type="date"
            name="dateOfBirth"
            defaultValue={(init.dateOfBirth as any) ?? ""}
            className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
          <FieldError msg={state.errors?.dateOfBirth} />
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-neutral-700">Género (requerido)</label>
          <select
            name="gender"
            defaultValue={(init.gender as any) ?? ""}
            className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
          >
            {genders.map((g) => (
              <option key={g.label} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
          <FieldError msg={state.errors?.gender} />
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-neutral-700">Estado</label>
          <div className="mt-2 flex items-center gap-2">
            <input
              id="isActive"
              type="checkbox"
              name="isActive"
              defaultChecked={typeof init.isActive === "boolean" ? init.isActive : true}
              className="h-4 w-4 accent-rose-600"
            />
            <label htmlFor="isActive" className="text-sm text-neutral-700">
              Activo
            </label>
          </div>
        </div>

        <div className="md:col-span-8">
          <label className="block text-xs font-semibold text-neutral-700">Dirección</label>
          <input
            name="address"
            defaultValue={init.address ?? ""}
            className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-neutral-700">Ciudad</label>
          <input
            name="city"
            defaultValue={init.city ?? ""}
            className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-neutral-700">Alergias</label>
          <input
            name="allergies"
            defaultValue={init.allergies ?? ""}
            className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-neutral-700">Condiciones médicas</label>
          <input
            name="medicalConditions"
            defaultValue={init.medicalConditions ?? ""}
            className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-neutral-700">Medicaciones</label>
          <input
            name="medications"
            defaultValue={init.medications ?? ""}
            className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
        </div>
      </div>
    </form>
  );
}