import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { getServiceCategoryById } from "../../../_services/service-categories-service";
import { CategoryForm } from "../../../_components/categories/category-form";

export default async function EditarCategoriaServicioPage({ params }: { params: Promise<{ id: string }> }) {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const { id } = await params;
  const categoryId = Number(id);
  if (!Number.isFinite(categoryId)) redirect("/servicios/categorias");

  const c = await getServiceCategoryById({ token, categoryId });

  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 md:p-5 shadow-sm">
      <p className="text-xs font-semibold text-rose-600">Edición</p>
      <h1 className="text-xl font-extrabold text-neutral-900">Editar Categoría</h1>
      <CategoryForm initial={c} />
    </section>
  );
}