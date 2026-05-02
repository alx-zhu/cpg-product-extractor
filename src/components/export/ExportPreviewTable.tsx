import type { ExtractedIngredientSpec } from "@/types/ingredientSpec";
import type { ExportColumn } from "@/utils/export";
import { cn } from "@/utils/cn";

interface ExportPreviewTableProps {
  specs: ExtractedIngredientSpec[];
  columns: ExportColumn[];
}

export function ExportPreviewTable({ specs, columns }: ExportPreviewTableProps) {
  const enabledColumns = columns.filter((c) => c.enabled);

  if (enabledColumns.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
        No columns selected
      </div>
    );
  }

  const preview = specs.slice(0, 50);

  return (
    <div className="flex-1 overflow-auto min-h-0">
      <table className="w-max border-collapse text-xs">
        <thead>
          <tr className="bg-gray-50 sticky top-0">
            {enabledColumns.map((col) => (
              <th
                key={col.key}
                className="px-3 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap border-b border-r border-gray-200 last:border-r-0 min-w-[100px] max-w-[200px]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {preview.map((spec, i) => (
            <tr
              key={spec.id}
              className={cn("border-b border-gray-100", i % 2 === 0 ? "bg-white" : "bg-gray-50/50")}
            >
              {enabledColumns.map((col) => {
                const val =
                  (spec as unknown as Record<string, { value?: string } | undefined>)[col.key]?.value ?? "";
                const isEmpty = !val || val === "N/A";
                return (
                  <td
                    key={col.key}
                    className={cn(
                      "px-3 py-2 whitespace-nowrap border-r border-gray-100 last:border-r-0 min-w-[100px] max-w-[200px]",
                      isEmpty ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    <span className="truncate block">{isEmpty ? "—" : val}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {specs.length > 50 && (
        <p className="px-4 py-2 text-xs text-gray-400 text-center border-t border-gray-100">
          Showing first 50 of {specs.length} rows
        </p>
      )}
    </div>
  );
}
