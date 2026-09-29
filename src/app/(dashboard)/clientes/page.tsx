// src/app/(dashboard)/clientes/page.tsx

import { ClientsFilters } from "./_components/clients-filters";
import { ClientsTable } from "./_components/clients-table";
import { listClients } from "./_services/clients-service";
import type { ClientStatusFilter } from "./_types.clients";

function pickOne(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ClientesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};

  const search = pickOne(sp.search) ?? "";
  const status = (pickOne(sp.status) as ClientStatusFilter) ?? "all";

  const page = Number(pickOne(sp.page) ?? "1") || 1;
  const pageSize = Number(pickOne(sp.pageSize) ?? "10") || 10;

  const data = await listClients({ search, status, page, pageSize });

  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 md:p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold text-rose-600">Módulo</p>
        <h1 className="text-xl font-extrabold text-neutral-900">Clientes</h1>
      </div>

      <div className="mt-5 space-y-4">
        <ClientsFilters initialSearch={search} initialStatus={status} />
        <ClientsTable data={data} query={{ search, status, page: data.page, pageSize: data.pageSize }} />
      </div>
    </section>
  );
}