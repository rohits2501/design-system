import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: "tsc && vp build",
        dependsOn: ["@house/tokens#build", "@house/react#build"],
      },
    },
  },
});
