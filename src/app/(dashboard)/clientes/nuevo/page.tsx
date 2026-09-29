// src/app/(dashboard)/clientes/nuevo/page.tsx

import { ClientForm } from "../_components/client-form";

export default function NuevoClientePage() {
  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 md:p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold text-rose-600">Alta</p>
        <h1 className="text-xl font-extrabold text-neutral-900">Nuevo Cliente</h1>
      </div>

      <div className="mt-5">
        <ClientForm mode="create" initial={{ isActive: true, allergies: "Ninguna", medicalConditions: "Ninguna", medications: "Ninguna" }} />
      </div>
    </section>
  );
}