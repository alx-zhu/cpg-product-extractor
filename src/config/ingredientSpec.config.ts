export const BADGE_BASE =
  "px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap";

export const INGREDIENT_FUNCTION_TYPES = [
  { value: "stabilizer",   label: "Stabilizer",   style: "bg-blue-100 text-blue-800" },
  { value: "protein",      label: "Protein",       style: "bg-green-100 text-green-800" },
  { value: "hydrocolloid", label: "Hydrocolloid",  style: "bg-purple-100 text-purple-800" },
  { value: "emulsifier",   label: "Emulsifier",    style: "bg-amber-100 text-amber-800" },
  { value: "sweetener",    label: "Sweetener",     style: "bg-pink-100 text-pink-800" },
  { value: "flavor",       label: "Flavor",        style: "bg-violet-100 text-violet-800" },
  { value: "vitamin",      label: "Vitamin",       style: "bg-sky-100 text-sky-800" },
  { value: "mineral",      label: "Mineral",       style: "bg-orange-100 text-orange-800" },
  { value: "texture",      label: "Texture",       style: "bg-teal-100 text-teal-800" },
  { value: "other",        label: "Other",         style: "bg-gray-100 text-gray-700" },
] as const;

export type IngredientFunctionValue = (typeof INGREDIENT_FUNCTION_TYPES)[number]["value"];

export const INGREDIENT_FUNCTION_MAP = new Map(
  INGREDIENT_FUNCTION_TYPES.map((t) => [t.value, t]),
);

export function getFunctionStyle(value: string | undefined): string {
  if (!value) return BADGE_BASE + " " + "bg-gray-100 text-gray-700";
  const normalized = value.trim().toLowerCase();
  const match = INGREDIENT_FUNCTION_MAP.get(normalized as IngredientFunctionValue);
  return BADGE_BASE + " " + (match?.style ?? "bg-gray-100 text-gray-700");
}

export function getFunctionLabel(value: string | undefined): string {
  if (!value) return "—";
  const normalized = value.trim().toLowerCase();
  const match = INGREDIENT_FUNCTION_MAP.get(normalized as IngredientFunctionValue);
  return match?.label ?? value;
}
