import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { CategoryForm } from "../../_components/categories/category-form";

export default async function NuevaCategoriaServicioPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 md:p-5 shadow-sm">
      <p className="text-xs font-semibold text-rose-600">Alta</p>
      <h1 className="text-xl font-extrabold text-neutral-900">Nueva Categoría</h1>
      <CategoryForm />
    </section>
  );
}