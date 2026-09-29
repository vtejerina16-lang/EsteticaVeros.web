import type { Service } from "../_types/services.types";

// Si mañana el backend devuelve DTO distinto, adaptas aquí.
export function toService(dto: any): Service {
  return dto as Service;
}

export function toServiceDto(ui: Service): any {
  return ui;
}