import { Profiler } from "react";
import { createRoot } from "react-dom/client";
import { App } from "../../apps/catalog/src/App.tsx";
import "@house/tokens/theme.css";
import "@house/tokens/presets.css";
import "@house/react/styles.css";
import "../../apps/catalog/src/style.css";
import { Dense } from "./Dense.tsx";

declare global {
  interface Window {
    __BENCH__?: { durationMs: number; count: number; paintMs: number };
  }
}

const mode = new URLSearchParams(location.search).get("bench") === "dense" ? "dense" : "catalog";
const container = document.getElementById("app");
if (container) {
  const start = performance.now();
  let commits = 0;
  let durationMs = 0;
  createRoot(container).render(
    <Profiler
      id="bench"
      onRender={() => {
        commits += 1;
        durationMs = performance.now() - start;
      }}
    >
      {mode === "dense" ? <Dense /> : <App initialPreset="stay" />}
    </Profiler>,
  );
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.__BENCH__ = {
        durationMs,
        count: commits,
        paintMs: performance.now() - start,
      };
    });
  });
}
