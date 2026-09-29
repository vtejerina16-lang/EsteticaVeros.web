export type ServiceCategoryOption = { id: number; name: string };

export const categoryNameById = (categories: ServiceCategoryOption[], id: number) =>
  categories.find((c) => c.id === id)?.name ?? "—";