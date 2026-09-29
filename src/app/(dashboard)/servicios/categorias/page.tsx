import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { listServiceCategories } from "../_services/service-categories-service";
import { CategoriesTable } from "../_components/categories/categories-table";

export const dynamic = "force-dynamic";

export default async function CategoriasServiciosPage() {
  const token = await getAccessToken();
if (!token) redirect("/login");

const res = await listServiceCategories({ token });

  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 md:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-rose-600">Catálogo</p>
          <h1 className="text-xl font-extrabold text-neutral-900">Categorías de Servicios</h1>
          <p className="mt-1 text-sm text-neutral-600">Cabello, Tintes, Uñas… y las que agregues.</p>
        </div>

        <Link
          href="/servicios/categorias/nuevo"
          className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          + Nueva
        </Link>
      </div>

      <div className="mt-4">
        <CategoriesTable items={res.categories} />
      </div>
    </section>
  );
}