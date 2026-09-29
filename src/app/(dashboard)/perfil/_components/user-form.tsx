"use client";

import { useState, useEffect } from "react";
import type { ProfileVM } from "../_types/profile-types";

export function UserForm({ vm, action }: { vm: ProfileVM; action: string }) {
  const [flash, setFlash] = useState<string | null>(null);

  return (
    <form action={action} method="post" className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-1">
        <label>Nombre</label>
        <input name="firstName" defaultValue={vm.firstName} className="input" />
      </div>
      <div className="space-y-1">
        <label>Apellido</label>
        <input name="lastName" defaultValue={vm.lastName} className="input" />
      </div>
      <div className="space-y-1">
        <label>Teléfono</label>
        <input name="phoneNumber" defaultValue={vm.phoneNumber ?? ""} className="input" />
      </div>
      <div className="space-y-1">
        <label>Fecha de nacimiento</label>
        <input type="date" name="dateOfBirth" defaultValue={vm.dateOfBirth ?? ""} className="input" />
      </div>
      <div className="md:col-span-2 flex justify-between items-center">
        <div>
          Estado: {vm.isActive ? "Activo" : "Inactivo"} · Rol: {vm.roleName ?? "—"}
        </div>
        <button type="submit" className="btn-primary">
          Guardar cambios
        </button>
      </div>
      {flash && <p className="col-span-2 text-rose-700">{flash}</p>}
    </form>
  );
}