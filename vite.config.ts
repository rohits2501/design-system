import { defineConfig } from "vite-plus";

export default defineConfig({
  run: { cache: true },
  fmt: {
    ignorePatterns: ["packages/tokens/src/theme.css"],
  },
});
