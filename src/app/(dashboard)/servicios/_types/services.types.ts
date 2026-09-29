import { ServiceCategoryOption } from "../_constants/services-categories";
import type { PricingType, ServiceType } from "../_constants/services-enums";

// Extraemos el tipo del id directamente de las opciones de categoría
export type ServiceCategoryId = ServiceCategoryOption["id"];

export type ServiceComponent = {
  serviceId: string;
  quantity: number;
  order: number;
};

export type Service = {
  id: string;
  name: string;

  categoryId: ServiceCategoryId;
  subcategoryId?: number | null;

  type: ServiceType;
  pricingType: PricingType;

  price?: number | null;     // fixed
  priceFrom?: number | null; // from/range
  priceTo?: number | null;   // range

  durationMinutes?: number | null;
  notes?: string | null;
  isActive: boolean;

  components?: ServiceComponent[];
};

export type ListServicesInput = {
  search?: string;
  category?: string; // "all" | "1".."9"
  type?: string;     // "all" | "simple" | "composite" | "package"
  status?: string;   // "all" | "active" | "inactive"
  page: number;
  perPage: number;
};

export type ListServicesResult = {
  items: Service[];
  totalCount: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export type ServicePickerItem = Pick<
  Service,
  "id" | "name" | "categoryId" | "type" | "isActive"
>;

export type UpsertServiceInput = Omit<Service, "components"> & {
  components?: ServiceComponent[];
};