import { cn } from "@/utils/cn";
import type { SidebarFunction } from "@/hooks/useSidebarFilter";

interface ExportFilterSidebarProps {
  functions: SidebarFunction[];
  unclassifiedCount: number;
  totalCount: number;
  selectedFunctions: Set<string>;
  includeUnclassified: boolean;
  onToggleFunction: (value: string) => void;
  onToggleUnclassified: () => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function ExportFilterSidebar({
  functions,
  unclassifiedCount,
  totalCount,
  selectedFunctions,
  includeUnclassified,
  onToggleFunction,
  onToggleUnclassified,
  onSelectAll,
  onClearAll,
}: ExportFilterSidebarProps) {
  const allSelected =
    selectedFunctions.size === functions.length &&
    (unclassifiedCount === 0 || includeUnclassified);

  return (
    <div className="w-52 shrink-0 border-r border-gray-200 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          Function
        </span>
        <button
          onClick={allSelected ? onClearAll : onSelectAll}
          className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
        >
          {allSelected ? "Clear" : "All"}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <div className="space-y-0.5">
          {functions.map((fn) => {
            const isSelected = selectedFunctions.has(fn.value);
            return (
              <button
                key={fn.value}
                onClick={() => onToggleFunction(fn.value)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-left text-[13px] transition-colors rounded-md cursor-pointer",
                  isSelected
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50",
                )}
              >
                <span className="truncate">{fn.label}</span>
                <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium tabular-nums shrink-0 bg-gray-100 text-gray-500">
                  {fn.count}
                </span>
              </button>
            );
          })}

          {unclassifiedCount > 0 && (
            <button
              onClick={onToggleUnclassified}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-left text-[13px] transition-colors rounded-md cursor-pointer",
                includeUnclassified
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-500 hover:bg-gray-50",
              )}
            >
              <span>Unclassified</span>
              <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium tabular-nums shrink-0 bg-gray-100 text-gray-500">
                {unclassifiedCount}
              </span>
            </button>
          )}
        </div>
      </nav>

      <div className="px-4 py-3 border-t border-gray-200">
        <p className="text-[11px] text-gray-400 tabular-nums">
          {totalCount} spec{totalCount !== 1 ? "s" : ""} total
        </p>
      </div>
    </div>
  );
}
