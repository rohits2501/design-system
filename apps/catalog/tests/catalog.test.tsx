import { renderToStaticMarkup } from "react-dom/server";
import { presetNames } from "@house/tokens";
import { expect, test } from "vite-plus/test";
import { App } from "../src/App.tsx";

function presetNav(markup: string): string {
  return markup.slice(markup.indexOf('aria-label="Preset"'), markup.indexOf('aria-label="Theme"'));
}

function buttonLabels(nav: string): string[] {
  return [...nav.matchAll(/>([^<]+)<\/button>/g)].map((match) => match[1] ?? "");
}

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

// covers: AC-8, AC-10
test.each(presetNames)("the %s preset renders the same gallery markup as the default", (preset) => {
  const gallery = (html: string) =>
    html.slice(html.indexOf('<div class="catalog-columns">')).replace(/_R_[a-z0-9]+_/gi, "id");
  expect(gallery(renderToStaticMarkup(<App initialPreset={preset} />))).toBe(
    gallery(renderToStaticMarkup(<App />)),
  );
});

// covers: AC-5, AC-10
test("the preset switcher names the five looks and presses stay by default", () => {
  const nav = presetNav(renderToStaticMarkup(<App />));
  expect(buttonLabels(nav)).toEqual(["Stay", "Glass", "Editorial", "Cinema", "Access"]);
  expect(nav).toMatch(/aria-pressed="true"[^>]*>Stay</);
});

// covers: AC-10
test("the theme switcher names the four views and presses side by side by default", () => {
  const markup = renderToStaticMarkup(<App />);
  const nav = markup.slice(markup.indexOf('aria-label="Theme"'), markup.indexOf("catalog-columns"));
  expect(buttonLabels(nav)).toEqual(["Side by side", "Light", "Dark", "High contrast"]);
  expect(nav).toMatch(/aria-pressed="true"[^>]*>Side by side</);
});

// covers: AC-10
test("starting on editorial presses that look and not stay", () => {
  const nav = presetNav(renderToStaticMarkup(<App initialPreset="editorial" />));
  expect(nav).toMatch(/aria-pressed="true"[^>]*>Editorial</);
  expect(nav).not.toMatch(/aria-pressed="true"[^>]*>Stay</);
});

// covers: AC-10
test("a single appearance shows the gallery once", () => {
  const count = (markup: string) => markup.split("Invoice 2041").length - 1;
  expect(count(renderToStaticMarkup(<App />))).toBe(3);
  const dark = renderToStaticMarkup(<App initialView="dark" />);
  expect(count(dark)).toBe(1);
  expect(dark).toMatch(/aria-pressed="true"[^>]*>Dark</);
});

// covers: AC-10
test("icon buttons have names and a field error is written out", () => {
  const markup = renderToStaticMarkup(<App />);
  for (const name of ["Previous page", "Next page", "Close"]) {
    expect(markup).toContain(`aria-label="${name}"`);
  }
  expect(markup).toContain("Vendor name");
  expect(markup).toContain("Invoice total");
  expect(markup).toContain("Use a full stop for decimals.");
  expect(markup).toContain('aria-invalid="true"');
  expect(markup).toContain(">Disabled<");
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
