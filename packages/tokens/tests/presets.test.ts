import { readFileSync } from "node:fs";
import { describe, expect, test } from "vite-plus/test";
import {
  colorVarName,
  colors,
  fontFamily,
  presetColorRoles,
  presetNames,
  presets,
  renderPresetsCss,
  themeNames,
  themes,
} from "../src/index.ts";

const presetsCss = readFileSync(new URL("../src/presets.css", import.meta.url), "utf8");
const themeCss = readFileSync(new URL("../src/theme.css", import.meta.url), "utf8");
const optIn = presetNames.filter((name) => name !== "stay");
const solidOptIn = optIn.filter((name) => name !== "glass");
const solid = { blur: 0, alpha: 1, saturate: 1 };

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

describe("theme.css is the stay default", () => {
  test("no preset selectors", () => {
    expect(themeCss).not.toContain("data-preset");
  });

  // covers: AC-1
  test("root carries stay", () => {
    const root = rule(themeCss, ":root {");
    expect(root).toContain("--radius-sm: 999px;");
    expect(root).toContain("--radius-md: 12px;");
    expect(root).toContain('--font-sans: "Plus Jakarta Sans Variable"');
    expect(root).toContain("--surface-alpha: 1;");
    expect(root).toContain("--surface-backdrop: none;");
    expect(root).toContain("--control-height-sm: 28px;");
    expect(root).toContain("--control-height-md: 36px;");
    expect(root).toContain(`--accent: ${presetColorRoles.stay.light.accent};`);
  });

  // covers: AC-1
  test("dark and high contrast attributes keep the stay palette", () => {
    const dark = rule(themeCss, '[data-theme="dark"] {');
    expect(dark).toContain(`--accent: ${presetColorRoles.stay.dark.accent};`);
    const hc = rule(themeCss, '[data-theme="high-contrast"] {');
    expect(hc).toContain(`--accent: ${presetColorRoles.stay.highContrast.accent};`);
    expect(hc).toContain("--surface-backdrop: none;");
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

test("stay lives only in theme.css", () => {
  expect(presetsCss).not.toContain('data-preset="stay"');
  expect(themeCss).not.toContain("data-preset");
});

test("glass is the only frosted preset", () => {
  const body = rule(presetsCss, 'html[data-preset="glass"],');
  expect(body).toContain(`--accent: ${presetColorRoles.glass.light.accent};`);
  expect(body).toContain("--surface-alpha: 0.62;");
  expect(body).toContain("--surface-backdrop: blur(20px) saturate(1.8);");
  expect(body).toContain("--radius-md: 22px;");
  expect(body).toContain("--control-height-md: 44px;");
  expect(body).toContain("-apple-system");
  const hc = rule(presetsCss, 'html[data-preset="glass"][data-theme="high-contrast"]');
  expect(hc).toContain("--surface-alpha: 1;");
  expect(hc).toContain("--surface-backdrop: none;");
  expect(hc).toContain(`--accent: ${presetColorRoles.glass.highContrast.accent};`);
  for (const name of solidOptIn) {
    const look = rule(presetsCss, `html[data-preset="${name}"],`);
    expect(look).toContain("--surface-backdrop: none;");
  }
});

describe.each(solidOptIn)("%s overrides the stay default", (preset) => {
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
  ["cinema", "--tracking-display: -0.02em;"],
  ["access", "--control-height-md: 44px;"],
] as const)("%s emits the metric stay does not already set", (preset, snippet) => {
  expect(rule(presetsCss, `html[data-preset="${preset}"],`)).toContain(snippet);
});

// covers: AC-2
test("editorial body is Newsreader and the titles stay Fraunces", () => {
  const body = rule(presetsCss, 'html[data-preset="editorial"],');
  expect(body).toContain("Newsreader Variable");
  expect(body).toContain("Fraunces Variable");
  expect(body).not.toContain("Plus Jakarta Sans");
});

// covers: AC-13
test("every look names JetBrains Mono, and the extra stacks are not presets", () => {
  expect(themeCss).toContain(
    '--font-mono: "JetBrains Mono Variable", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;',
  );
  expect(fontFamily.reading).toBe(
    '"Source Sans 3 Variable", "Source Sans 3", ui-sans-serif, system-ui, sans-serif',
  );
  expect(fontFamily.dense).toBe(
    '"IBM Plex Sans Variable", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
  );
  for (const name of presetNames) {
    expect(presets[name].light.fontFamily.mono).toBe(fontFamily.mono);
    expect(presets[name].light.fontFamily.sans).not.toBe(fontFamily.reading);
  }
});

// covers: AC-13
test("reading and dense stay names only, and every appearance shares the code face", () => {
  expect(themeCss).not.toContain("Source Sans 3");
  expect(themeCss).not.toContain("IBM Plex Sans");
  expect(presetsCss).not.toContain("Source Sans 3");
  expect(presetsCss).not.toContain("IBM Plex Sans");
  for (const name of presetNames) {
    for (const appearance of themeNames) {
      expect(presets[name][appearance].fontFamily.mono).toBe(fontFamily.mono);
    }
  }
});

// covers: AC-3
test("with neither attribute, system dark and more contrast use stay", () => {
  const dark = mediaFor(themeCss, "prefers-color-scheme: dark", ":root:not([data-theme])");
  expect(dark).toContain(`--accent: ${presetColorRoles.stay.dark.accent};`);
  expect(dark).toContain("--surface-backdrop: none;");
  const hc = mediaFor(themeCss, "prefers-contrast: more", ":root:not([data-theme])");
  expect(hc).toContain(`--accent: ${presetColorRoles.stay.highContrast.accent};`);
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
  test("themes is the stay default", () => {
    expect(themes).toEqual(presets.stay);
  });

  // covers: AC-9
  test("colors are stay, and the preset list includes glass", () => {
    expect(colors).toEqual(presetColorRoles.stay);
    expect([...presetNames]).toEqual(["stay", "glass", "editorial", "cinema", "access"]);
    expect(Object.keys(presets)).toEqual([...presetNames]);
  });

  // covers: AC-7, AC-9
  test("stay and the other solid looks stay solid, and glass frosts light and dark", () => {
    for (const name of ["stay", ...solidOptIn] as const) {
      expect(presets[name].light.material).toEqual(solid);
      expect(presets[name].dark.material).toEqual(solid);
    }
    const frost = { blur: 20, alpha: 0.62, saturate: 1.8 };
    expect(presets.glass.light.material).toEqual(frost);
    expect(presets.glass.dark.material).toEqual(frost);
  });

  // covers: AC-9
  test("each look keeps its locked accent", () => {
    expect(presetColorRoles).toMatchObject({
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
      glass: {
        light: { accent: "#0b4fbf" },
        dark: { accent: "#8eb6ff" },
        highContrast: { accent: "#003a8c" },
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
    expect(set.highContrast.material).toEqual(solid);
    for (const t of themeNames) expect(set[t].preset).toBe(name);
  });

  test("access raises type, controls, and focus ring", () => {
    const a = presets.access.light;
    expect(a.fontSize.md.size).toBe(18);
    expect(a.controlHeight).toEqual({ sm: 36, md: 44 });
    expect(a.focusRing.width).toBe(3);
  });
});
