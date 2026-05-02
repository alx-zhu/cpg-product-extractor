import type { SpecDocument } from "@/types/ingredientSpec";

const DOCUMENTS_STORAGE_KEY = "cpg:documents";

const getDocumentsFromStorage = (): SpecDocument[] => {
  const stored = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
  return stored ? (JSON.parse(stored) as SpecDocument[]) : [];
};

const saveDocumentsToStorage = (documents: SpecDocument[]): void => {
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
};

export const fetchDocuments = async (): Promise<SpecDocument[]> => {
  return getDocumentsFromStorage();
};

export const createDocument = async (
  file: File,
  storagePath?: string,
): Promise<SpecDocument> => {
  const documents = getDocumentsFromStorage();
  const document: SpecDocument = {
    id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    filename: file.name,
    storagePath: storagePath,
    uploadDate: new Date(),
    status: "processing",
    type: "specification",
  };
  saveDocumentsToStorage([...documents, document]);
  return document;
};

export const updateDocumentStatus = async (
  documentId: string,
  status: SpecDocument["status"],
): Promise<SpecDocument> => {
  const documents = getDocumentsFromStorage();
  const updated = documents.map((d) => (d.id === documentId ? { ...d, status } : d));
  saveDocumentsToStorage(updated);
  const result = updated.find((d) => d.id === documentId);
  if (!result) throw new Error(`Document ${documentId} not found`);
  return result;
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  saveDocumentsToStorage(getDocumentsFromStorage().filter((d) => d.id !== documentId));
};
