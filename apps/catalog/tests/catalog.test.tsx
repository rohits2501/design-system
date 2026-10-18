import { renderToStaticMarkup } from "react-dom/server";
import { presetNames } from "@house/tokens";
import { expect, test } from "vite-plus/test";
import { App } from "../src/App.tsx";

test("light, dark, and high contrast render the same primitives with no component change", () => {
  const html = renderToStaticMarkup(<App />);
  const columns = [
    ...html.matchAll(
      /<div data-theme="([a-z-]+)" class="catalog-column">([\s\S]*?)(?=<div data-theme=|<\/div><\/main>)/g,
    ),
  ];

  expect(columns.map((m) => m[1])).toEqual(["light", "dark", "high-contrast"]);
  const strip = (body: string) =>
    body.replace(/<h2[^>]*>.*?<\/h2>/, "").replace(/_R_[a-z0-9]+_/gi, "id");
  const [light, dark, hc] = columns.map((m) => strip(m[2] ?? ""));
  expect(light?.length).toBeGreaterThan(1000);
  expect(dark).toBe(light);
  expect(hc).toBe(light);
});

test.each(presetNames)("the %s preset renders the same gallery markup as house", (preset) => {
  const gallery = (html: string) =>
    html.slice(html.indexOf('<div class="catalog-columns">')).replace(/_R_[a-z0-9]+_/gi, "id");
  expect(gallery(renderToStaticMarkup(<App initialPreset={preset} />))).toBe(
    gallery(renderToStaticMarkup(<App />)),
  );
});

test("the preset switcher offers every preset and marks the active one", () => {
  const html = renderToStaticMarkup(<App initialPreset="access" />);
  const nav = html.slice(html.indexOf('aria-label="Preset"'), html.indexOf('aria-label="Theme"'));
  expect(nav.match(/<button/g)).toHaveLength(presetNames.length);
  expect(nav).toMatch(/aria-pressed="true"[^>]*>Access</);
});

test("every theme column shows all six primitives", () => {
  const html = renderToStaticMarkup(<App />);
  for (const cls of ["h-button", "h-icon-button", "h-text", "h-stack", "h-surface", "h-field"]) {
    expect(
      html.split(`${cls} `).length - 1 + (html.split(`${cls}"`).length - 1),
    ).toBeGreaterThanOrEqual(3);
  }
});
