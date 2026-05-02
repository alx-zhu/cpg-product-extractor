import { useState, useCallback, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  type RowSelectionState,
} from "@tanstack/react-table";
import type { ExtractedIngredientSpec, IngredientSpecFieldKey } from "@/types/ingredientSpec";
import type { SortConfig } from "@/components/table/shared/sorting";
import { buildColumns } from "./columns";
import { TableRow } from "@/components/table/shared/TableRow";
import { ColumnHeaders } from "@/components/table/shared/ColumnHeaders";
import { BulkActionBar } from "@/components/table/shared/BulkActionBar";
import { SelectAllBanner } from "@/components/table/shared/SelectAllBanner";
import { TableToolbar } from "./header/TableToolbar";
import { TablePagination } from "./footer/TablePagination";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpecsTableProps {
  data: ExtractedIngredientSpec[];
  selectedSpecId?: string | null;
  selectedFieldKey?: IngredientSpecFieldKey | null;
  onViewSource?: (spec: ExtractedIngredientSpec, fieldKey?: IngredientSpecFieldKey) => void;
  onSelectionChange?: (specs: ExtractedIngredientSpec[]) => void;
  selectionKey?: number;
  documentMap?: Map<string, string>;
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterToggle: () => void;
  activeFilterLabel: string | null;
  onClearFilter: () => void;
  onExportSelection: (specs: ExtractedIngredientSpec[]) => void;
  onUploadClick?: () => void;
}

const PAGE_SIZE_DEFAULT = 25;

export function SpecsTable({
  data,
  selectedSpecId,
  selectedFieldKey,
  onViewSource,
  onSelectionChange,
  selectionKey,
  documentMap = new Map(),
  sortConfig,
  onSortChange,
  searchQuery,
  onSearchChange,
  onFilterToggle,
  activeFilterLabel,
  onClearFilter,
  onExportSelection,
  onUploadClick,
}: SpecsTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectAllMode, setSelectAllMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);

  const columns = useMemo(() => buildColumns(documentMap), [documentMap]);

  const pageCount = Math.ceil(data.length / pageSize);
  // pagedData must be memoized. An unstable reference causes getCoreRowModel's
  // utils.memo to rebuild on every render, which fires its onChange callback
  // (_autoResetPageIndex → setPagination → makeStateUpdater → table.setState →
  // useReactTable's internal React setState), which re-renders this component,
  // which creates another new slice reference — an infinite loop.
  const pagedData = useMemo(
    () => data.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [data, currentPage, pageSize],
  );
  // tableState must be memoized for the same reason: an unstable options.state
  // object causes unnecessary work in setOptions' state merging on every render.
  const tableState = useMemo(() => ({ rowSelection }), [rowSelection]);

  const table = useReactTable({
    data: pagedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    state: tableState,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [data.length, searchQuery]);

  useEffect(() => {
    setRowSelection({});
    setSelectAllMode(false);
  }, [selectionKey]);

  useEffect(() => {
    const selectedIds = selectAllMode
      ? data.map((s) => s.id)
      : Object.keys(rowSelection).filter((id) => rowSelection[id]);
    const selected = data.filter((s) => selectedIds.includes(s.id));
    onSelectionChange?.(selected);
  }, [rowSelection, selectAllMode, data, onSelectionChange]);

  const isPageFullySelected =
    pagedData.length > 0 && pagedData.every((s) => rowSelection[s.id]);

  const selectedSpecs = selectAllMode
    ? data
    : data.filter((s) => rowSelection[s.id]);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
    setSelectAllMode(false);
  }, []);

  const handleRowClick = useCallback(
    (spec: ExtractedIngredientSpec, fieldKey?: string) => {
      onViewSource?.(spec, fieldKey as IngredientSpecFieldKey | undefined);
    },
    [onViewSource],
  );

  const isEmpty = data.length === 0;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      <TableToolbar
        sortConfig={sortConfig}
        onSortChange={onSortChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onFilterToggle={onFilterToggle}
        activeFilterLabel={activeFilterLabel}
        onClearFilter={onClearFilter}
      />

      {isPageFullySelected && !selectAllMode && data.length > pagedData.length && (
        <SelectAllBanner
          selectAllMode={false}
          pageCount={pagedData.length}
          totalCount={data.length}
          onSelectAll={() => setSelectAllMode(true)}
          onClearSelectAll={handleClearSelection}
        />
      )}
      {selectAllMode && (
        <SelectAllBanner
          selectAllMode
          pageCount={pagedData.length}
          totalCount={data.length}
          onSelectAll={() => setSelectAllMode(true)}
          onClearSelectAll={handleClearSelection}
        />
      )}

      <div className="relative flex-1 overflow-hidden">
        <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          <div className="min-w-min">
            <ColumnHeaders
              headerGroups={table.getHeaderGroups()}
              sortConfig={sortConfig}
              onSortChange={onSortChange}
            />

            {!isEmpty &&
              table.getRowModel().rows.map((row) => {
                const spec = row.original;
                const isSelected = selectedSpecId === spec.id;

                return (
                  <TableRow
                    key={row.id}
                    row={row}
                    onClick={(fieldKey) => handleRowClick(spec, fieldKey)}
                    isSelected={isSelected}
                    selectedFieldKey={isSelected ? selectedFieldKey : null}
                    className="cursor-pointer hover:bg-gray-50/50"
                  />
                );
              })}
          </div>
        </div>

        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-3 pointer-events-auto">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Upload className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">No specs yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Upload a spec sheet to start extracting ingredients
                </p>
              </div>
              {onUploadClick && (
                <Button size="sm" onClick={onUploadClick} className="gap-2 mt-1">
                  <Upload className="h-4 w-4" />
                  Upload Spec Sheets
                </Button>
              )}
            </div>
          </div>
        )}

        <BulkActionBar
          selectedSpecs={selectedSpecs}
          onClearSelection={handleClearSelection}
          onExport={onExportSelection}
        />
      </div>

      {!isEmpty && (
        <TablePagination
          totalItems={data.length}
          pageSize={pageSize}
          onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
          currentPage={currentPage}
          totalPages={Math.max(1, pageCount)}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
