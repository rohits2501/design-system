import { readFileSync } from "node:fs";
import { expect, test } from "vite-plus/test";

const source = readFileSync(new URL("../src/main.tsx", import.meta.url), "utf8");

const families = [
  "@fontsource-variable/fraunces",
  "@fontsource-variable/plus-jakarta-sans",
  "@fontsource-variable/inter-tight",
  "@fontsource-variable/atkinson-hyperlegible-next",
];

// covers: AC-10, AC-12
test("the catalog entry loads both stylesheets and the four open font families", () => {
  expect(source).toContain('import "@house/tokens/theme.css"');
  expect(source).toContain('import "@house/tokens/presets.css"');
  for (const family of families) expect(source).toContain(`import "${family}"`);
  expect(source).not.toMatch(/fonts\.google|fonts\.gstatic|@font-face/);
});
