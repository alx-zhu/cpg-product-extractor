import type { ReductoFieldValue, ReductoCitation } from "./reducto";

export interface ExtractedIngredientSpec {
  id: string;
  specDocumentId: string;
  reviewed: boolean;
  createdAt: Date;
  sourceType?: "extracted" | "manual";

  product_name?: ReductoFieldValue<string>;
  supplier?: ReductoFieldValue<string>;
  ingredient_function?: ReductoFieldValue<string>;
  e_number?: ReductoFieldValue<string>;
  cas_number?: ReductoFieldValue<string>;
  country_of_origin?: ReductoFieldValue<string>;
  spec_date?: ReductoFieldValue<string>;

  typical_use_level?: ReductoFieldValue<string>;
  typical_applications?: ReductoFieldValue<string>;
  description?: ReductoFieldValue<string>;
  features_benefits?: ReductoFieldValue<string>;
  directions_for_use?: ReductoFieldValue<string>;

  moisture_pct?: ReductoFieldValue<string>;
  ph?: ReductoFieldValue<string>;
  viscosity?: ReductoFieldValue<string>;
  protein_pct?: ReductoFieldValue<string>;
  particle_size?: ReductoFieldValue<string>;
  appearance_color?: ReductoFieldValue<string>;

  allergens?: ReductoFieldValue<string>;
  kosher?: ReductoFieldValue<string>;
  halal?: ReductoFieldValue<string>;
  non_gmo?: ReductoFieldValue<string>;
  regulatory_status?: ReductoFieldValue<string>;

  shelf_life_months?: ReductoFieldValue<string>;
  storage_conditions?: ReductoFieldValue<string>;
  packaging_size?: ReductoFieldValue<string>;
}

export type IngredientSpecFieldKey = keyof Pick<
  ExtractedIngredientSpec,
  | "product_name"
  | "supplier"
  | "ingredient_function"
  | "e_number"
  | "cas_number"
  | "country_of_origin"
  | "spec_date"
  | "typical_use_level"
  | "typical_applications"
  | "description"
  | "features_benefits"
  | "directions_for_use"
  | "moisture_pct"
  | "ph"
  | "viscosity"
  | "protein_pct"
  | "particle_size"
  | "appearance_color"
  | "allergens"
  | "kosher"
  | "halal"
  | "non_gmo"
  | "regulatory_status"
  | "shelf_life_months"
  | "storage_conditions"
  | "packaging_size"
>;

export interface SpecDocument {
  id: string;
  filename: string;
  storagePath?: string;
  uploadDate: Date;
  status: "processing" | "completed" | "error";
  type: "specification";
}

export function getFieldCitations(
  field?: ReductoFieldValue<string>,
): ReductoCitation[] {
  if (!field) return [];
  return field.citations;
}
