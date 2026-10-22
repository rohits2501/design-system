#!/usr/bin/env node
/**
 * Fails when a built asset's gzip size passes its ceiling in perf/budgets.json.
 * Also writes perf/snapshot.json (parsed bytes and level-9 gzip) for the pull-request comment.
 * Run after `vp run -r build`. Raise a ceiling in the same change that grows the asset.
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { budgets } = JSON.parse(readFileSync(join(root, "perf/budgets.json"), "utf8"));

function matchFiles(pattern) {
  const dir = join(root, dirname(pattern));
  const name = pattern.slice(pattern.lastIndexOf("/") + 1);
  const re = new RegExp(`^${name.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`);
  return readdirSync(dir)
    .filter((file) => re.test(file))
    .map((file) => join(dir, file));
}

const bundles = [];
let failed = false;
for (const budget of budgets) {
  const files = matchFiles(budget.path);
  if (files.length === 0) {
    console.error(`budget ${budget.name}: nothing matches ${budget.path}. Build first.`);
    failed = true;
    continue;
  }
  const fileRows = files.map((file) => {
    const raw = readFileSync(file);
    return {
      path: relative(root, file),
      parsed: statSync(file).size,
      gzip: gzipSync(raw, { level: 9 }).length,
    };
  });
  const parsed = fileRows.reduce((sum, file) => sum + file.parsed, 0);
  const gzip = fileRows.reduce((sum, file) => sum + file.gzip, 0);
  bundles.push({ name: budget.name, parsed, gzip, files: fileRows });
  const over = gzip > budget.maxBytes;
  failed ||= over;
  const list = fileRows.map((file) => file.path).join(", ");
  console[over ? "error" : "log"](
    `${over ? "over" : "ok  "} ${budget.name}: ${gzip} B gzip / ${budget.maxBytes} B (${list})`,
  );
}

const snapshotPath = join(root, "perf/snapshot.json");
let benches = [];
if (existsSync(snapshotPath)) {
  try {
    benches = JSON.parse(readFileSync(snapshotPath, "utf8")).benches ?? [];
  } catch {
    benches = [];
  }
}
writeFileSync(snapshotPath, `${JSON.stringify({ bundles, benches }, null, 2)}\n`);
process.exitCode = failed ? 1 : 0;
