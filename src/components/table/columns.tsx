import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";
import { columnLayout } from "@/components/table/layout";
import { getFunctionStyle, getFunctionLabel } from "@/config/ingredientSpec.config";
import type { ExtractedIngredientSpec } from "@/types/ingredientSpec";

const helper = createColumnHelper<ExtractedIngredientSpec>();

export function buildColumns(documentMap: Map<string, string>) {
  return [
    helper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      size: columnLayout.checkbox.width,
      enableSorting: false,
    }),

    helper.accessor("product_name", {
      id: "product_name",
      header: "Product Name",
      size: columnLayout.product_name.width,
      meta: { fieldName: "product_name" },
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900 truncate block w-full">
          {row.original.product_name?.value || "—"}
        </span>
      ),
    }),

    helper.accessor("supplier", {
      id: "supplier",
      header: "Supplier",
      size: columnLayout.supplier.width,
      meta: { fieldName: "supplier" },
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 truncate block w-full">
          {row.original.supplier?.value || "—"}
        </span>
      ),
    }),

    helper.accessor("ingredient_function", {
      id: "ingredient_function",
      header: "Function",
      size: columnLayout.ingredient_function.width,
      meta: { fieldName: "ingredient_function" },
      cell: ({ row }) => {
        const val = row.original.ingredient_function?.value;
        return <span className={getFunctionStyle(val)}>{getFunctionLabel(val)}</span>;
      },
    }),

    helper.accessor("allergens", {
      id: "allergens",
      header: "Allergens",
      size: columnLayout.allergens.width,
      meta: { fieldName: "allergens" },
      cell: ({ row }) => {
        const val = row.original.allergens?.value;
        const isEmpty = !val || val === "None" || val === "N/A";
        if (isEmpty) return <span className="text-gray-400 text-sm">—</span>;
        return (
          <div className="flex items-center gap-1 min-w-0">
            <AlertTriangle className="size-3 text-amber-500 shrink-0" />
            <span className="text-sm text-gray-700 truncate">{val}</span>
          </div>
        );
      },
    }),

    helper.accessor("cas_number", {
      id: "cas_number",
      header: "CAS #",
      size: columnLayout.cas_number.width,
      meta: { fieldName: "cas_number" },
      cell: ({ row }) => (
        <span className="text-xs font-mono text-gray-600 truncate block w-full">
          {row.original.cas_number?.value || "—"}
        </span>
      ),
    }),

    helper.accessor("typical_use_level", {
      id: "typical_use_level",
      header: "Use Level",
      size: columnLayout.typical_use_level.width,
      meta: { fieldName: "typical_use_level" },
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 truncate block w-full">
          {row.original.typical_use_level?.value || "—"}
        </span>
      ),
    }),

    helper.accessor("typical_applications", {
      id: "typical_applications",
      header: "Applications",
      size: columnLayout.typical_applications.width,
      meta: { fieldName: "typical_applications" },
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 truncate block w-full">
          {row.original.typical_applications?.value || "—"}
        </span>
      ),
    }),

    helper.accessor("ph", {
      id: "ph",
      header: "pH",
      size: columnLayout.ph.width,
      meta: { fieldName: "ph" },
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.original.ph?.value || "—"}
        </span>
      ),
    }),

    helper.accessor("kosher", {
      id: "kosher",
      header: "Kosher",
      size: columnLayout.kosher.width,
      meta: { fieldName: "kosher" },
      cell: ({ row }) => {
        const val = row.original.kosher?.value;
        if (val?.toLowerCase() === "yes")
          return <span className="text-xs font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">Yes</span>;
        return <span className="text-gray-400 text-sm">—</span>;
      },
    }),

    helper.accessor("halal", {
      id: "halal",
      header: "Halal",
      size: columnLayout.halal.width,
      meta: { fieldName: "halal" },
      cell: ({ row }) => {
        const val = row.original.halal?.value;
        if (val?.toLowerCase() === "yes")
          return <span className="text-xs font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">Yes</span>;
        return <span className="text-gray-400 text-sm">—</span>;
      },
    }),

    helper.accessor("non_gmo", {
      id: "non_gmo",
      header: "Non-GMO",
      size: columnLayout.non_gmo.width,
      meta: { fieldName: "non_gmo" },
      cell: ({ row }) => {
        const val = row.original.non_gmo?.value;
        if (val?.toLowerCase() === "yes")
          return <span className="text-xs font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">Yes</span>;
        return <span className="text-gray-400 text-sm">—</span>;
      },
    }),

    helper.accessor("shelf_life_months", {
      id: "shelf_life_months",
      header: "Shelf Life",
      size: columnLayout.shelf_life_months.width,
      meta: { fieldName: "shelf_life_months" },
      cell: ({ row }) => {
        const val = row.original.shelf_life_months?.value;
        return (
          <span className="text-sm text-gray-600">
            {val ? `${val} mo` : "—"}
          </span>
        );
      },
    }),

    helper.display({
      id: "source_doc",
      header: "Source",
      size: columnLayout.source_doc.width,
      enableSorting: false,
      cell: ({ row }) => {
        const docName = documentMap.get(row.original.specDocumentId);
        if (!docName) return <span className="text-gray-400 text-sm">—</span>;
        return (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded truncate block max-w-full">
            {docName}
          </span>
        );
      },
    }),
  ];
}
