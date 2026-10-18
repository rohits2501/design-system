import "@house/tokens/theme.css";
import "@house/tokens/presets.css";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/atkinson-hyperlegible-next";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/jetbrains-mono";
import "@house/react/styles.css";
import "./style.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const container = document.getElementById("app");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
