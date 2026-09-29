// src/app/(dashboard)/clientes/[id]/page.tsx

import { getClientById } from "../_services/clients-service";
import { EmptyState } from "../_components/empty-state";
import { ClientHeaderCard } from "../_components/client-header-card";
import { ClientTabs } from "../_components/client-tabs";

export default async function ClienteDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    return (
      <section className="rounded-2xl border border-rose-100 bg-white p-4 md:p-5 shadow-sm">
        <EmptyState
          title="Cliente no encontrado"
          description="Verifica el ID o vuelve al listado."
          actionHref="/clientes"
          actionLabel="Volver a clientes"
          secondaryHref="/clientes/nuevo"
          secondaryLabel="Nuevo cliente"
        />
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 md:p-5 shadow-sm">
      <div className="space-y-4">
        <ClientHeaderCard client={client} />
        <ClientTabs client={client} />
      </div>
    </section>
  );
}