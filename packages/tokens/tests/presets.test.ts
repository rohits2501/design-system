import { readFileSync } from "node:fs";
import { describe, expect, test } from "vite-plus/test";
import {
  colorVarName,
  colors,
  presetColorRoles,
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

/** The `@media` block for `query` whose text contains `marker`. */
function mediaFor(css: string, query: string, marker: string): string {
  const needle = `@media (${query})`;
  let from = 0;
  while (from < css.length) {
    const start = css.indexOf(needle, from);
    expect(start, `${query} ${marker}`).toBeGreaterThanOrEqual(0);
    const end = css.indexOf("\n}", start);
    const block = css.slice(start, end === -1 ? css.length : end);
    if (block.includes(marker)) return block;
    from = start + needle.length;
  }
  throw new Error(`no ${query} block containing ${marker}`);
}

test("checked in presets.css matches the token source (run `npm run emit` to refresh)", () => {
  expect(presetsCss).toBe(renderPresetsCss());
});

describe("theme.css is the glass default", () => {
  test("no preset selectors", () => {
    expect(themeCss).not.toContain("data-preset");
  });

  // covers: AC-1
  test("root carries glass", () => {
    const root = rule(themeCss, ":root {");
    expect(root).toContain("--radius-sm: 999px;");
    expect(root).toContain("--font-display: -apple-system");
    expect(root).toContain("--surface-alpha: 0.72;");
    expect(root).toContain("--surface-backdrop: blur(24px);");
    expect(root).toContain("--control-height-sm: 28px;");
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

describe.each(optIn)("%s overrides the glass default", (preset) => {
  const accent = presetColorRoles[preset];

  // covers: AC-2, AC-7
  test("the light page rule carries this look's accent and solid material", () => {
    const body = rule(presetsCss, `html[data-preset="${preset}"],`);
    expect(body).toContain(`--accent: ${accent.light.accent};`);
    expect(body).toContain("--surface-alpha: 1;");
    expect(body).toContain("--surface-backdrop: none;");
  });

  // covers: AC-2, AC-4
  test("dark and high contrast colors follow the attribute, including a nested column", () => {
    const dark = rule(presetsCss, `html[data-preset="${preset}"][data-theme="dark"]`);
    expect(dark).toContain(`--accent: ${accent.dark.accent};`);
    expect(presetsCss).toContain(`[data-preset="${preset}"] [data-theme="dark"]`);
    const hc = rule(presetsCss, `html[data-preset="${preset}"][data-theme="high-contrast"]`);
    expect(hc).toContain(`--accent: ${accent.highContrast.accent};`);
    expect(hc).toContain("--surface-backdrop: none;");
  });

  // covers: AC-3
  test("system dark and more contrast apply only when data-theme is absent", () => {
    const marker = `html[data-preset="${preset}"]:not([data-theme])`;
    const dark = mediaFor(presetsCss, "prefers-color-scheme: dark", marker);
    expect(dark).toContain(`--accent: ${accent.dark.accent};`);
    const hc = mediaFor(presetsCss, "prefers-contrast: more", marker);
    expect(hc).toContain(`--accent: ${accent.highContrast.accent};`);
    expect(hc).toContain("--surface-backdrop: none;");
  });
});

// covers: AC-2
test.each([
  ["editorial", "--radius-sm: 0px;"],
  ["stay", "--radius-md: 12px;"],
  ["cinema", "--tracking-display: -0.02em;"],
  ["access", "--control-height-md: 44px;"],
] as const)("%s emits the metric glass does not already set", (preset, snippet) => {
  expect(rule(presetsCss, `html[data-preset="${preset}"],`)).toContain(snippet);
});

// covers: AC-3
test("with neither attribute, system dark and more contrast stay on glass", () => {
  const dark = mediaFor(themeCss, "prefers-color-scheme: dark", ":root:not([data-theme])");
  expect(dark).toContain(`--accent: ${presetColorRoles.glass.dark.accent};`);
  expect(dark).toContain("--surface-backdrop: blur(24px);");
  const hc = mediaFor(themeCss, "prefers-contrast: more", ":root:not([data-theme])");
  expect(hc).toContain(`--accent: ${presetColorRoles.glass.highContrast.accent};`);
  expect(hc).toContain("--surface-backdrop: none;");
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
  // covers: AC-9
  test("themes is the glass default", () => {
    expect(themes).toEqual(presets.glass);
  });

  // covers: AC-9
  test("colors and the preset list are glass, and house is not a preset", () => {
    expect(colors).toEqual(presetColorRoles.glass);
    expect([...presetNames]).toEqual(["glass", "editorial", "stay", "cinema", "access"]);
    expect(Object.keys(presets)).toEqual([...presetNames]);
    expect(presets).not.toHaveProperty("house");
  });

  // covers: AC-7, AC-9
  test("only glass light and dark are frosted", () => {
    expect(presets.glass.light.material).toEqual({ blur: 24, alpha: 0.72 });
    expect(presets.glass.dark.material).toEqual({ blur: 24, alpha: 0.72 });
    for (const name of optIn) {
      expect(presets[name].light.material).toEqual({ blur: 0, alpha: 1 });
      expect(presets[name].dark.material).toEqual({ blur: 0, alpha: 1 });
    }
  });

  // covers: AC-9
  test("each look keeps its locked accent", () => {
    expect(presetColorRoles).toMatchObject({
      glass: {
        light: { accent: "#0b4fbf" },
        dark: { accent: "#8eb6ff" },
        highContrast: { accent: "#003a8c" },
      },
      editorial: {
        light: { accent: "#7a2e0e" },
        dark: { accent: "#f0a06a" },
        highContrast: { accent: "#5c1d06" },
      },
      stay: {
        light: { accent: "#9d1239" },
        dark: { accent: "#ff8fa8" },
        highContrast: { accent: "#6e0c28" },
      },
      cinema: {
        light: { accent: "#a10d18" },
        dark: { accent: "#ff4d57" },
        highContrast: { accent: "#7a0810" },
      },
      access: {
        light: { accent: "#14408c" },
        dark: { accent: "#a8c8ff" },
        highContrast: { accent: "#0b2e6b" },
      },
    });
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
