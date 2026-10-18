#!/usr/bin/env node
/**
 * Pack the built libraries into another repo's vendor/ folder, replacing older tarballs.
 * Until a registry publish, a consuming app depends on `file:vendor/house-tokens-<v>.tgz`, which
 * installs the same files a registry would and works in that app's CI.
 *
 *   node scripts/vendor.mjs ../some-app [@house/tokens @house/react]
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const [target, ...requested] = process.argv.slice(2);
if (!target) {
  console.error("usage: node scripts/vendor.mjs <app-dir> [package...]");
  process.exit(1);
}
const packages = requested.length > 0 ? requested : ["@house/tokens", "@house/react"];
const vendor = resolve(target, "vendor");
mkdirSync(vendor, { recursive: true });

for (const name of packages) {
  const prefix = `${name.replace("@", "").replace("/", "-")}-`;
  for (const file of readdirSync(vendor)) {
    if (file.startsWith(prefix) && file.endsWith(".tgz")) rmSync(join(vendor, file));
  }
  const out = execFileSync("npm", ["pack", "-w", name, "--pack-destination", vendor, "--silent"], {
    encoding: "utf8",
  }).trim();
  console.log(`packed ${name} → ${join(vendor, out.split("\n").at(-1) ?? "")}`);
}
