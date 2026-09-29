"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PricingType, ServiceType } from "../_constants/services-enums";
import type { ServiceComponent, UpsertServiceInput } from "../_types/services.types";
import {
  createService,
  deleteService,
  listServices,
  toggleServiceActive,
  updateService,
} from "../_services/services-service";

type ActionState = { ok: boolean; message?: string };

const num = (v: FormDataEntryValue | null) => {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

function normalizeServiceName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function getBasePrice(
  pricingType: PricingType,
  price: number | null,
  priceFrom: number | null,
): number {
  if (pricingType === "fixed") return price ?? 0;
  return priceFrom ?? 0;
}

function parseComponents(fd: FormData): ServiceComponent[] {
  const ids = fd.getAll("components_id").map(String);
  const qtys = fd.getAll("components_qty").map((x) => Number(x));

  const out: ServiceComponent[] = [];
  for (let i = 0; i < ids.length; i++) {
    const serviceId = ids[i];
    const quantity = Number.isFinite(qtys[i]) && qtys[i] > 0 ? qtys[i] : 1;
    out.push({ serviceId, quantity, order: i + 1 });
  }
  return out;
}

export async function upsertServiceAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const idRaw = String(fd.get("id") ?? "").trim();
  const id = idRaw ? Number(idRaw) : null;

  const name = String(fd.get("name") ?? "").trim();
  const categoryId = Number(fd.get("categoryId"));
  const type = String(fd.get("type") ?? "simple") as ServiceType;
  const pricingType = String(fd.get("pricingType") ?? "fixed") as PricingType;

  const isActive = fd.get("isActive") === "on";
  const durationMinutes = num(fd.get("durationMinutes"));
  const notesRaw = String(fd.get("notes") ?? "").trim();
  const notes = notesRaw ? notesRaw : null;

  const price = num(fd.get("price"));
  const priceFrom = num(fd.get("priceFrom"));
  const priceTo = num(fd.get("priceTo"));

  if (!name) return { ok: false, message: "El nombre es obligatorio." };

  // backend exige duration > 0
  if (!durationMinutes || durationMinutes <= 0) return { ok: false, message: "Duración debe ser mayor a 0." };

  // ✅ CORREGIDO: Todos los tipos de servicio (incluyendo 'package') deben exigir CategoryId
  if (!Number.isFinite(categoryId) || categoryId <= 0) {
    return { ok: false, message: "La categoría es obligatoria para todos los servicios y paquetes." };
  }

  // precios (backend solo BasePrice >= 0)
  if (pricingType === "fixed" && (price == null || price < 0)) return { ok: false, message: "Precio fijo inválido." };
  if (pricingType === "from" && (priceFrom == null || priceFrom < 0)) return { ok: false, message: "Precio 'desde' inválido." };
  if (pricingType === "range") {
    if (priceFrom == null || priceTo == null || priceFrom < 0 || priceTo < 0 || priceFrom > priceTo) {
      return { ok: false, message: "Rango inválido (desde/hasta)." };
    }
  }

  const components = type === "simple" ? [] : parseComponents(fd);
  if ((type === "composite" || type === "package") && components.length < 2) {
    return { ok: false, message: "Compuesto/Paquete requiere al menos 2 componentes." };
  }

  const payload: UpsertServiceInput = {
    id: id ? String(id) : "tmp",
    name,
    categoryId: categoryId, // ✅ Se pasa la categoría sin convertir en null
    type,
    pricingType,
    price: pricingType === "fixed" ? price : null,
    priceFrom: pricingType === "from" || pricingType === "range" ? priceFrom : null,
    priceTo: pricingType === "range" ? priceTo : null,
    durationMinutes,
    notes,
    isActive,
    components,
  };

  try {
    const basePrice = getBasePrice(pricingType, price, priceFrom);
    const services = await listServices({ page: 1, perPage: 10_000 });
    const duplicate = services.items.find((service) => {
      if (id && String(service.id) === String(id)) return false;

      return (
        normalizeServiceName(service.name) === normalizeServiceName(name) &&
        Number(service.price ?? service.priceFrom ?? 0) === basePrice &&
        Number(service.durationMinutes ?? 0) === Number(durationMinutes)
      );
    });

    if (duplicate) {
      return {
        ok: false,
        message: "Ya existe un servicio con el mismo nombre, coste y duración.",
      };
    }

    if (id) {
      await updateService(id, payload);
    } else {
      await createService(payload);
    }
  } catch (e: any) {
    return { ok: false, message: e?.message ?? "Error al guardar servicio." };
  }

  revalidatePath("/servicios");
  redirect("/servicios");
}

export async function toggleServiceActiveAction(fd: FormData) {
  const id = Number(fd.get("id"));
  if (!Number.isFinite(id)) return;
  await toggleServiceActive(id);
  revalidatePath("/servicios");
}

export async function deleteServiceAction(fd: FormData) {
  const id = Number(fd.get("id"));
  if (!Number.isFinite(id)) return;
  await deleteService(id);
  revalidatePath("/servicios");
}