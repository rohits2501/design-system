import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      build: { command: "vp pack", dependsOn: ["@house/tokens#build"] },
    },
  },
  pack: {
    entry: ["src/index.ts"],
    dts: true,
    exports: {
      customExports(pkgExports) {
        const entry = pkgExports["."];
        pkgExports["."] =
          typeof entry === "string" ? { types: "./dist/index.d.mts", default: entry } : entry;
        pkgExports["./styles.css"] = "./src/styles.css";
        return pkgExports;
      },
    },
  },
});
