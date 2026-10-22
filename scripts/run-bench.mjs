#!/usr/bin/env node
/**
 * Mount the stay catalog and a dense control surface in Chromium.
 * Font files are not loaded. Writes the benches onto perf/snapshot.json.
 *
 *   node scripts/run-bench.mjs
 *   node scripts/run-bench.mjs --benches-out /tmp/benches.json
 */
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "apps/catalog/package.json"));
const { createServer } = require("vite");

const names = { catalog: "Catalog mount", dense: "Dense surface" };

function arg(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : (process.argv[index + 1] ?? null);
}

function writeBenches(benches) {
  const out = arg("--benches-out");
  if (out) {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, `${JSON.stringify({ benches }, null, 2)}\n`);
    return;
  }
  const snapshotPath = join(root, "perf/snapshot.json");
  const current = existsSync(snapshotPath)
    ? JSON.parse(readFileSync(snapshotPath, "utf8"))
    : { bundles: [] };
  current.benches = benches;
  writeFileSync(snapshotPath, `${JSON.stringify(current, null, 2)}\n`);
}

const server = await createServer({
  configFile: false,
  root,
  server: { host: "127.0.0.1", port: 4179, strictPort: false },
  logLevel: "error",
});
await server.listen();
const browser = await chromium.launch();
try {
  const address = server.httpServer?.address();
  const port = typeof address === "object" && address ? address.port : 4179;
  const benches = [];
  for (const mode of ["catalog", "dense"]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    page.on("pageerror", (error) => {
      console.error(error);
    });
    await page.route("**/*.{woff,woff2,ttf,otf}", (route) => route.abort());
    await page.goto(`http://127.0.0.1:${port}/perf/bench/index.html?bench=${mode}`);
    await page.waitForFunction("window.__BENCH__");
    const result = await page.evaluate("window.__BENCH__");
    benches.push({
      name: names[mode],
      durationMs: result.durationMs,
      count: result.count,
      paintMs: result.paintMs,
    });
    await page.close();
  }
  writeBenches(benches);
  for (const bench of benches) {
    console.log(
      `${bench.name}: ${bench.durationMs.toFixed(2)} ms, ${bench.count} renders, paint ${bench.paintMs.toFixed(2)} ms`,
    );
  }
} finally {
  await browser.close();
  await server.close();
}
