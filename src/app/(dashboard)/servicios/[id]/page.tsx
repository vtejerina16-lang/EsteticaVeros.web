import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";

import { pricingLabel, typeLabel } from "../_constants/services-enums";
import { getServiceById, listPickerServices } from "../_services/services-service";
import { listServiceCategories } from "../_services/service-categories-service";
import { categoryNameById } from "../_constants/services-categories";

export const dynamic = "force-dynamic";

export default async function ServicioDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const { id } = await params;

  const s = await getServiceById(id); // ✅ await
  if (!s) redirect("/servicios");

  const [categoryData, picker] = await Promise.all([
    listServiceCategories({ token }),
    listPickerServices(),
  ]);
  const categories = categoryData.categories.map((c) => ({ id: c.id, name: c.name }));
  const pickerArr = Array.isArray(picker) ? picker : [];

  const compNames = (s.components ?? []).map((c) => ({
    ...c,
    name: pickerArr.find((p) => p.id === c.serviceId)?.name ?? c.serviceId,
  }));

  const priceText =
    s.pricingType === "fixed"
      ? `Bs ${s.price ?? 0}`
      : s.pricingType === "from"
      ? `Desde Bs ${s.priceFrom ?? 0}`
      : `Bs ${s.priceFrom ?? 0} – ${s.priceTo ?? 0}`;

  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 md:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-rose-600">Detalle</p>
          <h1 className="text-xl font-extrabold text-neutral-900">{s.name}</h1>
          <p className="mt-1 text-sm text-neutral-600">
            {categoryNameById(categories, s.categoryId)} · {typeLabel(s.type)} ·{" "}
            {pricingLabel(s.pricingType)}
          </p>
        </div>

        <Link
          href={`/servicios/${s.id}/editar`}
          className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-rose-50"
        >
          Editar
        </Link>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-rose-100 p-4">
          <div className="text-xs font-semibold text-neutral-600">
            Precio referencial
          </div>
          <div className="mt-1 text-lg font-extrabold text-neutral-900">
            {priceText}
          </div>
          <div className="mt-2 text-xs text-neutral-600">
            Duración:{" "}
            {s.durationMinutes ? `${s.durationMinutes} min` : "—"}
          </div>
        </div>

        <div className="rounded-2xl border border-rose-100 p-4">
          <div className="text-xs font-semibold text-neutral-600">Notas</div>
          <div className="mt-1 text-sm text-neutral-800">{s.notes ?? "—"}</div>
        </div>
      </div>

      {(s.components?.length ?? 0) > 0 ? (
        <div className="mt-4 rounded-2xl border border-rose-100 p-4">
          <div className="text-sm font-semibold text-neutral-900">
            Componentes (incluye)
          </div>
          <ul className="mt-2 space-y-1 text-sm text-neutral-700">
            {compNames.map((c) => (
              <li key={c.serviceId} className="flex items-center justify-between">
                <span>{c.name}</span>
                <span className="text-xs text-neutral-600">x{c.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}