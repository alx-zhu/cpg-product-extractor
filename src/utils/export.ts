import type { ExtractedIngredientSpec, IngredientSpecFieldKey } from "@/types/ingredientSpec";

export interface ExportColumn {
  key: IngredientSpecFieldKey;
  label: string;
  enabled: boolean;
}

export const DEFAULT_EXPORT_COLUMNS: ExportColumn[] = [
  { key: "product_name",         label: "Product Name",       enabled: true  },
  { key: "supplier",             label: "Supplier",           enabled: true  },
  { key: "ingredient_function",  label: "Function",           enabled: true  },
  { key: "allergens",            label: "Allergens",          enabled: true  },
  { key: "cas_number",           label: "CAS #",              enabled: true  },
  { key: "e_number",             label: "E-Number",           enabled: true  },
  { key: "typical_use_level",    label: "Use Level",          enabled: true  },
  { key: "typical_applications", label: "Applications",       enabled: true  },
  { key: "ph",                   label: "pH",                 enabled: true  },
  { key: "kosher",               label: "Kosher",             enabled: true  },
  { key: "halal",                label: "Halal",              enabled: true  },
  { key: "non_gmo",              label: "Non-GMO",            enabled: true  },
  { key: "shelf_life_months",    label: "Shelf Life (mo)",    enabled: true  },
  { key: "storage_conditions",   label: "Storage",            enabled: false },
  { key: "packaging_size",       label: "Packaging",          enabled: false },
  { key: "description",          label: "Description",        enabled: false },
  { key: "regulatory_status",    label: "Regulatory",         enabled: false },
];

function escapeCSVField(value: string): string {
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportSpecsToCSV(
  specs: ExtractedIngredientSpec[],
  columns: ExportColumn[],
): string {
  const enabled = columns.filter((c) => c.enabled);
  const headers = enabled.map((c) => escapeCSVField(c.label));
  const rows = specs.map((spec) =>
    enabled.map((c) => {
      const val = (spec as unknown as Record<string, { value?: string } | undefined>)[c.key]?.value ?? "";
      return escapeCSVField(val);
    }),
  );
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function downloadCSV(csvContent: string, filename: string = "export"): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
