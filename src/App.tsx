import { useState, useMemo, useCallback } from "react";
import { SpecsTable } from "@/components/table/SpecsTable";
import { SourceSheet } from "@/components/sheet/SourceSheet";
import { FilterSidebar } from "@/components/sidebar/FilterSidebar";
import { UploadModal } from "@/components/upload/UploadModal";
import { ExportModal } from "@/components/export/ExportModal";
import { useSpecs } from "@/hooks/useSpecs";
import { useDocuments } from "@/hooks/useDocuments";
import { useSidebarFilter } from "@/hooks/useSidebarFilter";
import { DEFAULT_SORT, createSortComparator } from "@/components/table/shared/sorting";
import type { SortConfig } from "@/components/table/shared/sorting";
import type { ExtractedIngredientSpec, IngredientSpecFieldKey } from "@/types/ingredientSpec";
import { getPdfUrl } from "@/utils/storage";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

function App() {
  const { data: rawSpecs } = useSpecs();
  const { data: rawDocuments } = useDocuments();
  // Inline `= []` defaults create a new array reference every render when
  // TanStack Query's data is undefined (initial load), making sortedAndFiltered
  // unstable and triggering the pagedData loop in SpecsTable before data arrives.
  const specs = useMemo(() => rawSpecs ?? [], [rawSpecs]);
  const documents = useMemo(() => rawDocuments ?? [], [rawDocuments]);

  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null);
  const [selectedFieldKey, setSelectedFieldKey] = useState<IngredientSpecFieldKey>("product_name");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>(DEFAULT_SORT);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectionKey, setSelectionKey] = useState(0);

  const sidebar = useSidebarFilter(specs);

  const documentMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const doc of documents) map.set(doc.id, doc.filename);
    return map;
  }, [documents]);

  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim()) return specs;
    const q = searchQuery.toLowerCase();
    return specs.filter((s) => {
      return (
        s.product_name?.value?.toLowerCase().includes(q) ||
        s.supplier?.value?.toLowerCase().includes(q) ||
        s.ingredient_function?.value?.toLowerCase().includes(q)
      );
    });
  }, [specs, searchQuery]);

  const filteredSpecs = useMemo(
    () => sidebar.filterSpecs(filteredBySearch),
    [sidebar.filterSpecs, filteredBySearch],
  );

  const sortedAndFiltered = useMemo(() => {
    const comparator = createSortComparator(sortConfig);
    return [...filteredSpecs].sort(comparator);
  }, [filteredSpecs, sortConfig]);

  const selectedSpec = useMemo(
    () => (selectedSpecId ? specs.find((s) => s.id === selectedSpecId) ?? null : null),
    [selectedSpecId, specs],
  );

  const selectedDocument = useMemo(
    () =>
      selectedSpec
        ? documents.find((d) => d.id === selectedSpec.specDocumentId)
        : undefined,
    [selectedSpec, documents],
  );

  const pdfUrl = useMemo(() => {
    if (!selectedDocument?.storagePath) return null;
    return getPdfUrl(selectedDocument.storagePath);
  }, [selectedDocument]);

  const handleViewSource = useCallback(
    (spec: ExtractedIngredientSpec, fieldKey?: IngredientSpecFieldKey) => {
      setSelectedSpecId(spec.id);
      setSelectedFieldKey(fieldKey ?? "product_name");
    },
    [],
  );

  const handleSheetClose = useCallback((open: boolean) => {
    if (!open) {
      setSelectedSpecId(null);
      setSelectedFieldKey("product_name");
    }
  }, []);

  const handleExportSelection = useCallback((_selected: ExtractedIngredientSpec[]) => {
    setIsExportModalOpen(true);
    setSelectionKey((k) => k + 1);
  }, []);

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={sidebar.toggleSidebar}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-900">CPG Spec Extractor</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExportModalOpen(true)}
              disabled={specs.length === 0}
              className="h-7 text-xs"
            >
              Export CSV
            </Button>
            <Button
              size="sm"
              onClick={() => setIsUploadModalOpen(true)}
              className="h-7 text-xs gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload
            </Button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <FilterSidebar
            isOpen={sidebar.isOpen}
            functions={sidebar.functions}
            activeFilter={sidebar.activeFilter}
            unclassifiedCount={sidebar.unclassifiedCount}
            totalCount={specs.length}
            onFunctionClick={sidebar.selectFunction}
            onUnclassifiedClick={sidebar.selectUnclassified}
            onClearFilter={sidebar.clearFilter}
          />

          <main className="flex-1 overflow-hidden p-4">
            <SpecsTable
              data={sortedAndFiltered}
              selectedSpecId={selectedSpecId}
              selectedFieldKey={selectedFieldKey}
              onViewSource={handleViewSource}
              selectionKey={selectionKey}
              documentMap={documentMap}
              sortConfig={sortConfig}
              onSortChange={setSortConfig}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFilterToggle={sidebar.toggleSidebar}
              activeFilterLabel={sidebar.activeFilterLabel}
              onClearFilter={sidebar.clearFilter}
              onExportSelection={handleExportSelection}
              onUploadClick={() => setIsUploadModalOpen(true)}
            />
          </main>
        </div>

        <SourceSheet
          open={!!selectedSpecId}
          onOpenChange={handleSheetClose}
          spec={selectedSpec}
          selectedFieldKey={selectedFieldKey}
          onFieldKeyChange={setSelectedFieldKey}
          document={selectedDocument}
          pdfUrl={pdfUrl}
        />

        <UploadModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} />

        <ExportModal
          open={isExportModalOpen}
          onOpenChange={setIsExportModalOpen}
          specs={sortedAndFiltered}
        />
      </div>
    </TooltipProvider>
  );
}

export default App;
