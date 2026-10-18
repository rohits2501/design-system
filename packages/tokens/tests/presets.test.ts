import { readFileSync } from "node:fs";
import { describe, expect, test } from "vite-plus/test";
import {
  colorVarName,
  presetNames,
  presets,
  renderPresetsCss,
  themeNames,
  themes,
} from "../src/index.ts";

const presetsCss = readFileSync(new URL("../src/presets.css", import.meta.url), "utf8");
const themeCss = readFileSync(new URL("../src/theme.css", import.meta.url), "utf8");
const others = presetNames.filter((name) => name !== "house");

/** The body of the first rule whose selector list starts with `selector`. */
function rule(css: string, selector: string): string {
  const start = css.indexOf(`${selector}`);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  return css.slice(css.indexOf("{", start), css.indexOf("}", start));
}

test("checked in presets.css matches the token source (run `npm run emit` to refresh)", () => {
  expect(presetsCss).toBe(renderPresetsCss());
});

describe("theme.css stays house only", () => {
  test("no preset selectors", () => {
    expect(themeCss).not.toContain("data-preset");
  });

  test("new variables carry house defaults", () => {
    const root = rule(themeCss, ":root {");
    expect(root).toContain("--font-display: ui-sans-serif");
    expect(root).toContain("--tracking-display: 0em;");
    expect(root).toContain("--surface-alpha: 1;");
    expect(root).toContain("--surface-backdrop: none;");
    expect(root).toContain("--control-height-sm: 28px;");
    expect(root).toContain("--control-height-md: 36px;");
  });
});

describe.each(others)("%s preset rules", (preset) => {
  const p = `[data-preset="${preset}"]`;

  test("page level and descendant selectors for every appearance", () => {
    for (const attr of ["light", "dark", "high-contrast"]) {
      const descendant = `${p} [data-theme="${attr}"]`;
      expect(presetsCss).toContain(descendant);
      const body = rule(
        presetsCss,
        attr === "light" ? `html${p},` : `html${p}[data-theme="${attr}"]`,
      );
      for (const name of Object.values(colorVarName)) expect(body).toContain(`${name}:`);
    }
  });

  test("operating system settings apply only without data-theme", () => {
    expect(presetsCss).toContain(`  html${p}:not([data-theme]) {`);
  });

  test("high contrast is solid", () => {
    const hc = rule(presetsCss, `html${p}[data-theme="high-contrast"]`);
    expect(hc).not.toContain("blur(");
  });

  test("comes before the explicit house rules", () => {
    expect(presetsCss.indexOf(`html${p}`)).toBeLessThan(
      presetsCss.indexOf('[data-preset="house"] {'),
    );
  });
});

test("only glass light and dark set a backdrop blur", () => {
  const blurs = presetsCss.match(/--surface-backdrop: blur\(24px\)/g) ?? [];
  // glass light, dark, and the dark media rule
  expect(blurs).toHaveLength(3);
  for (const attr of ["light,", '[data-theme="dark"]']) {
    const selector =
      attr === "light," ? 'html[data-preset="glass"],' : `html[data-preset="glass"]${attr}`;
    expect(rule(presetsCss, selector)).toContain("--surface-alpha: 0.72;");
  }
});

test("explicit house covers itself, its descendants, and follows the nearest data-theme", () => {
  for (const attr of ["light", "dark", "high-contrast"]) {
    expect(presetsCss).toContain(`[data-preset="house"][data-theme="${attr}"],`);
    expect(presetsCss).toContain(`[data-preset="house"] [data-theme="${attr}"],`);
    expect(presetsCss).toContain(`[data-theme="${attr}"] [data-preset="house"]:not([data-theme])`);
  }
  const house = rule(presetsCss, '[data-preset="house"] {');
  expect(house).toContain("--control-height-md: 36px;");
  expect(house).toContain("--surface-backdrop: none;");
});

test("reduced transparency is the last rule and resets every scope", () => {
  const tail = presetsCss.slice(presetsCss.lastIndexOf("@media"));
  expect(tail).toContain("prefers-reduced-transparency: reduce");
  expect(tail).toContain(":root,\n  [data-preset],\n  [data-preset] [data-theme] {");
  expect(tail).toContain("--surface-backdrop: none !important;");
});

test("presets.css names no font file or font CDN", () => {
  expect(presetsCss).not.toMatch(/@font-face|url\(|@import/);
});

describe("token object", () => {
  test("themes is house", () => {
    expect(themes).toEqual(presets.house);
  });

  test.each(presetNames)("%s is plain JSON with solid high contrast", (name) => {
    const set = presets[name];
    expect(JSON.parse(JSON.stringify(set))).toEqual(set);
    expect(set.highContrast.material).toEqual({ blur: 0, alpha: 1 });
    for (const t of themeNames) expect(set[t].preset).toBe(name);
  });

  test("access raises type, controls, and focus ring", () => {
    const a = presets.access.light;
    expect(a.fontSize.md.size).toBe(18);
    expect(a.controlHeight).toEqual({ sm: 36, md: 44 });
    expect(a.focusRing.width).toBe(3);
  });
});
