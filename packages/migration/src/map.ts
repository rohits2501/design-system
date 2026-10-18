import { colorVarName } from "@house/tokens";
import { legacyHex } from "./legacy-colors.ts";
import { legacyStyleKey } from "./legacy-style-keys.ts";
import { isPaletteUtility, legacyUtility, stripVariants, variantsOf } from "./legacy-utilities.ts";
import { deprecated, targetRole, type Mapping, type Role, type Usage } from "./types.ts";

const roleByVar = new Map(Object.entries(colorVarName).map(([r, name]) => [name, r as Role]));
const roleNames = new Set(Object.keys(colorVarName));

/** Lower case `#rrggbb`. `#abc` expands to `#aabbcc`. */
export function normalizeHex(value: string): string {
  const hex = value.toLowerCase();
  return hex.length === 4 ? hex.replace(/[0-9a-f]/g, (c) => c + c) : hex;
}

/** The mapping for a legacy hex used as `usage`, or undefined when the inventory has no entry. */
export function mapHex(value: string, usage: Usage): Mapping | undefined {
  const entry = legacyHex[normalizeHex(value)];
  if (!entry) return undefined;
  return "kind" in entry ? (entry as Mapping) : (entry as Partial<Record<Usage, Mapping>>)[usage];
}

/** The mapping for a utility class, handling `hover:` style variants and dropping `dark:` ones. */
export function mapUtility(className: string): Mapping | undefined {
  if (variantsOf(className).includes("dark") && isPaletteUtility(className)) {
    return deprecated(null, "Themes switch through data-theme. Drop dark: color utilities.");
  }
  return legacyUtility[stripVariants(className)];
}

export function mapStyleKey(key: string): Mapping | undefined {
  return legacyStyleKey[key];
}

/** Which kind of color slot a CSS property or style object key fills. */
export function usageOf(property: string): Usage {
  const p = property.toLowerCase();
  if (p === "color") return "text";
  if (p.startsWith("border") || p.startsWith("outline") || p === "stroke") return "border";
  return "background";
}

export interface Finding {
  source: string;
  mapping: Mapping | undefined;
}

const HEX = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
const DECLARATION = /([a-zA-Z-]+)\s*:\s*([^;}\n]+)/g;
const CLASS_LIST = /className\s*=\s*["'`{]([^"'`}]+)["'`}]/g;
const THEME_KEY = /\b(?:colors|palette)\.([a-zA-Z]+)/g;

/** Every legacy color reference in a snippet, with its mapping (undefined = unmapped). */
export function findLegacy(text: string): Finding[] {
  const findings: Finding[] = [];
  for (const [, property = "", value = ""] of text.matchAll(DECLARATION)) {
    // Inside a JS theme object (`onPrimary: "#ffffff"`) the key names the role, not the hex.
    const themeKey = /^\s*["'`]/.test(value) ? mapStyleKey(property) : undefined;
    for (const [hex] of value.matchAll(HEX)) {
      findings.push({
        source: `${property}: ${hex}`,
        mapping: themeKey ?? mapHex(hex, usageOf(property)),
      });
    }
  }
  for (const [, list = ""] of text.matchAll(CLASS_LIST)) {
    for (const cls of list.split(/\s+/).filter(isPaletteUtility)) {
      findings.push({ source: cls, mapping: mapUtility(cls) });
    }
  }
  for (const [, key = ""] of text.matchAll(THEME_KEY)) {
    findings.push({ source: `colors.${key}`, mapping: mapStyleKey(key) });
  }
  return findings;
}

/** Roles a correct migration of `before` must reference. */
export function expectedRoles(before: string): Set<Role> {
  const roles = new Set<Role>();
  for (const { mapping } of findLegacy(before)) {
    const r = mapping && targetRole(mapping);
    if (r) roles.add(r);
  }
  return roles;
}

const STATUSES = ["success", "warning", "danger", "info"] as const;

/** Roles each @house/react primitive draws with, so a rewrite onto primitives counts its roles. */
const primitiveRoles: Array<[RegExp, Role[]]> = [
  [/<Button\b[^>]*variant="primary"/, ["accent", "accentContrast", "focusRing"]],
  [/<Button\b[^>]*variant="danger"/, ["danger", "dangerSubtle", "focusRing"]],
  [/<Button\b(?![^>]*variant=)/, ["surface", "text", "borderStrong", "focusRing"]],
  [/<Surface\b(?![^>]*status=)/, ["surface", "border", "text"]],
  [/<Text\b(?![^>]*(?:tone|status)=)/, ["text"]],
  [/<Text\b[^>]*tone="muted"/, ["textMuted"]],
  [/<Text\b[^>]*tone="accent"/, ["accent"]],
  [/<Field\b/, ["surface", "text", "borderStrong", "focusRing"]],
  ...STATUSES.flatMap((s): Array<[RegExp, Role[]]> => [
    [new RegExp(`<Surface\\b[^>]*status="${s}"`), [s, `${s}Subtle`]],
    [new RegExp(`<Text\\b[^>]*status="${s}"`), [s]],
  ]),
];

/**
 * Roles a snippet uses: `var(--role)`, `color.role` on the token object, or a primitive that
 * draws with that role.
 */
export function rolesUsed(after: string): Set<Role> {
  const roles = new Set<Role>();
  for (const [pattern, drawn] of primitiveRoles) {
    if (pattern.test(after)) for (const r of drawn) roles.add(r);
  }
  for (const [, name = ""] of after.matchAll(/var\((--[a-z-]+)\)/g)) {
    const r = roleByVar.get(name);
    if (r) roles.add(r);
  }
  for (const [, key = ""] of after.matchAll(/\bcolor\.([a-zA-Z]+)/g)) {
    if (roleNames.has(key)) roles.add(key as Role);
  }
  return roles;
}

/**
 * Score a candidate rewrite (by hand or by a codemod) against the expected roles.
 * 1 means every expected role is used and nothing extra; leftover legacy references count as misses.
 */
export function scoreRewrite(
  before: string,
  candidate: string,
): { score: number; missing: Role[]; extra: Role[]; leftovers: string[] } {
  const expected = expectedRoles(before);
  const used = rolesUsed(candidate);
  const missing = [...expected].filter((r) => !used.has(r));
  const extra = [...used].filter((r) => !expected.has(r));
  const leftovers = findLegacy(candidate).map((f) => f.source);
  const total = expected.size + extra.length + leftovers.length;
  const score = total === 0 ? 1 : (expected.size - missing.length) / total;
  return { score, missing, extra, leftovers };
}
