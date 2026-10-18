import { readFileSync } from "node:fs";
import { colors } from "@house/tokens";
import { describe, expect, test } from "vite-plus/test";
// @ts-expect-error plain ESM script without type declarations
import { findRawColors } from "@house/tokens/check-raw-color";
import {
  expectedRoles,
  findLegacy,
  isPaletteUtility,
  legacyHex,
  legacyStyleKey,
  legacyUtility,
  mapHex,
  mapStyleKey,
  mapUtility,
  normalizeHex,
  rolesUsed,
  scoreRewrite,
  type Mapping,
  type Usage,
} from "../src/index.ts";

const fixture = (name: string) =>
  readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8");
const inventory = JSON.parse(fixture("inventory.json")) as {
  hex: Array<{ value: string; usage: Usage }>;
  utility: string[];
  styleKey: string[];
};
const roles = new Set(Object.keys(colors.light));

function assertValid(mapping: Mapping) {
  if (mapping.kind === "role") {
    expect(roles).toContain(mapping.role);
  } else {
    expect(mapping.reason.length).toBeGreaterThan(0);
    if (mapping.replacement) expect(roles).toContain(mapping.replacement);
  }
}

describe("the inventory is fully mapped or explicitly deprecated", () => {
  test.each(inventory.hex)("hex $value as $usage", ({ value, usage }) => {
    const mapping = mapHex(value, usage);
    expect(mapping, `${value} (${usage}) has no mapping`).toBeDefined();
    assertValid(mapping!);
  });

  test.each(inventory.utility)("utility %s", (cls) => {
    const mapping = mapUtility(cls);
    expect(mapping, `${cls} has no mapping`).toBeDefined();
    assertValid(mapping!);
  });

  test.each(inventory.styleKey)("style key %s", (key) => {
    const mapping = mapStyleKey(key);
    expect(mapping, `${key} has no mapping`).toBeDefined();
    assertValid(mapping!);
  });
});

test("every table entry points at a real role", () => {
  for (const entry of Object.values(legacyHex)) {
    if ("kind" in entry) assertValid(entry as Mapping);
    else for (const m of Object.values(entry)) assertValid(m as Mapping);
  }
  for (const m of [...Object.values(legacyUtility), ...Object.values(legacyStyleKey)])
    assertValid(m);
});

test("every table entry appears in the inventory, so the inventory is the full contract", () => {
  const normalized = new Set(inventory.hex.map((h) => normalizeHex(h.value)));
  expect(Object.keys(legacyHex).filter((h) => !normalized.has(h))).toEqual([]);
  const utilities = new Set(inventory.utility.map((c) => c.slice(c.lastIndexOf(":") + 1)));
  expect(Object.keys(legacyUtility).filter((c) => !utilities.has(c))).toEqual([]);
  expect(Object.keys(legacyStyleKey).filter((k) => !inventory.styleKey.includes(k))).toEqual([]);
});

test("context decides a shared hex: white fill is surface, white text is accent contrast", () => {
  expect(mapHex("#fff", "background")).toEqual({ kind: "role", role: "surface" });
  expect(mapHex("#FFFFFF", "text")).toEqual({ kind: "role", role: "accentContrast" });
});

test("dark: color utilities are deprecated, since themes switch through data-theme", () => {
  expect(mapUtility("dark:bg-gray-900")).toMatchObject({ kind: "deprecated", replacement: null });
  expect(mapUtility("hover:bg-blue-700")).toMatchObject({
    kind: "deprecated",
    replacement: "accent",
  });
});

test("isPaletteUtility recognizes hard coded palette classes only", () => {
  expect(isPaletteUtility("bg-blue-600")).toBe(true);
  expect(isPaletteUtility("dark:text-gray-100")).toBe(true);
  expect(isPaletteUtility("text-sm")).toBe(false);
  expect(isPaletteUtility("bg-[var(--accent)]")).toBe(false);
});

describe.each([
  ["raw-hex", "css"],
  ["utility-class", "tsx"],
  ["style-object", "ts"],
])("%s snippet pair", (name, ext) => {
  const before = fixture(`snippets/${name}.before.${ext}`);
  const after = fixture(`snippets/${name}.after.${ext}`);

  test("every legacy reference in the before snippet is mapped", () => {
    const unmapped = findLegacy(before).filter((f) => !f.mapping);
    expect(unmapped.map((f) => f.source)).toEqual([]);
    expect(findLegacy(before).length).toBeGreaterThan(0);
  });

  test("the after snippet uses exactly the roles the map expects", () => {
    expect([...rolesUsed(after)].sort()).toEqual([...expectedRoles(before)].sort());
  });

  test("the after snippet has no raw color and no palette utility", () => {
    expect(findRawColors(after)).toEqual([]);
    expect(findLegacy(after)).toEqual([]);
  });

  test("the after snippet scores 1 as a rewrite", () => {
    expect(scoreRewrite(before, after)).toEqual({
      score: 1,
      missing: [],
      extra: [],
      leftovers: [],
    });
  });
});

describe("scoreRewrite as an eval for a later codemod", () => {
  const before = fixture("snippets/raw-hex.before.css");

  test("leaving the file untouched scores below 1 and lists the leftovers", () => {
    const result = scoreRewrite(before, before);
    expect(result.score).toBe(0);
    expect(result.leftovers.length).toBeGreaterThan(0);
  });

  test("a partial rewrite is scored partially, and wrong roles count as extra", () => {
    const partial =
      ".card { background: var(--surface); color: var(--text); border-color: var(--warning); }";
    const result = scoreRewrite(before, partial);
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(1);
    expect(result.extra).toEqual(["warning"]);
    expect(result.missing).toContain("accent");
  });
});
