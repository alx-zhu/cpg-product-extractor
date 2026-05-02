import { flexRender, type HeaderGroup } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { getColumnType, getColumnWidth } from "@/components/table/layout";
import { headerCellVariants } from "./tableVariants";
import { type SortConfig, DEFAULT_SORT } from "./sorting";

type ColumnVariant = "checkbox" | "expand" | "sourceAction" | "product_name" | "data";

function SortIcon({ direction }: { direction: "asc" | "desc" | null }) {
  if (direction === "asc") return <ArrowUp className="size-3 text-gray-600 shrink-0" />;
  if (direction === "desc") return <ArrowDown className="size-3 text-gray-600 shrink-0" />;
  return (
    <ArrowUpDown className="size-3 text-gray-300 opacity-0 group-hover/sort:opacity-100 transition-opacity shrink-0" />
  );
}

interface ColumnHeadersProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headerGroups: HeaderGroup<any>[];
  sortConfig?: SortConfig;
  onSortChange?: (config: SortConfig) => void;
}

export function ColumnHeaders({ headerGroups, sortConfig, onSortChange }: ColumnHeadersProps) {
  const handleHeaderClick = (columnId: string) => {
    if (!onSortChange) return;
    if (sortConfig?.columnId === columnId) {
      if (sortConfig.direction === "asc") {
        onSortChange({ columnId, direction: "desc" });
      } else {
        onSortChange(DEFAULT_SORT);
      }
    } else {
      onSortChange({ columnId, direction: "asc" });
    }
  };

  return (
    <div className="flex bg-gray-50 border-b border-gray-200 sticky top-0 z-50">
      {headerGroups.map((headerGroup) =>
        headerGroup.headers.map((header) => {
          const columnType = getColumnType(header.column.id) as ColumnVariant;
          const width = getColumnWidth(header.column.id) ?? header.column.columnDef.size;
          const isSortable = header.column.columnDef.enableSorting !== false;
          const isActiveSort = sortConfig?.columnId === header.column.id;
          const sortDirection = isActiveSort ? sortConfig.direction : null;

          return (
            <div
              key={header.id}
              className={headerCellVariants({ column: columnType })}
              style={{
                width: width ? `${width}px` : undefined,
                minWidth: width ? `${width}px` : undefined,
              }}
            >
              {isSortable && onSortChange ? (
                <button
                  type="button"
                  className="flex items-center gap-1 group/sort cursor-pointer select-none"
                  onClick={() => handleHeaderClick(header.column.id)}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <SortIcon direction={sortDirection} />
                </button>
              ) : (
                flexRender(header.column.columnDef.header, header.getContext())
              )}
            </div>
          );
        }),
      )}
    </div>
  );
}
