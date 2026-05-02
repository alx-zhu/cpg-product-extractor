import { useMutation } from "@tanstack/react-query";
import { getReductoClient } from "@/api/reducto.client";
import type { ExtractionStage } from "@/api/reducto.client";
import type { ExtractedIngredientSpec } from "@/types/ingredientSpec";

interface ReductoExtractionParams {
  file: File;
  documentId: string;
  pdfPath: string;
  onProgress?: (stage: ExtractionStage) => void;
  signal?: AbortSignal;
}

export function useReductoExtraction() {
  return useMutation<ExtractedIngredientSpec[], Error, ReductoExtractionParams>({
    mutationFn: async ({ file, documentId, pdfPath, onProgress, signal }) => {
      const client = getReductoClient();
      return client.uploadAndExtract(file, documentId, pdfPath, onProgress, signal);
    },
    onError: (error) => {
      console.error("[useReductoExtraction] Error:", error);
    },
  });
}
