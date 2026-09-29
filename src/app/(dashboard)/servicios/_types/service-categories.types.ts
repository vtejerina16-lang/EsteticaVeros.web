export type ServiceCategoryRecord = {
  id: number;
  categoryNumber: string;
  name: string;
  displayOrder: number;
  iconName?: string | null;
  colorCode?: string | null;
  isActive: boolean;
};

export type ServiceCategoryDetail = {
  id: number;
  categoryNumber: string;
  name: string;
  description?: string | null;
  displayOrder: number;
  iconName?: string | null;
  colorCode?: string | null;
  isActive: boolean;
  createdAt: string;     // DateTime -> string
  updatedAt?: string | null;
};

export type ListServiceCategoriesResult = {
  categories: ServiceCategoryRecord[];
};

export type CreateServiceCategoryInput = {
  name: string;
  description?: string | null;
  displayOrder: number;
  iconName?: string | null;
  colorCode?: string | null;
};

export type CreateServiceCategoryResult = {
  category: ServiceCategoryRecord;
};

export type UpdateServiceCategoryInput = {
  categoryId: number;
  name: string;
  description?: string | null;
  displayOrder: number;
  iconName?: string | null;
  colorCode?: string | null;
  isActive: boolean;
};

export type UpdateServiceCategoryResult = {
  category: ServiceCategoryDetail;
};