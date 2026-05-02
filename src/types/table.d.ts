import "@tanstack/react-table";
import type { IngredientSpecFieldKey } from "./ingredientSpec";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    fieldName?: IngredientSpecFieldKey;
  }
}
