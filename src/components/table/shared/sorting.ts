import type { ExtractedIngredientSpec, IngredientSpecFieldKey } from "@/types/ingredientSpec";

export interface SortConfig {
  columnId: string;
  direction: "asc" | "desc";
}

export const DEFAULT_SORT: SortConfig = {
  columnId: "createdAt",
  direction: "desc",
};

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "createdAt",           label: "Date added" },
  { value: "product_name",        label: "Product name" },
  { value: "supplier",            label: "Supplier" },
  { value: "ingredient_function", label: "Function" },
  { value: "shelf_life_months",   label: "Shelf life" },
];

export function createSortComparator(
  sortConfig: SortConfig,
): (a: ExtractedIngredientSpec, b: ExtractedIngredientSpec) => number {
  const { columnId, direction } = sortConfig;
  const multiplier = direction === "asc" ? 1 : -1;

  return (a, b) => {
    if (columnId === "createdAt") {
      return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    const aVal =
      (a as unknown as Record<string, { value?: string } | undefined>)[columnId as IngredientSpecFieldKey]?.value?.toLowerCase() ?? "";
    const bVal =
      (b as unknown as Record<string, { value?: string } | undefined>)[columnId as IngredientSpecFieldKey]?.value?.toLowerCase() ?? "";

    if (!aVal && !bVal) return 0;
    if (!aVal) return 1;
    if (!bVal) return -1;

    return multiplier * aVal.localeCompare(bVal);
  };
}
