import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vite-plus/test";
// @ts-expect-error plain ESM script without type declarations
import { findRawColors, main, scan } from "../bin/check-raw-color.mjs";

const pkg = fileURLToPath(new URL("..", import.meta.url));
const repo = fileURLToPath(new URL("../../..", import.meta.url));
const quiet = { log: () => {}, error: () => {} };

describe("findRawColors", () => {
  test.each([
    ["color: #fff;", "#fff"],
    ["color: #FFFFFF80;", "#FFFFFF80"],
    ['{ color: "#c4512c" }', "#c4512c"],
    ["background: rgb(0 0 0);", "rgb(0"],
    ["background: rgba(0, 0, 0, 0.5);", "rgba(0"],
    ["border: 1px solid hsl(210 40% 50%);", "hsl(2"],
  ])("flags %s", (line, value) => {
    expect(findRawColors(line).map((hit: { value: string }) => hit.value)).toEqual([value]);
  });

  test.each([
    "color: var(--accent);",
    '<a href="#main">',
    "const id = `${prefix}#section-2`;",
    "background: color-mix(in srgb, var(--accent) 35%, var(--surface));",
    "color: #fff; /* raw-color-ignore */",
    "&#123; an html entity",
  ])("ignores %s", (line) => {
    expect(findRawColors(line)).toEqual([]);
  });
});

describe("fixtures", () => {
  test("the failing fixtures fail", () => {
    expect(main(["fixtures/raw-color/should-fail.tsx"], pkg, quiet)).toBe(1);
    expect(main(["fixtures/raw-color/should-fail.css"], pkg, quiet)).toBe(1);
  });

  test("the passing fixture passes", () => {
    expect(main(["fixtures/raw-color/should-pass.tsx"], pkg, quiet)).toBe(0);
  });

  test("the token source is the only allowed place, via --allow", () => {
    expect(main(["src"], pkg, quiet)).toBe(1);
    expect(main(["src", "--allow", "src"], pkg, quiet)).toBe(0);
  });
});

test("this repo is clean outside the allowed token source, tables, and fixtures", () => {
  const config = JSON.parse(readFileSync(join(repo, "raw-color.config.json"), "utf8"));
  const offenders = scan({ paths: config.paths, allow: config.allow, cwd: repo });
  expect(offenders.map((o: { file: string }) => o.file)).toEqual([]);
  expect(main(["--config", "raw-color.config.json"], repo, quiet)).toBe(0);
});

test("a baseline lets legacy files through but still fails new ones", () => {
  const dir = mkdtempSync(join(tmpdir(), "raw-color-"));
  writeFileSync(join(dir, "old.css"), ".a { color: #123456; }\n");
  writeFileSync(join(dir, "baseline.json"), "[]\n");

  expect(main([".", "--baseline", "baseline.json", "--write-baseline"], dir, quiet)).toBe(0);
  expect(JSON.parse(readFileSync(join(dir, "baseline.json"), "utf8"))).toEqual(["old.css"]);
  expect(main([".", "--baseline", "baseline.json"], dir, quiet)).toBe(0);

  writeFileSync(join(dir, "new.tsx"), 'const c = "#abcdef";\n');
  expect(main([".", "--baseline", "baseline.json"], dir, quiet)).toBe(1);
});
