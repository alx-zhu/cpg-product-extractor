export const columnLayout = {
  checkbox:          { width: 48 },
  expand:            { width: 32 },
  sourceAction:      { width: 80 },
  product_name:      { width: 220 },
  supplier:          { width: 160 },
  ingredient_function: { width: 140 },
  allergens:         { width: 120 },
  cas_number:        { width: 140 },
  typical_use_level: { width: 140 },
  typical_applications: { width: 200 },
  ph:                { width: 80 },
  kosher:            { width: 80 },
  halal:             { width: 80 },
  non_gmo:           { width: 80 },
  shelf_life_months: { width: 100 },
  source_doc:        { width: 160 },
} as const;

export type ColumnType = "checkbox" | "expand" | "sourceAction" | "product_name" | "data";

export function getColumnType(columnId: string): ColumnType {
  if (columnId === "select") return "checkbox";
  if (columnId === "expand") return "expand";
  if (columnId === "sourceAction") return "sourceAction";
  if (columnId === "product_name") return "product_name";
  return "data";
}

export function getColumnWidth(columnId: string): number | undefined {
  const entry = columnLayout[columnId as keyof typeof columnLayout];
  return entry?.width;
}
