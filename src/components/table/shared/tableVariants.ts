import { cva } from "class-variance-authority";

const hoverOverlay =
  "after:absolute after:inset-0 after:pointer-events-none after:transition-colors hover:after:bg-black/4";

export const cellVariants = cva(
  "px-3 flex items-center border-r last:border-r-0 box-border group relative overflow-hidden",
  {
    variants: {
      column: {
        checkbox: "justify-center",
        expand: "justify-center px-0",
        sourceAction: "justify-center px-0",
        product_name: "",
        data: "",
      },
      density: {
        default: "py-3",
        compact: "py-2 text-xs",
      },
      theme: {
        default: "border-gray-100",
        dark: "border-gray-700",
      },
      selected: {
        true: "bg-blue-50 font-semibold",
        false: "",
      },
      interactive: {
        true: `cursor-pointer ${hoverOverlay}`,
        false: "",
      },
    },
    defaultVariants: {
      column: "data",
      density: "default",
      theme: "default",
      selected: false,
      interactive: false,
    },
  },
);

export const headerCellVariants = cva(
  "px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center border-r border-gray-200 last:border-r-0",
  {
    variants: {
      column: {
        checkbox: "justify-center",
        expand: "px-0",
        sourceAction: "px-0",
        product_name: "",
        data: "",
      },
    },
    defaultVariants: { column: "data" },
  },
);
