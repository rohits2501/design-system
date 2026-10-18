import { deprecated, role, type Mapping, type Usage } from "./types.ts";

/**
 * A generic legacy palette: the kind of hex inventory an older app accumulates.
 * Keyed by lower case `#rrggbb`. An entry is either one mapping, or one per usage when the same
 * value means different things as a fill, as text, and as an edge.
 */
export const legacyHex: Record<string, Mapping | Partial<Record<Usage, Mapping>>> = {
  "#ffffff": { background: role("surface"), text: role("accentContrast"), border: role("border") },
  "#fafafa": role("bg"),
  "#f5f5f5": role("bgSubtle"),
  "#000000": deprecated("text", "Pure black is replaced by the text role."),
  "#212121": role("text"),
  "#757575": role("textMuted"),
  "#e0e0e0": role("border"),
  "#bdbdbd": role("borderStrong"),
  "#1976d2": role("accent"),
  "#1565c0": deprecated("accent", "Hover shades come from the primitive, not a second hex."),
  "#e3f2fd": role("accentSubtle"),
  "#3b82f6": deprecated("accent", "A second blue. The system has one accent."),
  "#2e7d32": { text: role("success"), background: role("success"), border: role("success") },
  "#edf7ed": role("successSubtle"),
  "#ed6c02": role("warning"),
  "#fff4e5": role("warningSubtle"),
  "#d32f2f": role("danger"),
  "#fdeded": role("dangerSubtle"),
  "#0288d1": role("info"),
  "#e5f6fd": role("infoSubtle"),
  "#ff00ff": deprecated(null, "Debug color. Delete it."),
};
