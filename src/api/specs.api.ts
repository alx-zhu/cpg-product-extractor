import type { ExtractedIngredientSpec } from "@/types/ingredientSpec";
import { simulateApiCall } from "./client";

const SPECS_STORAGE_KEY = "cpg:specs";

const getSpecsFromStorage = (): ExtractedIngredientSpec[] => {
  const stored = localStorage.getItem(SPECS_STORAGE_KEY);
  return stored ? (JSON.parse(stored) as ExtractedIngredientSpec[]) : [];
};

const saveSpecsToStorage = (specs: ExtractedIngredientSpec[]): void => {
  localStorage.setItem(SPECS_STORAGE_KEY, JSON.stringify(specs));
};

export const fetchSpecs = async (): Promise<ExtractedIngredientSpec[]> => {
  return simulateApiCall(getSpecsFromStorage());
};

export const fetchSpecsByDocument = async (
  documentId: string,
): Promise<ExtractedIngredientSpec[]> => {
  const specs = getSpecsFromStorage();
  return simulateApiCall(specs.filter((s) => s.specDocumentId === documentId));
};

export const createSpecs = async (
  newSpecs: Omit<ExtractedIngredientSpec, "id" | "reviewed" | "createdAt">[],
): Promise<ExtractedIngredientSpec[]> => {
  const specs = getSpecsFromStorage();
  const created: ExtractedIngredientSpec[] = newSpecs.map((s) => ({
    ...s,
    id: `spec-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    reviewed: false,
    createdAt: new Date(),
  }));
  saveSpecsToStorage([...created, ...specs]);
  return simulateApiCall(created);
};

export const updateSpec = async (
  specId: string,
  updates: Partial<ExtractedIngredientSpec>,
): Promise<ExtractedIngredientSpec> => {
  const specs = getSpecsFromStorage();
  const updated = specs.map((s) => (s.id === specId ? { ...s, ...updates } : s));
  saveSpecsToStorage(updated);
  const result = updated.find((s) => s.id === specId);
  if (!result) throw new Error(`Spec ${specId} not found`);
  return simulateApiCall(result);
};

export const deleteSpec = async (specId: string): Promise<void> => {
  saveSpecsToStorage(getSpecsFromStorage().filter((s) => s.id !== specId));
  return simulateApiCall(undefined);
};

export const deleteSpecs = async (specIds: string[]): Promise<void> => {
  const idSet = new Set(specIds);
  saveSpecsToStorage(getSpecsFromStorage().filter((s) => !idSet.has(s.id)));
  return simulateApiCall(undefined);
};

export const deleteSpecsByDocument = async (documentId: string): Promise<void> => {
  saveSpecsToStorage(
    getSpecsFromStorage().filter((s) => s.specDocumentId !== documentId),
  );
  return simulateApiCall(undefined);
};
