#!/usr/bin/env node
/**
 * On a pull request, run the catalog benches at the merge-base with origin/main.
 * Paint from another runner is not a baseline. Writes perf-base/benches.json.
 * When that commit has no bench runner, the file is an empty bench list.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "perf-base/benches.json");
mkdirSync(dirname(out), { recursive: true });

execFileSync("git", ["fetch", "--no-tags", "origin", "main"], { cwd: root, stdio: "inherit" });
const baseSha = execFileSync("git", ["merge-base", "HEAD", "origin/main"], {
  cwd: root,
  encoding: "utf8",
}).trim();
const dir = join(tmpdir(), `bench-base-${baseSha.slice(0, 8)}`);
rmSync(dir, { recursive: true, force: true });

function empty() {
  writeFileSync(out, `${JSON.stringify({ benches: [] }, null, 2)}\n`);
}

try {
  execFileSync("git", ["worktree", "add", "--detach", dir, baseSha], {
    cwd: root,
    stdio: "inherit",
  });
  if (!existsSync(join(dir, "scripts/run-bench.mjs"))) {
    console.log(`No bench runner at ${baseSha}.`);
    empty();
  } else {
    execFileSync("npm", ["ci"], { cwd: dir, stdio: "inherit" });
    execFileSync("npx", ["vp", "run", "-r", "build"], { cwd: dir, stdio: "inherit" });
    execFileSync("node", ["scripts/run-bench.mjs", "--benches-out", out], {
      cwd: dir,
      stdio: "inherit",
      env: process.env,
    });
  }
} finally {
  try {
    execFileSync("git", ["worktree", "remove", "--force", dir], {
      cwd: root,
      stdio: "inherit",
    });
  } catch {
    // The worktree was never added.
  }
  rmSync(dir, { recursive: true, force: true });
}
