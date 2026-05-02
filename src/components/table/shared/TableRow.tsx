import { type Row } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { TableCell } from "./TableCell";

interface TableRowProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: Row<any>;
  onClick?: (fieldKey?: string) => void;
  isSelected?: boolean;
  selectedFieldKey?: string | null;
  actions?: React.ReactNode;
  className?: string;
  cellOverlay?: (fieldKey: string) => React.ReactNode;
  cellPrefix?: (fieldKey: string) => React.ReactNode;
  density?: "default" | "compact";
  isExpanded?: boolean;
}

export function TableRow({
  row,
  onClick,
  isSelected,
  selectedFieldKey,
  actions,
  className,
  cellOverlay,
  cellPrefix,
  density = "default",
  isExpanded = false,
}: TableRowProps) {
  const isChecked = row.getIsSelected?.() ?? false;
  const theme = isExpanded ? "dark" : "default";

  const rowBg = isExpanded
    ? "bg-gray-800 border-gray-700 text-white [&_*]:text-inherit"
    : cn(
        "border-gray-100",
        isSelected ? "shadow-md z-10" : isChecked ? "bg-blue-50" : "bg-white",
      );

  return (
    <div
      className={cn(
        "flex border-b transition-colors duration-150 relative group",
        rowBg,
        className,
      )}
    >
      {row.getVisibleCells().map((cell) => {
        const fieldName = cell.column.columnDef.meta?.fieldName as string | undefined;
        const isFieldSelected = isSelected && selectedFieldKey && fieldName === selectedFieldKey;
        const overlay = fieldName && cellOverlay ? cellOverlay(fieldName) : undefined;
        const prefix = fieldName && cellPrefix ? cellPrefix(fieldName) : undefined;

        return (
          <TableCell
            key={cell.id}
            cell={cell}
            isFieldSelected={!!isFieldSelected}
            onClick={onClick}
            overlay={overlay}
            prefix={prefix}
            density={density}
            theme={theme}
          />
        );
      })}
      {actions}
    </div>
  );
}
