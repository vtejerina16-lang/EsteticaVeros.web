import Link from "next/link";
import { redirect } from "next/navigation";

import { getAccessToken } from "@/lib/auth";
import { listServices } from "./_services/services-service";
import { listServiceCategories } from "./_services/service-categories-service";

import { ServicesFilters } from "./_components/services-filters";
import { ServicesPagination } from "./_components/services-pagination";
import { ServicesTable } from "./_components/services-table";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const pickOne = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ServiciosPage({ searchParams }: { searchParams: Promise<SP> }) {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const sp = await searchParams;

  const search = pickOne(sp.search) ?? "";
  const category = pickOne(sp.category) ?? "all";
  const type = pickOne(sp.type) ?? "all";
  const status = pickOne(sp.status) ?? "all";

  const page = Math.max(1, Number(pickOne(sp.page) ?? 1) || 1);
  const perPage = Math.max(1, Number(pickOne(sp.per_page) ?? 10) || 10);

  const [servicesRes, catsRes] = await Promise.all([
    listServices({ search, category, type, status, page, perPage }),
    listServiceCategories({ token }),
  ]);

  const categories = catsRes.categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 md:p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-rose-600">Catálogo</p>
          <h1 className="text-xl font-extrabold text-neutral-900">Servicios</h1>
          <p className="mt-1 text-sm text-neutral-600">Gestiona servicios, paquetes y sus categorías.</p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/servicios/categorias"
            className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-rose-50"
          >
            Categorías
          </Link>

          <Link
            href="/servicios/nuevo"
            className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            + Nuevo
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4">
        <ServicesFilters
          categories={categories}
          initialSearch={search}
          initialCategory={category}
          initialType={type}
          initialStatus={status}
          perPage={perPage}
        />
      </div>

      {/* Table */}
      <div className="mt-4">
        <ServicesTable categories={categories} items={servicesRes.items} />
      </div>

      <ServicesPagination
        page={servicesRes.page}
        totalPages={servicesRes.totalPages}
        perPage={perPage}
        totalCount={servicesRes.totalCount}
      />
    </section>
  );
}