import { flexRender, type Cell } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { getColumnType, getColumnWidth } from "@/styles/tableLayout";
import { cellVariants } from "./tableVariants";

type ColumnVariant = "checkbox" | "expand" | "sourceAction" | "product_name" | "data";

interface TableCellProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cell: Cell<any, unknown>;
  isFieldSelected: boolean;
  onClick?: (fieldKey?: string) => void;
  overlay?: React.ReactNode;
  prefix?: React.ReactNode;
  density?: "default" | "compact";
  theme?: "default" | "dark";
}

export function TableCell({
  cell,
  isFieldSelected,
  onClick,
  overlay,
  prefix,
  density = "default",
  theme = "default",
}: TableCellProps) {
  const columnType = getColumnType(cell.column.id) as ColumnVariant;
  const width = getColumnWidth(cell.column.id) ?? cell.column.columnDef.size;
  const fieldName = cell.column.columnDef.meta?.fieldName as string | undefined;

  if (!cell.row || !cell.row.original) {
    return (
      <div
        className={cellVariants({ column: columnType })}
        style={{ width: width ? `${width}px` : undefined, minWidth: width ? `${width}px` : undefined }}
      >
        <span className="text-gray-400">—</span>
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const overrideField = target.closest<HTMLElement>("[data-field]")?.dataset.field;
    if (overrideField) {
      e.stopPropagation();
      onClick?.(overrideField);
    } else if (fieldName) {
      e.stopPropagation();
      onClick?.(fieldName);
    } else if (columnType !== "checkbox") {
      onClick?.();
    }
  };

  return (
    <div
      className={cn(
        cellVariants({
          column: columnType,
          density,
          theme,
          selected: isFieldSelected,
          interactive: !!fieldName,
        }),
        "group/cell",
        prefix && "gap-2",
      )}
      style={{ width: width ? `${width}px` : undefined, minWidth: width ? `${width}px` : undefined }}
      onClick={handleClick}
    >
      {prefix}
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
      {overlay}
    </div>
  );
}
