import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { expect, test } from "vite-plus/test";
import { space } from "@house/tokens";

const require = createRequire(import.meta.url);
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const theme = readFileSync(require.resolve("@house/tokens/theme.css"), "utf8");

test("every variable styles.css reads is declared by @house/tokens or locally", () => {
  const declared = new Set([...theme.matchAll(/(--[a-z0-9-]+):/g)].map((m) => m[1]));
  for (const m of styles.matchAll(/(--h-[a-z0-9-]+):/g)) declared.add(m[1]);
  const used = new Set([...styles.matchAll(/var\((--[a-z0-9-]+)\)/g)].map((m) => m[1]));
  const missing = [...used].filter((name) => !declared.has(name));
  expect(missing).toEqual([]);
});

test("every space step has a gap and a padding class", () => {
  for (const step of Object.keys(space)) {
    expect(styles).toContain(`.h-gap-${step} {`);
    expect(styles).toContain(`.h-pad-${step} {`);
  }
});

// covers: AC-8
test("presets reach components only through variables", () => {
  expect(styles).not.toContain("data-preset");
  expect(styles).not.toMatch(/min-height: \d|width: \d+px;\s*padding: 0/);
  for (const m of styles.matchAll(/backdrop-filter: ([^;]+);/g))
    expect(m[1]).toBe("var(--surface-backdrop)");
  expect(styles).toMatch(
    /\.h-text--xl,\s*\.h-text--2xl\s*\{\s*font-family: var\(--font-display\);\s*letter-spacing: var\(--tracking-display\);/,
  );
});

test("the default theme is frosted glass and its high contrast is solid", () => {
  const root = theme.slice(theme.indexOf(":root {"), theme.indexOf("}"));
  expect(root).toContain("--surface-backdrop: blur(24px);");
  const hcStart = theme.indexOf('[data-theme="high-contrast"]');
  const hc = theme.slice(hcStart, theme.indexOf("}", hcStart));
  expect(hc).toContain("--surface-backdrop: none;");
});

test("interactive primitives draw the shared focus ring", () => {
  expect(styles).toMatch(
    /\.h-button:focus-visible,\s*\.h-input:focus-visible\s*\{\s*outline: var\(--focus-ring-width\) solid var\(--focus-ring\);/,
  );
});
