import { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateDocument, useUpdateDocumentStatus } from "@/hooks/useDocuments";
import { useCreateSpecs } from "@/hooks/useSpecs";
import { useReductoExtraction } from "@/hooks/useReductoExtraction";
import { savePdfToStorage } from "@/utils/storage";
import { SelectedFile } from "./SelectedFile";
import type { ExtractionStage } from "@/api/reducto.client";

const STAGE_LABELS: Record<ExtractionStage | "preparing" | "saving", string> = {
  preparing: "Preparing document...",
  uploading: "Uploading to Reducto...",
  extracting: "Extracting specs...",
  saving: "Saving specs...",
};

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingDoc, setProcessingDoc] = useState<{
    index: number;
    total: number;
    fileName: string;
  } | null>(null);
  const [processingStage, setProcessingStage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const createDocument = useCreateDocument();
  const updateDocumentStatus = useUpdateDocumentStatus();
  const createSpecs = useCreateSpecs();
  const reductoExtraction = useReductoExtraction();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf",
    );
    if (files.length > 0) setSelectedFiles((prev) => [...prev, ...files]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter(
      (f) => f.type === "application/pdf",
    );
    if (files.length > 0) setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const { signal } = abortController;

    setIsProcessing(true);
    setError(null);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        if (signal.aborted) break;

        const file = selectedFiles[i];
        setProcessingDoc({ index: i + 1, total: selectedFiles.length, fileName: file.name });

        setProcessingStage(STAGE_LABELS.preparing);
        const pdfPath = await savePdfToStorage(file);

        const document = await createDocument.mutateAsync({ file, storagePath: pdfPath });

        const extractedSpecs = await reductoExtraction.mutateAsync({
          file,
          documentId: document.id,
          pdfPath,
          onProgress: (stage) => setProcessingStage(STAGE_LABELS[stage]),
          signal,
        });

        if (extractedSpecs.length > 0) {
          setProcessingStage(STAGE_LABELS.saving);
          await createSpecs.mutateAsync(
            extractedSpecs.map((s) => ({ ...s, specDocumentId: document.id })),
          );
        }

        await updateDocumentStatus.mutateAsync({ documentId: document.id, status: "completed" });
      }

      setSelectedFiles([]);
      setProcessingDoc(null);
      setProcessingStage("");
      onOpenChange(false);
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        setProcessingDoc(null);
        setProcessingStage("");
        return;
      }
      const msg = err instanceof Error ? err.message : "Unknown error occurred";
      setError(msg);
      setProcessingDoc(null);
      setProcessingStage("");
    } finally {
      abortControllerRef.current = null;
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setError(null);
    setProcessingDoc(null);
    setProcessingStage("");
    onOpenChange(false);
  };

  const getFileStatus = (index: number) => {
    if (!isProcessing || !processingDoc) return "idle" as const;
    if (index < processingDoc.index - 1) return "completed" as const;
    if (index === processingDoc.index - 1) return "processing" as const;
    return "idle" as const;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold">Upload Spec Sheets</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Upload PDF spec sheets to extract ingredient data using Reducto AI
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 overflow-auto space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-lg transition-all",
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-gray-50 hover:bg-gray-100",
            )}
          >
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            <div className="flex flex-col items-center justify-center py-10 px-6">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors",
                  isDragging ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400",
                )}
              >
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Drop PDF files here, or click to browse
              </p>
              <p className="text-xs text-gray-500">Multiple files supported · PDF only</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Extraction failed</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {isProcessing && processingDoc && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-medium text-blue-900">
                  Processing {processingDoc.index} of {processingDoc.total}
                </p>
                <p className="text-xs text-blue-700 mt-0.5 truncate">
                  {processingDoc.fileName}
                  {processingStage && <> &middot; {processingStage}</>}
                </p>
              </div>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Selected Files ({selectedFiles.length})
              </p>
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <SelectedFile
                    key={index}
                    file={file}
                    onRemove={() => removeFile(index)}
                    isProcessing={isProcessing}
                    status={getFileStatus(index)}
                    stageLabel={processingStage}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={isProcessing ? () => abortControllerRef.current?.abort() : handleCancel}
            >
              {isProcessing ? "Stop" : "Cancel"}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isProcessing}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Extract with Reducto{selectedFiles.length > 0 && ` (${selectedFiles.length})`}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
