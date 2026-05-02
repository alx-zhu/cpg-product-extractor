import type { IngredientSpecFieldKey } from "@/types/ingredientSpec";

export interface FieldConfig {
  key: IngredientSpecFieldKey;
  label: string;
}

export const SPEC_FIELDS: FieldConfig[] = [
  { key: "product_name", label: "Product Name" },
  { key: "supplier", label: "Supplier" },
  { key: "ingredient_function", label: "Function" },
  { key: "e_number", label: "E Number" },
  { key: "cas_number", label: "CAS Number" },
  { key: "country_of_origin", label: "Country of Origin" },
  { key: "spec_date", label: "Spec Date" },
  { key: "typical_use_level", label: "Use Level" },
  { key: "typical_applications", label: "Applications" },
  { key: "description", label: "Description" },
  { key: "features_benefits", label: "Features & Benefits" },
  { key: "directions_for_use", label: "Directions for Use" },
  { key: "moisture_pct", label: "Moisture %" },
  { key: "ph", label: "pH" },
  { key: "viscosity", label: "Viscosity" },
  { key: "protein_pct", label: "Protein %" },
  { key: "particle_size", label: "Particle Size" },
  { key: "appearance_color", label: "Appearance / Color" },
  { key: "allergens", label: "Allergens" },
  { key: "kosher", label: "Kosher" },
  { key: "halal", label: "Halal" },
  { key: "non_gmo", label: "Non-GMO" },
  { key: "regulatory_status", label: "Regulatory Status" },
  { key: "shelf_life_months", label: "Shelf Life (mo)" },
  { key: "storage_conditions", label: "Storage" },
  { key: "packaging_size", label: "Pack Size" },
];

export function getFieldLabel(key: IngredientSpecFieldKey): string {
  return SPEC_FIELDS.find((f) => f.key === key)?.label ?? key;
}
