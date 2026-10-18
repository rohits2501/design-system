#!/usr/bin/env node
/**
 * Fails when a raw color (hex, rgb(), hsl()) appears outside the allowed token source.
 * No dependencies, so any repo can run it as is:
 *
 *   house-check-raw-color [paths...] [--allow <path>]... [--baseline <file>] [--write-baseline]
 *   house-check-raw-color --config raw-color.config.json
 *
 * --config          JSON with `paths`, `allow`, and `baseline`; flags add to it
 * --allow           a path prefix whose files may hold raw colors (the token source)
 * --baseline        JSON list of files that predate adoption; only new files are checked
 * --write-baseline  record today's offenders into the baseline file and exit 0
 *
 * A line containing `raw-color-ignore` is skipped.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

const EXTENSIONS = new Set([
  ".css",
  ".scss",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".html",
  ".svelte",
  ".vue",
]);
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  "out",
  "coverage",
  ".next",
  ".git",
  ".vercel",
  ".expo",
  ".turbo",
]);

const PATTERNS = [
  { kind: "hex", re: /(?<![\w&/-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g },
  { kind: "rgb", re: /\brgba?\(\s*[\d.]/g },
  { kind: "hsl", re: /\bhsla?\(\s*[\d.]/g },
];

/** Every raw color in `text`, with 1 based line and column. */
export function findRawColors(text) {
  const hits = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (line.includes("raw-color-ignore")) return;
    for (const { kind, re } of PATTERNS) {
      re.lastIndex = 0;
      for (const match of line.matchAll(re)) {
        hits.push({ line: index + 1, column: (match.index ?? 0) + 1, kind, value: match[0] });
      }
    }
  });
  return hits;
}

function walk(path, files) {
  const stats = statSync(path);
  if (stats.isFile()) {
    if (EXTENSIONS.has(extname(path))) files.push(path);
    return;
  }
  for (const entry of readdirSync(path)) {
    if (SKIP_DIRS.has(entry)) continue;
    walk(join(path, entry), files);
  }
}

function toPosix(path) {
  return path.split(sep).join("/");
}

/**
 * Scan `paths` (relative to `cwd`) and return offending files that are neither allowed nor baselined.
 * @param {{ paths?: string[], allow?: string[], baseline?: string[], cwd?: string }} options
 */
export function scan({ paths = ["."], allow = [], baseline = [], cwd = process.cwd() } = {}) {
  const files = [];
  for (const path of paths) walk(resolve(cwd, path), files);
  const allowed = allow.map((prefix) => toPosix(relative(cwd, resolve(cwd, prefix))));
  const known = new Set(baseline.map(toPosix));
  const offenders = [];
  for (const file of files.sort()) {
    const rel = toPosix(relative(cwd, file));
    if (allowed.some((prefix) => rel === prefix || rel.startsWith(`${prefix}/`))) continue;
    const hits = findRawColors(readFileSync(file, "utf8"));
    if (hits.length === 0) continue;
    offenders.push({ file: rel, hits, baselined: known.has(rel) });
  }
  return offenders;
}

function parseArgs(argv, cwd) {
  const options = { paths: [], allow: [], baseline: undefined, writeBaseline: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--config") {
      const config = JSON.parse(readFileSync(resolve(cwd, argv[++i]), "utf8"));
      options.paths.push(...(config.paths ?? []));
      options.allow.push(...(config.allow ?? []));
      options.baseline ??= config.baseline;
    } else if (arg === "--allow") options.allow.push(argv[++i]);
    else if (arg === "--baseline") options.baseline = argv[++i];
    else if (arg === "--write-baseline") options.writeBaseline = true;
    else options.paths.push(arg);
  }
  if (options.paths.length === 0) options.paths.push(".");
  return options;
}

export function main(argv = process.argv.slice(2), cwd = process.cwd(), log = console) {
  const options = parseArgs(argv, cwd);
  const baselinePath = options.baseline ? resolve(cwd, options.baseline) : undefined;
  const baseline =
    baselinePath && existsSync(baselinePath) && !options.writeBaseline
      ? JSON.parse(readFileSync(baselinePath, "utf8"))
      : [];
  const offenders = scan({ paths: options.paths, allow: options.allow, baseline, cwd });

  if (options.writeBaseline) {
    if (!baselinePath) throw new Error("--write-baseline needs --baseline <file>");
    writeFileSync(
      baselinePath,
      `${JSON.stringify(
        offenders.map((o) => o.file),
        null,
        2,
      )}\n`,
    );
    log.log(`raw colors: wrote ${offenders.length} legacy files to ${options.baseline}`);
    return 0;
  }

  const fresh = offenders.filter((o) => !o.baselined);
  for (const { file, hits } of fresh) {
    for (const hit of hits)
      log.error(`${file}:${hit.line}:${hit.column}  raw ${hit.kind} ${hit.value}`);
  }
  const legacy = offenders.length - fresh.length;
  if (fresh.length > 0) {
    log.error(
      `\nraw colors: ${fresh.length} file(s) set a color directly. Use a token role (var(--accent), themes.light.color.accent) instead.`,
    );
    return 1;
  }
  log.log(`raw colors: clean${legacy ? ` (${legacy} legacy file(s) in the baseline)` : ""}`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = main();
}
