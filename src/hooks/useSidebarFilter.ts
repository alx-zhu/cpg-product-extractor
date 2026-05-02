import { useState, useMemo, useCallback } from "react";
import type { ExtractedIngredientSpec } from "@/types/ingredientSpec";
import { INGREDIENT_FUNCTION_TYPES } from "@/config/ingredientSpec.config";

export type SidebarFilter =
  | { type: "function"; value: string }
  | { type: "unclassified" }
  | null;

export interface SidebarFunction {
  value: string;
  label: string;
  count: number;
}

export function useSidebarFilter(
  specs: ExtractedIngredientSpec[],
  initialFilter: SidebarFilter = null,
) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState<SidebarFilter>(initialFilter);

  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);
  const clearFilter = useCallback(() => setActiveFilter(null), []);

  const { functions, unclassifiedCount } = useMemo(() => {
    const fnCounts = new Map<string, number>();
    let unclassified = 0;

    for (const spec of specs) {
      const fn = spec.ingredient_function?.value?.trim().toLowerCase();
      if (!fn || fn === "n/a") {
        unclassified++;
      } else {
        fnCounts.set(fn, (fnCounts.get(fn) ?? 0) + 1);
      }
    }

    const result: SidebarFunction[] = INGREDIENT_FUNCTION_TYPES
      .filter((t) => fnCounts.has(t.value))
      .map((t) => ({ value: t.value, label: t.label, count: fnCounts.get(t.value)! }));

    return { functions: result, unclassifiedCount: unclassified };
  }, [specs]);

  const activeFilterLabel = useMemo(() => {
    if (!activeFilter) return null;
    if (activeFilter.type === "unclassified") return "Unclassified";
    const match = INGREDIENT_FUNCTION_TYPES.find((t) => t.value === activeFilter.value);
    return match?.label ?? activeFilter.value;
  }, [activeFilter]);

  const selectFunction = useCallback((value: string) => {
    setActiveFilter((prev) => {
      if (prev?.type === "function" && prev.value === value) return null;
      return { type: "function", value };
    });
  }, []);

  const selectUnclassified = useCallback(() => {
    setActiveFilter((prev) => {
      if (prev?.type === "unclassified") return null;
      return { type: "unclassified" };
    });
  }, []);

  const filterSpecs = useCallback(
    (specsToFilter: ExtractedIngredientSpec[]): ExtractedIngredientSpec[] => {
      if (!activeFilter) return specsToFilter;
      return specsToFilter.filter((spec) => {
        const fn = spec.ingredient_function?.value?.trim().toLowerCase();
        if (activeFilter.type === "unclassified") {
          return !fn || fn === "n/a";
        }
        return fn === activeFilter.value;
      });
    },
    [activeFilter],
  );

  return {
    isOpen,
    toggleSidebar,
    activeFilter,
    clearFilter,
    activeFilterLabel,
    selectFunction,
    selectUnclassified,
    functions,
    unclassifiedCount,
    filterSpecs,
  };
}
