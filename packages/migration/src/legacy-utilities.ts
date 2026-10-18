import { deprecated, role, type Mapping } from "./types.ts";

/** Utility palette classes (Tailwind style) and the role each one becomes. */
export const legacyUtility: Record<string, Mapping> = {
  "bg-white": role("surface"),
  "bg-gray-50": role("bg"),
  "bg-gray-100": role("bgSubtle"),
  "bg-blue-600": role("accent"),
  "bg-blue-700": deprecated("accent", "Hover shades come from the primitive."),
  "bg-blue-50": role("accentSubtle"),
  "bg-green-50": role("successSubtle"),
  "bg-amber-50": role("warningSubtle"),
  "bg-red-50": role("dangerSubtle"),
  "bg-red-600": role("danger"),
  "bg-sky-50": role("infoSubtle"),
  "bg-indigo-500": deprecated("accent", "A second accent. The system has one."),
  "bg-pink-500": deprecated(null, "Decorative color with no role. Delete it."),
  "text-gray-900": role("text"),
  "text-gray-600": role("textMuted"),
  "text-gray-500": role("textMuted"),
  "text-blue-600": role("accent"),
  "text-white": role("accentContrast"),
  "text-green-700": role("success"),
  "text-amber-700": role("warning"),
  "text-red-600": role("danger"),
  "text-red-700": role("danger"),
  "text-sky-700": role("info"),
  "border-gray-200": role("border"),
  "border-gray-400": role("borderStrong"),
  "border-blue-600": role("accent"),
  "border-red-600": role("danger"),
  "ring-blue-500": role("focusRing"),
};

const PALETTE_UTILITY =
  /^(?:bg|text|border|ring|fill|stroke|divide|outline)-(?:white|black|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3})$/;

/** True for a utility class that hard codes a palette color. */
export function isPaletteUtility(className: string): boolean {
  return PALETTE_UTILITY.test(stripVariants(className));
}

/** `hover:bg-blue-700` → `bg-blue-700`. */
export function stripVariants(className: string): string {
  return className.slice(className.lastIndexOf(":") + 1);
}

/** Variant prefixes, e.g. `dark` and `hover` for `dark:hover:bg-gray-900`. */
export function variantsOf(className: string): string[] {
  const parts = className.split(":");
  return parts.slice(0, -1);
}
