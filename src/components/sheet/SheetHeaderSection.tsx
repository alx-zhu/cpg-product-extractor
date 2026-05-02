import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExtractedIngredientSpec } from "@/types/ingredientSpec";
import type { SpecDocument } from "@/types/ingredientSpec";

interface SheetHeaderSectionProps {
  spec: ExtractedIngredientSpec;
  document?: SpecDocument;
  onClose: () => void;
}

export function SheetHeaderSection({ spec, document, onClose }: SheetHeaderSectionProps) {
  return (
    <div className="flex items-start justify-between px-5 py-4 border-b border-gray-200 bg-white shrink-0">
      <div className="flex flex-col gap-1 min-w-0 mr-3">
        <h2 className="text-sm font-semibold text-gray-900 truncate">
          {spec.product_name?.value || "Untitled Spec"}
        </h2>
        <div className="flex items-center gap-2">
          {spec.supplier?.value && (
            <span className="text-xs text-gray-500">{spec.supplier.value}</span>
          )}
          {document && (
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[160px]">
              {document.filename}
            </span>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-7 w-7 shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
