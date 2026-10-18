import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/index.ts"],
    dts: true,
    exports: {
      customExports(pkgExports) {
        const entry = pkgExports["."];
        const typed =
          typeof entry === "string" ? { types: "./dist/index.d.mts", default: entry } : entry;
        pkgExports["."] = typed;
        pkgExports["./tokens"] = typed;
        pkgExports["./theme.css"] = "./src/theme.css";
        pkgExports["./check-raw-color"] = "./bin/check-raw-color.mjs";
        return pkgExports;
      },
    },
  },
});
