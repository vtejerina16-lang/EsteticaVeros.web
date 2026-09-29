"use client";

import { useActionState } from "react";
import { updateProfileAction } from "../_actions/profile-actions";
import { updateProfileInitialState } from "../_actions/profile-actions-types";
import type { ProfileVM } from "../_types/profile-types";

export function ProfileForm({ vm }: { vm: ProfileVM }) {
  // Conectamos la Server Action con el estado del formulario
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    updateProfileInitialState
  );

  // Clase base para los inputs para mantener consistencia visual
  const inputClass = "w-full border border-neutral-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all";

  return (
    <form action={formAction} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Nombre */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-neutral-800">Nombre</label>
          <input
            name="firstName"
            defaultValue={vm.firstName ?? ""} 
            placeholder="Tu nombre"
            className={`${inputClass} ${state.fieldErrors?.firstName ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          />
          {state.fieldErrors?.firstName && (
            <p className="text-xs text-red-500 font-medium">{state.fieldErrors.firstName}</p>
          )}
        </div>

        {/* Apellido */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-neutral-800">Apellido</label>
          <input
            name="lastName"
            defaultValue={vm.lastName ?? ""}
            placeholder="Tu apellido"
            className={`${inputClass} ${state.fieldErrors?.lastName ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          />
          {state.fieldErrors?.lastName && (
            <p className="text-xs text-red-500 font-medium">{state.fieldErrors.lastName}</p>
          )}
        </div>

        {/* Teléfono */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-neutral-800">Teléfono</label>
          <input
            name="phoneNumber"
            type="tel"
            defaultValue={vm.phoneNumber ?? ""} 
            placeholder="Ej: 71234567"
            className={inputClass}
          />
        </div>

        {/* Fecha de nacimiento */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-neutral-800">Fecha de nacimiento</label>
          <input
            type="date"
            name="dateOfBirth"
            defaultValue={vm.dateOfBirth ?? ""}
            className={inputClass}
          />
        </div>

        {/* Dirección */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-semibold text-neutral-800">Dirección</label>
          <input
            name="address"
            defaultValue={vm.address ?? ""}
            placeholder="Av. Las Américas #123"
            className={inputClass}
          />
        </div>
      </div>

      {/* Mensajes de feedback (Éxito o Error general) */}
      {state.message && (
        <div className={`p-3 rounded-lg text-sm font-semibold animate-in fade-in slide-in-from-top-1 ${
          state.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {state.message}
        </div>
      )}

      {/* Footer del Formulario */}
      <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
        <div className="text-sm text-neutral-600 italic">
          Estado: <span className="font-bold text-neutral-800">{vm.isActive ? "Activo" : "Inactivo"}</span> 
          <span className="mx-2">·</span> 
          Rol: <span className="font-bold text-neutral-800">{vm.roleName ?? "Usuario"}</span> {/* CORRECCIÓN: vm.roleName */}
        </div>
        
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-rose-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Guardando...
            </span>
          ) : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}