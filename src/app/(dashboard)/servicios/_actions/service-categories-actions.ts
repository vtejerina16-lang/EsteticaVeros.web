"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import {
  createServiceCategory,
  deleteServiceCategory,
  getServiceCategoryById,
  listServiceCategories,
  updateServiceCategory,
} from "../_services/service-categories-service";

type ActionState = { ok: boolean; message?: string };

const num = (v: FormDataEntryValue | null, fallback = 0) => {
  if (v == null || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export async function upsertServiceCategoryAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const token = await getAccessToken();
  if (!token) return { ok: false, message: "Sesión expirada. Vuelve a iniciar sesión." };

  const idRaw = String(fd.get("id") ?? "").trim();
  const id = idRaw ? Number(idRaw) : null;

  const name = String(fd.get("name") ?? "").trim();
  const description = String(fd.get("description") ?? "").trim() || null;
  const requestedDisplayOrder = num(fd.get("displayOrder"), 0);
  const iconName = String(fd.get("iconName") ?? "").trim() || null;
  const colorCode = String(fd.get("colorCode") ?? "").trim() || null;

  if (!name) return { ok: false, message: "El nombre es obligatorio." };

  try {
  if (id != null) {
    const isActive = fd.get("isActive") === "on";
    await updateServiceCategory({
      token,
      input: {
        categoryId: id,
        name,
        description,
        displayOrder: requestedDisplayOrder,
        iconName,
        colorCode,
        isActive,
      },
    });
  } else {
    const { categories } = await listServiceCategories({ token });
    const nextDisplayOrder = categories.reduce(
      (highest, category) => Math.max(highest, Number(category.displayOrder) || 0),
      0,
    ) + 1;

    await createServiceCategory({
      token,
      input: { name, description, displayOrder: nextDisplayOrder, iconName, colorCode },
    });
  }
} catch (e: any) {
  return { ok: false, message: e?.message ?? "Error al guardar categoría." };
}

revalidatePath("/servicios/categorias");
redirect("/servicios/categorias");
}

export async function toggleServiceCategoryActiveAction(fd: FormData) {
  const token = await getAccessToken();
  if (!token) return;

  const id = Number(fd.get("id"));
  if (!Number.isFinite(id)) return;

  const current = await getServiceCategoryById({ token, categoryId: id });

  await updateServiceCategory({
    token,
    input: {
      categoryId: current.id,
      name: current.name,
      description: current.description ?? null,
      displayOrder: current.displayOrder,
      iconName: current.iconName ?? null,
      colorCode: current.colorCode ?? null,
      isActive: !current.isActive,
    },
  });

  revalidatePath("/servicios/categorias");
}

export async function deleteServiceCategoryAction(fd: FormData) {
  const token = await getAccessToken();
  if (!token) return;

  const id = Number(fd.get("id"));
  if (!Number.isFinite(id)) return;

  await deleteServiceCategory({ token, categoryId: id });
  revalidatePath("/servicios/categorias");
}