import { cn } from "@/lib/utils";
import type { ExportColumn } from "@/utils/export";

interface ExportColumnBarProps {
  columns: ExportColumn[];
  onToggle: (key: string) => void;
  onEnableAll: () => void;
}

export function ExportColumnBar({ columns, onToggle, onEnableAll }: ExportColumnBarProps) {
  const allEnabled = columns.every((c) => c.enabled);

  return (
    <div className="border-b border-gray-200 bg-gray-50 px-4 py-2.5 flex items-center gap-3 shrink-0">
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest shrink-0">
        Columns
      </span>
      <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
        {columns.map((col) => (
          <button
            key={col.key}
            onClick={() => onToggle(col.key)}
            className={cn(
              "text-[11px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer",
              col.enabled
                ? "border-blue-300 bg-blue-50 text-blue-700 font-medium"
                : "border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600",
            )}
          >
            {col.label}
          </button>
        ))}
      </div>
      {!allEnabled && (
        <button
          onClick={onEnableAll}
          className="text-[11px] text-blue-600 hover:text-blue-700 font-medium shrink-0"
        >
          Enable all
        </button>
      )}
    </div>
  );
}
