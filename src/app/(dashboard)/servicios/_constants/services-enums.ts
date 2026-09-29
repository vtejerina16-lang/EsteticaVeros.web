export const SERVICE_TYPES = ["simple", "composite", "package"] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number];

export const PRICING_TYPES = ["fixed", "from", "range"] as const;
export type PricingType = (typeof PRICING_TYPES)[number];

export const statusLabel = (isActive: boolean) => (isActive ? "Activo" : "Inactivo");

export const typeLabel = (t: ServiceType) =>
  t === "simple" ? "Simple" : t === "composite" ? "Compuesto" : "Paquete";

export const pricingLabel = (p: PricingType) =>
  p === "fixed" ? "Fijo" : p === "from" ? "Desde" : "Rango";