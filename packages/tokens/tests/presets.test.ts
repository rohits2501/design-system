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
const optIn = presetNames.filter((name) => name !== "glass");

/** The body of the first rule whose selector list starts with `selector`. */
function rule(css: string, selector: string): string {
  const start = css.indexOf(`${selector}`);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  return css.slice(css.indexOf("{", start), css.indexOf("}", start));
}

test("checked in presets.css matches the token source (run `npm run emit` to refresh)", () => {
  expect(presetsCss).toBe(renderPresetsCss());
});

describe("theme.css is the glass default", () => {
  test("no preset selectors", () => {
    expect(themeCss).not.toContain("data-preset");
  });

  test("root carries glass", () => {
    const root = rule(themeCss, ":root {");
    expect(root).toContain("--radius-sm: 999px;");
    expect(root).toContain("--font-display: -apple-system");
    expect(root).toContain("--surface-alpha: 0.72;");
    expect(root).toContain("--surface-backdrop: blur(24px);");
    expect(root).toContain("--control-height-md: 36px;");
  });

  test("high contrast on the default is solid", () => {
    const hc = rule(themeCss, '[data-theme="high-contrast"] {');
    expect(hc).toContain("--surface-alpha: 1;");
    expect(hc).toContain("--surface-backdrop: none;");
  });
});

describe.each(optIn)("%s preset rules", (preset) => {
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
});

test("glass lives only in theme.css, and house is gone", () => {
  expect(presetsCss).not.toContain('data-preset="glass"');
  expect(presetsCss).not.toContain('data-preset="house"');
  expect(themeCss).not.toContain("data-preset");
  expect(presetsCss).not.toContain("blur(");
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
  test("themes is the glass default", () => {
    expect(themes).toEqual(presets.glass);
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
