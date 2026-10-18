import { readFileSync } from "node:fs";
import { expect, test } from "vite-plus/test";
import { colorVarName, colors, cssVar, renderThemeCss, themes } from "../src/index.ts";

const checkedIn = readFileSync(new URL("../src/theme.css", import.meta.url), "utf8");

test("checked in theme.css matches the token source (run `npm run emit` to refresh)", () => {
  expect(checkedIn).toBe(renderThemeCss());
});

test("every theme block declares every color role", () => {
  for (const selector of [":root {", '[data-theme="dark"] {', '[data-theme="high-contrast"] {']) {
    const start = checkedIn.indexOf(selector);
    expect(start, selector).toBeGreaterThanOrEqual(0);
    const body = checkedIn.slice(start, checkedIn.indexOf("}", start));
    for (const name of Object.values(colorVarName))
      expect(body, `${selector} ${name}`).toContain(`${name}:`);
  }
});

test("all themes expose the same roles", () => {
  const roles = Object.keys(colors.light).sort();
  expect(Object.keys(colors.dark).sort()).toEqual(roles);
  expect(Object.keys(colors.highContrast).sort()).toEqual(roles);
});

test("the token object is plain data a native StyleSheet can read", () => {
  const t = themes.dark;
  expect(t.color.bg).toMatch(/^#[0-9a-f]{6}$/);
  expect(t.space[4]).toBe(16);
  expect(t.preset).toBe("glass");
  expect(t.radius.md).toBe(16);
  expect(JSON.parse(JSON.stringify(themes))).toEqual(themes);
});

test("cssVar points at the generated custom properties", () => {
  expect(cssVar.color.bgSubtle).toBe("var(--bg-subtle)");
  expect(cssVar.space[4]).toBe("var(--space-4)");
  expect(cssVar.radius.pill).toBe("var(--radius-pill)");
});
