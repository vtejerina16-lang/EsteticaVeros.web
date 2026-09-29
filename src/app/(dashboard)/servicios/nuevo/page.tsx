import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { ServiceForm } from "../_components/service-form/service-form";
import { listPickerServices } from "../_services/services-service";
import { listServiceCategories } from "../_services/service-categories-service";

export const dynamic = "force-dynamic";

export default async function NuevoServicioPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const [catsRes, pickerItems] = await Promise.all([
    listServiceCategories({ token }),
    listPickerServices(),
  ]);

  const categories = catsRes.categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 md:p-5 shadow-sm">
      <p className="text-xs font-semibold text-rose-600">Alta</p>
      <h1 className="text-xl font-extrabold text-neutral-900">Nuevo Servicio</h1>

      <div className="mt-5">
        <ServiceForm pickerItems={pickerItems} categories={categories} />
      </div>
    </section>
  );
}