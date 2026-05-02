import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as documentsApi from "@/api/documents.api";

export const documentKeys = {
  all: ["documents"] as const,
  lists: () => [...documentKeys.all, "list"] as const,
};

export const useDocuments = () =>
  useQuery({
    queryKey: documentKeys.lists(),
    queryFn: documentsApi.fetchDocuments,
    staleTime: 1000 * 60 * 5,
  });

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, storagePath }: { file: File; storagePath?: string }) =>
      documentsApi.createDocument(file, storagePath),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  });
};

export const useUpdateDocumentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      documentId,
      status,
    }: {
      documentId: string;
      status: Parameters<typeof documentsApi.updateDocumentStatus>[1];
    }) => documentsApi.updateDocumentStatus(documentId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: documentsApi.deleteDocument,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  });
};
