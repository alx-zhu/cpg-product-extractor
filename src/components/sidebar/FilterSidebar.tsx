import { cn } from "@/utils/cn";
import type { SidebarFilter, SidebarFunction } from "@/hooks/useSidebarFilter";

interface FilterSidebarProps {
  isOpen: boolean;
  functions: SidebarFunction[];
  activeFilter: SidebarFilter;
  unclassifiedCount: number;
  totalCount: number;
  onFunctionClick: (value: string) => void;
  onUnclassifiedClick: () => void;
  onClearFilter: () => void;
}

export function FilterSidebar({
  isOpen,
  functions,
  activeFilter,
  unclassifiedCount,
  totalCount,
  onFunctionClick,
  onUnclassifiedClick,
  onClearFilter,
}: FilterSidebarProps) {
  const isAllActive = activeFilter === null;

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-[width] duration-300 ease-in-out shrink-0",
        isOpen ? "w-56" : "w-0",
      )}
      role="navigation"
      aria-label="Function filter"
    >
      <div className="w-56 min-w-56 flex flex-col h-full">
        <div className="px-5 py-4">
          <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Function
          </h3>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          <button
            onClick={onClearFilter}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-left text-[13px] transition-colors rounded-md cursor-pointer mb-1",
              isAllActive
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-gray-50",
            )}
          >
            <span>All Specs</span>
            <span className="ml-3 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium tabular-nums shrink-0 bg-gray-100 text-gray-500">
              {totalCount}
            </span>
          </button>

          <div className="mx-3 my-1.5 border-t border-gray-200" />

          {functions.length > 0 || unclassifiedCount > 0 ? (
            <div className="space-y-0.5">
              {functions.map((fn) => {
                const isActive =
                  activeFilter?.type === "function" && activeFilter.value === fn.value;
                return (
                  <button
                    key={fn.value}
                    onClick={() => onFunctionClick(fn.value)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-left text-[13px] transition-colors rounded-md cursor-pointer",
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    <span>{fn.label}</span>
                    <span className="ml-3 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium tabular-nums shrink-0 bg-gray-100 text-gray-500">
                      {fn.count}
                    </span>
                  </button>
                );
              })}

              {unclassifiedCount > 0 && (
                <button
                  onClick={onUnclassifiedClick}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-left text-[13px] transition-colors rounded-md cursor-pointer",
                    activeFilter?.type === "unclassified"
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-500 hover:bg-gray-50",
                  )}
                >
                  <span>Unclassified</span>
                  <span className="ml-3 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium tabular-nums shrink-0 bg-gray-100 text-gray-500">
                    {unclassifiedCount}
                  </span>
                </button>
              )}
            </div>
          ) : (
            <p className="px-4 py-8 text-sm text-gray-400 text-center">
              No specs yet
            </p>
          )}
        </nav>
      </div>
    </aside>
  );
}
