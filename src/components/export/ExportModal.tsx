import { useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExportFilterSidebar } from "./ExportFilterSidebar";
import { ExportColumnBar } from "./ExportColumnBar";
import { ExportPreviewTable } from "./ExportPreviewTable";
import { DEFAULT_EXPORT_COLUMNS, exportSpecsToCSV, downloadCSV } from "@/utils/export";
import type { ExportColumn } from "@/utils/export";
import type { ExtractedIngredientSpec } from "@/types/ingredientSpec";
import { INGREDIENT_FUNCTION_TYPES } from "@/config/ingredientSpec.config";
import type { SidebarFunction } from "@/hooks/useSidebarFilter";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specs: ExtractedIngredientSpec[];
}

export function ExportModal({ open, onOpenChange, specs }: ExportModalProps) {
  const [columns, setColumns] = useState<ExportColumn[]>(DEFAULT_EXPORT_COLUMNS);
  const [selectedFunctions, setSelectedFunctions] = useState<Set<string>>(new Set());
  const [includeUnclassified, setIncludeUnclassified] = useState(true);

  const { functions, unclassifiedCount } = useMemo(() => {
    const fnCounts = new Map<string, number>();
    let unclassified = 0;
    for (const spec of specs) {
      const fn = spec.ingredient_function?.value?.trim().toLowerCase();
      if (!fn || fn === "n/a") {
        unclassified++;
      } else {
        fnCounts.set(fn, (fnCounts.get(fn) ?? 0) + 1);
      }
    }
    const result: SidebarFunction[] = INGREDIENT_FUNCTION_TYPES.filter((t) =>
      fnCounts.has(t.value),
    ).map((t) => ({ value: t.value, label: t.label, count: fnCounts.get(t.value)! }));
    return { functions: result, unclassifiedCount: unclassified };
  }, [specs]);

  const allFunctionValues = useMemo(() => new Set(functions.map((f) => f.value)), [functions]);

  const isAllSelected =
    selectedFunctions.size === 0 ||
    (selectedFunctions.size === functions.length &&
      (unclassifiedCount === 0 || includeUnclassified));

  const filteredSpecs = useMemo(() => {
    if (selectedFunctions.size === 0) return specs;
    return specs.filter((spec) => {
      const fn = spec.ingredient_function?.value?.trim().toLowerCase();
      if (!fn || fn === "n/a") return includeUnclassified;
      return selectedFunctions.has(fn);
    });
  }, [specs, selectedFunctions, includeUnclassified]);

  const handleToggleFunction = useCallback((value: string) => {
    setSelectedFunctions((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedFunctions(new Set());
    setIncludeUnclassified(true);
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedFunctions(new Set(allFunctionValues));
    setIncludeUnclassified(false);
  }, [allFunctionValues]);

  const handleToggleColumn = useCallback((key: string) => {
    setColumns((prev) =>
      prev.map((c) => (c.key === key ? { ...c, enabled: !c.enabled } : c)),
    );
  }, []);

  const handleEnableAllColumns = useCallback(() => {
    setColumns((prev) => prev.map((c) => ({ ...c, enabled: true })));
  }, []);

  const handleExport = () => {
    const csv = exportSpecsToCSV(filteredSpecs, columns);
    downloadCSV(csv, "ingredient-specs");
    onOpenChange(false);
  };

  const enabledColumnCount = columns.filter((c) => c.enabled).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 shrink-0">
          <DialogTitle className="text-base font-semibold">Export to CSV</DialogTitle>
        </DialogHeader>

        <ExportColumnBar
          columns={columns}
          onToggle={handleToggleColumn}
          onEnableAll={handleEnableAllColumns}
        />

        <div className="flex flex-1 min-h-0">
          <ExportFilterSidebar
            functions={functions}
            unclassifiedCount={unclassifiedCount}
            totalCount={specs.length}
            selectedFunctions={isAllSelected ? new Set() : selectedFunctions}
            includeUnclassified={isAllSelected ? true : includeUnclassified}
            onToggleFunction={handleToggleFunction}
            onToggleUnclassified={() => setIncludeUnclassified((v) => !v)}
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
          />

          <ExportPreviewTable specs={filteredSpecs} columns={columns} />
        </div>

        <DialogFooter className="mx-0 mb-0 px-6 py-4 border-t border-gray-200 shrink-0 flex items-center justify-between sm:justify-between rounded-b-xl">
          <p className="text-sm text-gray-500">
            {filteredSpecs.length} spec{filteredSpecs.length !== 1 ? "s" : ""},{" "}
            {enabledColumnCount} column{enabledColumnCount !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={enabledColumnCount === 0 || filteredSpecs.length === 0}>
              Export CSV
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
