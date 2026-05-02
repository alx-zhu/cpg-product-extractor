import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SheetHeaderSection } from "./SheetHeaderSection";
import { SummaryStrip } from "./SummaryStrip";
import { FieldEditor } from "./FieldEditor";
import { SheetPdfViewer } from "./SheetPdfViewer";
import { useUpdateSpec } from "@/hooks/useSpecs";
import { useSheetResize } from "@/hooks/useSheetResize";
import type { ExtractedIngredientSpec, IngredientSpecFieldKey, SpecDocument } from "@/types/ingredientSpec";
import { GripVertical } from "lucide-react";
import { VisuallyHidden } from "radix-ui";

interface SourceSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spec: ExtractedIngredientSpec | null;
  selectedFieldKey: IngredientSpecFieldKey;
  onFieldKeyChange: (fieldKey: IngredientSpecFieldKey) => void;
  document?: SpecDocument;
  pdfUrl: string | null;
}

export function SourceSheet({
  open,
  onOpenChange,
  spec,
  selectedFieldKey,
  onFieldKeyChange,
  document,
  pdfUrl,
}: SourceSheetProps) {
  const updateSpec = useUpdateSpec();
  const { width, isDragging, handleMouseDown } = useSheetResize();

  const handleClose = () => {
    if (globalThis.document?.activeElement instanceof HTMLElement) {
      globalThis.document.activeElement.blur();
    }
    onOpenChange(false);
  };

  const handleFieldSave = (fieldKey: IngredientSpecFieldKey, newValue: string) => {
    if (!spec) return;
    const existing = (spec as unknown as Record<string, { value?: string; citations?: unknown[] } | undefined>)[fieldKey];
    updateSpec.mutate({
      specId: spec.id,
      updates: {
        [fieldKey]: {
          value: newValue,
          citations: existing?.citations ?? [],
        },
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="p-0 flex flex-col gap-0"
        style={{
          width: `${width}px`,
          maxWidth: "none",
          transition: isDragging ? "none" : undefined,
        }}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={() => {
          if (globalThis.document?.activeElement instanceof HTMLElement) {
            globalThis.document.activeElement.blur();
          }
        }}
      >
        <div
          onMouseDown={handleMouseDown}
          className="absolute -left-2 inset-y-0 w-4 cursor-col-resize z-10 flex items-center justify-center group/handle before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:w-2 before:bg-transparent hover:before:bg-blue-400/40 active:before:bg-blue-500/50 before:transition-colors"
        >
          <div className="z-20 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center group-hover/handle:bg-blue-50 group-hover/handle:border-blue-300 group-active/handle:bg-blue-100 transition-colors">
            <GripVertical className="size-3.5 text-gray-400 group-hover/handle:text-blue-500 transition-colors" />
          </div>
        </div>

        <VisuallyHidden.Root>
          <SheetTitle>
            {spec?.product_name?.value || "Spec Details"}
          </SheetTitle>
        </VisuallyHidden.Root>

        {spec ? (
          <>
            <SheetHeaderSection spec={spec} document={document} onClose={handleClose} />

            <FieldEditor
              spec={spec}
              fieldKey={selectedFieldKey}
              onFieldKeyChange={onFieldKeyChange}
              onSave={handleFieldSave}
            />

            <SummaryStrip
              spec={spec}
              selectedFieldKey={selectedFieldKey}
              onFieldSelect={onFieldKeyChange}
            />

            {pdfUrl ? (
              <SheetPdfViewer pdfUrl={pdfUrl} spec={spec} selectedFieldKey={selectedFieldKey} />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-400">No source document</p>
              </div>
            )}
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
