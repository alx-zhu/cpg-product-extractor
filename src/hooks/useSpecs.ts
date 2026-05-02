import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExtractedIngredientSpec } from "@/types/ingredientSpec";
import * as specsApi from "@/api/specs.api";

export const specKeys = {
  all: ["specs"] as const,
  lists: () => [...specKeys.all, "list"] as const,
  byDocument: (documentId: string) => [...specKeys.all, "by-document", documentId] as const,
};

export const useSpecs = () =>
  useQuery({
    queryKey: specKeys.lists(),
    queryFn: specsApi.fetchSpecs,
    staleTime: 1000 * 60 * 5,
  });

export const useCreateSpecs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: specsApi.createSpecs,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: specKeys.all }),
  });
};

export const useUpdateSpec = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ specId, updates }: { specId: string; updates: Partial<ExtractedIngredientSpec> }) =>
      specsApi.updateSpec(specId, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: specKeys.all }),
  });
};

export const useDeleteSpec = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: specsApi.deleteSpec,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: specKeys.all }),
  });
};

export const useDeleteSpecs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: specsApi.deleteSpecs,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: specKeys.all }),
  });
};

export const useDeleteSpecsByDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: specsApi.deleteSpecsByDocument,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: specKeys.all }),
  });
};
