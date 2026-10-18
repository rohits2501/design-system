import { writeFileSync } from "node:fs";
import { renderPresetsCss, renderThemeCss } from "../src/css.ts";

for (const [file, render] of [
  ["theme.css", renderThemeCss],
  ["presets.css", renderPresetsCss],
] as const) {
  const target = new URL(`../src/${file}`, import.meta.url);
  writeFileSync(target, render());
  console.log(`wrote ${target.pathname}`);
}
