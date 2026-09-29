import type { UpsertServiceInput } from "./services.types";

export type ValidationError = { field: string; message: string };

export function validateUpsertService(input: UpsertServiceInput): ValidationError[] {
  const errs: ValidationError[] = [];

  if (!input.name?.trim()) errs.push({ field: "name", message: "El nombre es obligatorio." });
  if (!input.categoryId) errs.push({ field: "categoryId", message: "Categoría inválida." });

  if (input.pricingType === "fixed") {
    if (input.price == null || input.price < 0) errs.push({ field: "price", message: "Precio fijo inválido." });
  }
  if (input.pricingType === "from") {
    if (input.priceFrom == null || input.priceFrom < 0)
      errs.push({ field: "priceFrom", message: "Precio 'desde' inválido." });
  }
  if (input.pricingType === "range") {
    if (input.priceFrom == null || input.priceTo == null || input.priceFrom < 0 || input.priceTo < 0 || input.priceFrom > input.priceTo) {
      errs.push({ field: "priceFrom/priceTo", message: "Rango inválido (desde/hasta)." });
    }
  }

  if ((input.type === "composite" || input.type === "package") && (input.components?.length ?? 0) === 0) {
    errs.push({ field: "components", message: "Selecciona al menos 1 componente." });
  }

  return errs;
}