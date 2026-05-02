export interface ExtractionConfig {
  schema: Record<string, unknown>;
  prompt: string;
}

const INGREDIENT_SPEC_SCHEMA = {
  type: "object",
  properties: {
    products: {
      type: "array",
      items: {
        type: "object",
        properties: {
          product_name: {
            type: "string",
            description: "Commercial trade name of the ingredient",
          },
          supplier: {
            type: "string",
            description: "Manufacturer or supplier company name",
          },
          ingredient_function: {
            type: "string",
            description:
              "Functional category: Stabilizer, Protein, Hydrocolloid, Emulsifier, Sweetener, Flavor, Vitamin, Mineral, Texture, or Other",
          },
          e_number: {
            type: "string",
            description: "EU E-number regulatory identifier, e.g. E410",
          },
          cas_number: {
            type: "string",
            description: "CAS registry number, e.g. 9000-01-5",
          },
          country_of_origin: { type: "string" },
          spec_date: {
            type: "string",
            description: "Revision or valid-from date",
          },
          typical_use_level: {
            type: "string",
            description:
              "Recommended usage percentage range, e.g. 0.025–0.035%",
          },
          typical_applications: {
            type: "string",
            description: "Product categories where this ingredient is used",
          },
          description: {
            type: "string",
            description: "Full narrative description of the ingredient",
          },
          features_benefits: {
            type: "string",
            description:
              "Key functional benefits, comma-separated or as written",
          },
          directions_for_use: {
            type: "string",
            description: "Dispersion, hydration, or processing notes",
          },
          moisture_pct: {
            type: "string",
            description: "Loss on drying / moisture content",
          },
          ph: { type: "string", description: "pH range, e.g. 5.0–7.0" },
          viscosity: {
            type: "string",
            description: "Viscosity value with method/conditions",
          },
          protein_pct: { type: "string", description: "Protein percentage" },
          particle_size: {
            type: "string",
            description: "Particle size specification",
          },
          appearance_color: {
            type: "string",
            description: "Physical appearance and color",
          },
          allergens: {
            type: "string",
            description: "Allergens present as comma-separated list, or 'None'",
          },
          kosher: { type: "string", description: "Yes, No, or N/A" },
          halal: { type: "string", description: "Yes, No, or N/A" },
          non_gmo: { type: "string", description: "Yes, No, or N/A" },
          regulatory_status: {
            type: "string",
            description: "GRAS status, CFR citations, E-number approvals",
          },
          shelf_life_months: {
            type: "string",
            description: "Shelf life in months, number only",
          },
          storage_conditions: {
            type: "string",
            description: "Temperature and humidity storage requirements",
          },
          packaging_size: {
            type: "string",
            description: "Package sizes available, e.g. 20 kg, 25 kg",
          },
        },
        required: [
          "product_name",
          "supplier",
          "ingredient_function",
          "e_number",
          "cas_number",
          "country_of_origin",
          "spec_date",
          "typical_use_level",
          "typical_applications",
          "description",
          "features_benefits",
          "directions_for_use",
          "moisture_pct",
          "ph",
          "viscosity",
          "protein_pct",
          "particle_size",
          "appearance_color",
          "allergens",
          "kosher",
          "halal",
          "non_gmo",
          "regulatory_status",
          "shelf_life_months",
          "storage_conditions",
          "packaging_size",
        ],
      },
    },
  },
  required: ["products"],
} as const;

const INGREDIENT_SPEC_PROMPT = `EXTRACTION TASK: Extract ALL ingredient specifications from CPG supplier spec sheets into structured data.

CRITICAL RULES:
1. Extract EVERY ingredient specification present in the document. Missing even one is a critical error.
2. Use "N/A" for any field that is genuinely absent — never guess or infer.
3. For allergens: list all allergens as comma-separated text (e.g. "Milk, Soy"), or "None" if allergen-free.
4. For kosher/halal/non_gmo: use exactly "Yes", "No", or "N/A".
5. For shelf_life_months: extract the number only (e.g. "24"), not "24 months".
6. For ingredient_function: classify as one of: Stabilizer, Protein, Hydrocolloid, Emulsifier, Sweetener, Flavor, Vitamin, Mineral, Texture, Other.
7. For typical_use_level: preserve the exact range as written (e.g. "0.025-0.035%").
8. For ph: preserve range format (e.g. "5.0-7.0").

OUTPUT: Return valid JSON matching the schema. Use "N/A" for all missing fields.`;

export function getExtractionConfig(): ExtractionConfig {
  return {
    schema: INGREDIENT_SPEC_SCHEMA as unknown as Record<string, unknown>,
    prompt: INGREDIENT_SPEC_PROMPT,
  };
}
