#!/usr/bin/env node
/**
 * Fails when a built asset's gzip size passes its ceiling in perf/budgets.json.
 * Run after `vp run -r build`. Raise a ceiling in the same change that grows the asset.
 */
import { readFileSync, readdirSync } from "node:fs";
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

let failed = false;
for (const budget of budgets) {
  const files = matchFiles(budget.path);
  if (files.length === 0) {
    console.error(`budget ${budget.name}: nothing matches ${budget.path}. Build first.`);
    failed = true;
    continue;
  }
  const bytes = files.reduce(
    (sum, file) => sum + gzipSync(readFileSync(file), { level: 9 }).length,
    0,
  );
  const over = bytes > budget.maxBytes;
  failed ||= over;
  const list = files.map((f) => relative(root, f)).join(", ");
  console[over ? "error" : "log"](
    `${over ? "over" : "ok  "} ${budget.name}: ${bytes} B gzip / ${budget.maxBytes} B (${list})`,
  );
}
process.exitCode = failed ? 1 : 0;
