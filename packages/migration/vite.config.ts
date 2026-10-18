import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/index.ts"],
    dts: true,
    exports: {
      customExports(pkgExports) {
        const entry = pkgExports["."];
        pkgExports["."] =
          typeof entry === "string" ? { types: "./dist/index.d.mts", default: entry } : entry;
        return pkgExports;
      },
    },
  },
});
