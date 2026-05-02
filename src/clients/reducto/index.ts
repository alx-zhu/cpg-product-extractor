import Reducto from "reductoai";
import type { Upload } from "reductoai/resources/shared";
import type { ReductoFieldValue } from "@/types/reducto";
import type { ExtractedIngredientSpec, IngredientSpecFieldKey } from "@/types/ingredientSpec";
import { getExtractionConfig } from "./prompts";

export type ExtractionStage = "uploading" | "extracting";

const SPEC_FIELD_KEYS: IngredientSpecFieldKey[] = [
  "product_name", "supplier", "ingredient_function", "e_number", "cas_number",
  "country_of_origin", "spec_date", "typical_use_level", "typical_applications",
  "description", "features_benefits", "directions_for_use", "moisture_pct",
  "ph", "viscosity", "protein_pct", "particle_size", "appearance_color",
  "allergens", "kosher", "halal", "non_gmo", "regulatory_status",
  "shelf_life_months", "storage_conditions", "packaging_size",
];

export class ReductoClient {
  private client: Reducto;

  constructor(apiKey?: string) {
    const key = apiKey || import.meta.env.VITE_REDUCTO_API_KEY;
    if (!key) {
      throw new Error(
        "Reducto API key not found. Set VITE_REDUCTO_API_KEY in your .env file.",
      );
    }
    this.client = new Reducto({ apiKey: key });
  }

  async uploadAndExtract(
    file: File,
    documentId: string,
    pdfPath: string,
    onProgress?: (stage: ExtractionStage) => void,
    signal?: AbortSignal,
  ): Promise<ExtractedIngredientSpec[]> {
    console.log("[Reducto] Starting extraction for:", file.name);

    onProgress?.("uploading");
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const upload = await this.client.upload({ file }, { signal }) as Upload;
    console.log("[Reducto] File uploaded:", upload);

    onProgress?.("extracting");
    return this.extractFromUpload(upload, documentId, pdfPath, signal);
  }

  private async extractFromUpload(
    upload: Upload,
    documentId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _pdfPath: string,
    signal?: AbortSignal,
  ): Promise<ExtractedIngredientSpec[]> {
    const { schema, prompt } = getExtractionConfig();

    const result = await this.client.extract.run(
      {
        input: upload,
        instructions: {
          schema,
          system_prompt: prompt,
        },
        settings: {
          array_extract: true,
          citations: {
            enabled: true,
            numerical_confidence: true,
          },
        },
      },
      { signal },
    );

    if ("job_id" in result && !("result" in result)) {
      throw new Error("Received async response from Reducto. Use synchronous extraction.");
    }
    if (!("result" in result)) {
      throw new Error("Invalid response format from Reducto API");
    }

    const extractedData = result.result as { products?: unknown[] };
    const resultArray = extractedData.products ?? [];

    console.log("[Reducto] Extraction complete:", {
      job_id: result.job_id,
      num_specs: resultArray.length,
      usage: result.usage,
      studio_link: result.studio_link,
    });

    return this.mapReductoToSpecs(resultArray, documentId);
  }

  private mapReductoToSpecs(
    resultArray: unknown[],
    documentId: string,
  ): ExtractedIngredientSpec[] {
    if (!Array.isArray(resultArray)) {
      console.warn("[Reducto] No specs found in extraction result");
      return [];
    }

    return resultArray.map((item, index) => {
      const raw = item as Record<string, ReductoFieldValue<string>>;

      console.log(`[Reducto] Mapping spec ${index + 1}:`, {
        product_name: raw.product_name?.value,
        supplier: raw.supplier?.value,
      });

      const spec: ExtractedIngredientSpec = {
        id: `spec-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 9)}`,
        specDocumentId: documentId,
        reviewed: false,
        createdAt: new Date(),
        sourceType: "extracted",
      };

      for (const key of SPEC_FIELD_KEYS) {
        const field = raw[key];
        if (field && field.value && field.value !== "N/A") {
          (spec as unknown as Record<string, unknown>)[key] = field;
        }
      }

      return spec;
    });
  }
}

let reductoClient: ReductoClient | null = null;

export function getReductoClient(): ReductoClient {
  if (!reductoClient) {
    reductoClient = new ReductoClient();
  }
  return reductoClient;
}
