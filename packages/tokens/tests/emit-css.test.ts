import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, test } from "vite-plus/test";

const themePath = new URL("../src/theme.css", import.meta.url);
const presetsPath = new URL("../src/presets.css", import.meta.url);

// covers: AC-1, AC-5
test("emit rewrites theme.css and presets.css to match the token source", () => {
  const themeBefore = readFileSync(themePath, "utf8");
  const presetsBefore = readFileSync(presetsPath, "utf8");
  try {
    execFileSync(process.execPath, ["scripts/emit-css.ts"], {
      cwd: fileURLToPath(new URL("..", import.meta.url)),
      stdio: "pipe",
    });
    expect(readFileSync(themePath, "utf8")).toBe(themeBefore);
    expect(readFileSync(presetsPath, "utf8")).toBe(presetsBefore);
  } finally {
    writeFileSync(themePath, themeBefore);
    writeFileSync(presetsPath, presetsBefore);
  }
});
