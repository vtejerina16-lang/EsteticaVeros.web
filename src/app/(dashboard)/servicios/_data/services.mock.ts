import "server-only";

import type { ListServicesInput, ListServicesResult, Service, ServicePickerItem, UpsertServiceInput } from "../_types/services.types";

function id(n: number) {
  return `srv_${String(n).padStart(3, "0")}`;
}

let services: Service[] = [
  // ===== CABELO (1)
  { id: id(1), name: "Lavado", categoryId: 1, type: "simple", pricingType: "fixed", price: 20, isActive: true },
  { id: id(2), name: "Secado", categoryId: 1, type: "simple", pricingType: "fixed", price: 20, isActive: true },
  { id: id(3), name: "Cepillado", categoryId: 1, type: "simple", pricingType: "fixed", price: 50, isActive: true },
  { id: id(4), name: "Planchado", categoryId: 1, type: "simple", pricingType: "fixed", price: 50, isActive: true },

  { id: id(5), name: "Corte básico (solo corte)", categoryId: 1, type: "simple", pricingType: "fixed", price: 30, isActive: true },

  {
    id: id(6),
    name: "Corte premium (incluye lavado+secado+cepillado)",
    categoryId: 1,
    type: "composite",
    pricingType: "fixed",
    price: 50,
    isActive: true,
    components: [
      { serviceId: id(5), quantity: 1, order: 1 },
      { serviceId: id(1), quantity: 1, order: 2 },
      { serviceId: id(2), quantity: 1, order: 3 },
      { serviceId: id(3), quantity: 1, order: 4 },
    ],
  },

  { id: id(7), name: "Cepillado básico", categoryId: 1, type: "simple", pricingType: "fixed", price: 50, isActive: true },
  {
    id: id(8),
    name: "Cepillado premium (incluye lavado+secado+cepillado)",
    categoryId: 1,
    type: "composite",
    pricingType: "fixed",
    price: 80,
    isActive: true,
    components: [
      { serviceId: id(1), quantity: 1, order: 1 },
      { serviceId: id(2), quantity: 1, order: 2 },
      { serviceId: id(3), quantity: 1, order: 3 },
    ],
  },

  { id: id(9), name: "Peinado básico / planchado", categoryId: 1, type: "simple", pricingType: "fixed", price: 50, isActive: true },
  { id: id(10), name: "Peinado + planchado", categoryId: 1, type: "simple", pricingType: "fixed", price: 70, isActive: true },
  { id: id(11), name: "Peinado novia / quinceañera", categoryId: 1, type: "simple", pricingType: "fixed", price: 150, isActive: true },

  {
    id: id(12),
    name: "Paquete peinado (lavado+cepillado+planchado)",
    categoryId: 1,
    type: "composite",
    pricingType: "fixed",
    price: 200,
    isActive: true,
    components: [
      { serviceId: id(1), quantity: 1, order: 1 },
      { serviceId: id(3), quantity: 1, order: 2 },
      { serviceId: id(4), quantity: 1, order: 3 },
    ],
  },

  { id: id(13), name: "Baño de crema básico", categoryId: 1, type: "simple", pricingType: "fixed", price: 70, isActive: true, notes: "Precio variable según largo/grosor/estado." },
  { id: id(14), name: "Baño de crema incrementado + células", categoryId: 1, type: "simple", pricingType: "fixed", price: 150, isActive: true, notes: "Precio variable según largo/grosor/estado." },
  { id: id(15), name: "Baño de crema incrementado + ampolla", categoryId: 1, type: "simple", pricingType: "fixed", price: 180, isActive: true, notes: "Precio variable según largo/grosor/estado." },
  { id: id(16), name: "Baño de crema personalizado", categoryId: 1, type: "simple", pricingType: "from", priceFrom: 100, isActive: true, notes: "Desde; según cremas/ampollas y largo." },

  { id: id(17), name: "Base permanente", categoryId: 1, type: "simple", pricingType: "fixed", price: 100, isActive: true, notes: "Precio variable según largo/estado." },

  // ===== COLOR (2)
  { id: id(20), name: "Retoque raíces", categoryId: 2, type: "simple", pricingType: "from", priceFrom: 100, isActive: true, notes: "Desde; según largo/grosor y producto." },
  { id: id(21), name: "Tinte completo", categoryId: 2, type: "simple", pricingType: "from", priceFrom: 180, isActive: true, notes: "Desde; según largo/grosor y producto." },
  { id: id(22), name: "Rayitos (gorra)", categoryId: 2, type: "simple", pricingType: "from", priceFrom: 250, isActive: true, notes: "Desde; según técnica y largo." },
  { id: id(23), name: "Mechas (gorro o aluminio)", categoryId: 2, type: "simple", pricingType: "range", priceFrom: 280, priceTo: 400, isActive: true, notes: "Rango; según largo y técnica." },
  { id: id(24), name: "Balayage", categoryId: 2, type: "simple", pricingType: "from", priceFrom: 400, isActive: true, notes: "Desde; según largo/técnica." },

  // ===== ROSTRO (3)
  { id: id(30), name: "Limpieza de cutis básica", categoryId: 3, type: "simple", pricingType: "fixed", price: 50, isActive: true },
  { id: id(31), name: "Perfilado + henna (cejas)", categoryId: 3, type: "simple", pricingType: "fixed", price: 50, isActive: true },

  // ===== MAQUILLAJE (4)
  { id: id(40), name: "Maquillaje normal", categoryId: 4, type: "simple", pricingType: "fixed", price: 50, isActive: true },
  { id: id(41), name: "Maquillaje especial", categoryId: 4, type: "simple", pricingType: "fixed", price: 70, isActive: true },
  { id: id(42), name: "Maquillaje novia / quinceañera", categoryId: 4, type: "simple", pricingType: "fixed", price: 150, isActive: true },

  // ===== DEPILACIÓN (5)
  { id: id(50), name: "Depilación cuerpo completo", categoryId: 5, type: "simple", pricingType: "from", priceFrom: 400, isActive: true, notes: "Desde; según material y zonas." },
  { id: id(51), name: "Depilación rostro", categoryId: 5, type: "simple", pricingType: "from", priceFrom: 60, isActive: true, notes: "Desde; según zona." },
  { id: id(52), name: "Depilación axilas", categoryId: 5, type: "simple", pricingType: "fixed", price: 30, isActive: true },
  { id: id(53), name: "Depilación brazos", categoryId: 5, type: "simple", pricingType: "from", priceFrom: 100, isActive: true, notes: "Desde; según material." },
  { id: id(54), name: "Depilación media pierna", categoryId: 5, type: "simple", pricingType: "fixed", price: 100, isActive: true },
  { id: id(55), name: "Depilación pierna completa", categoryId: 5, type: "simple", pricingType: "fixed", price: 150, isActive: true },
  { id: id(56), name: "Depilación bikini", categoryId: 5, type: "simple", pricingType: "from", priceFrom: 50, isActive: true, notes: "Desde; según material." },

  // ===== UÑAS (6)
  { id: id(60), name: "Manicure base", categoryId: 6, type: "simple", pricingType: "fixed", price: 40, isActive: true },
  { id: id(61), name: "Manicure con pintado personalizado", categoryId: 6, type: "simple", pricingType: "fixed", price: 60, isActive: true },
  { id: id(62), name: "Pedicura base", categoryId: 6, type: "simple", pricingType: "fixed", price: 50, isActive: true },
  { id: id(63), name: "Pedicura con sacado de uñero", categoryId: 6, type: "simple", pricingType: "fixed", price: 70, isActive: true },
  { id: id(64), name: "Combo Mani + Pedi básico", categoryId: 6, type: "composite", pricingType: "fixed", price: 100, isActive: true, components: [
    { serviceId: id(60), quantity: 1, order: 1 },
    { serviceId: id(62), quantity: 1, order: 2 },
  ] },

  { id: id(65), name: "Pintado sencillo / retoque", categoryId: 6, type: "simple", pricingType: "fixed", price: 30, isActive: true },
  { id: id(66), name: "Pintado tradicional con piedras/complementos", categoryId: 6, type: "simple", pricingType: "fixed", price: 30, isActive: true },
  { id: id(67), name: "Gel semipermanente", categoryId: 6, type: "simple", pricingType: "fixed", price: 50, isActive: true },
  { id: id(68), name: "Gel semipermanente complementado", categoryId: 6, type: "simple", pricingType: "fixed", price: 70, isActive: true },
  { id: id(69), name: "Uñas acrílicas con tip", categoryId: 6, type: "simple", pricingType: "from", priceFrom: 150, isActive: true },
  { id: id(70), name: "Uñas acrílicas esculpidas", categoryId: 6, type: "simple", pricingType: "from", priceFrom: 170, isActive: true },
  { id: id(71), name: "Soft gel", categoryId: 6, type: "simple", pricingType: "from", priceFrom: 70, isActive: true },
  { id: id(72), name: "Tratamiento de hongos", categoryId: 6, type: "simple", pricingType: "fixed", price: 100, isActive: true },

  // ===== PESTAÑAS (7)
  { id: id(80), name: "Pestañas pelo a pelo", categoryId: 7, type: "simple", pricingType: "from", priceFrom: 100, isActive: true },
  { id: id(81), name: "Lifting de pestañas", categoryId: 7, type: "simple", pricingType: "from", priceFrom: 70, isActive: true },
  { id: id(82), name: "Tinte de pestañas", categoryId: 7, type: "simple", pricingType: "fixed", price: 100, isActive: true },

  // ===== MASAJES (8)
  { id: id(90), name: "Masaje relajante", categoryId: 8, type: "simple", pricingType: "fixed", price: 100, isActive: true },

  // ===== PAQUETES (9) (mock; luego lo ajustas a puntos)
  {
    id: id(100),
    name: "Paquete Quinceañera (Básico)",
    categoryId: 9,
    type: "package",
    pricingType: "fixed",
    price: 432,
    isActive: true,
    components: [
      { serviceId: id(11), quantity: 1, order: 1 },
      { serviceId: id(42), quantity: 1, order: 2 },
      { serviceId: id(64), quantity: 1, order: 3 },
    ],
  },
  {
    id: id(101),
    name: "Paquete Quinceañera (Completo)",
    categoryId: 9,
    type: "package",
    pricingType: "fixed",
    price: 816,
    isActive: true,
    components: [
      { serviceId: id(12), quantity: 1, order: 1 },
      { serviceId: id(42), quantity: 1, order: 2 },
      { serviceId: id(64), quantity: 1, order: 3 },
      { serviceId: id(50), quantity: 1, order: 4 },
    ],
  },
];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function listServices(input: ListServicesInput): ListServicesResult {
  const search = normalize(input.search ?? "");
  const category = input.category ?? "all";
  const type = input.type ?? "all";
  const status = input.status ?? "all";

  let rows = services.slice();

  if (search) rows = rows.filter((x) => normalize(x.name).includes(search));

  if (category !== "all") {
    const cid = Number(category);
    rows = rows.filter((x) => x.categoryId === cid);
  }

  if (type !== "all") rows = rows.filter((x) => x.type === type);

  if (status !== "all") rows = rows.filter((x) => (status === "active" ? x.isActive : !x.isActive));

  const totalCount = rows.length;
  const perPage = input.perPage;
  const page = input.page;

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const start = (safePage - 1) * perPage;
  const items = rows.slice(start, start + perPage);

  return { items, totalCount, page: safePage, perPage, totalPages };
}

export function getServiceById(id: string): Service | null {
  return services.find((x) => x.id === id) ?? null;
}

export function listPickerServices(): ServicePickerItem[] {
  // para el picker de componentes: permitimos todo lo activo (y también inactivos si quieres cambiar)
  return services.map(({ id, name, categoryId, type, isActive }) => ({ id, name, categoryId, type, isActive }));
}

export function createService(input: UpsertServiceInput): Service {
  const newId = `srv_${Math.random().toString(16).slice(2, 10)}`;
  const created: Service = {
    ...input,
    id: newId,
    isActive: input.isActive ?? true,
    components: input.components?.slice().sort((a, b) => a.order - b.order),
  };
  services = [created, ...services];
  return created;
}

export function updateService(id: string, input: UpsertServiceInput): Service | null {
  const idx = services.findIndex((x) => x.id === id);
  if (idx === -1) return null;

  const next: Service = {
    ...services[idx],
    ...input,
    id,
    components: input.components?.slice().sort((a, b) => a.order - b.order),
  };

  services = services.map((x, i) => (i === idx ? next : x));
  return next;
}

export function toggleServiceActive(id: string): Service | null {
  const s = getServiceById(id);
  if (!s) return null;
  return updateService(id, { ...s, isActive: !s.isActive });
}

export function deleteService(id: string): boolean {
  const before = services.length;
  services = services.filter((x) => x.id !== id && !(x.components ?? []).some((c) => c.serviceId === id));
  return services.length !== before;
}