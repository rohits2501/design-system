import { describe, expect, test } from "vite-plus/test";
import { colors, contrastRatio, themeNames, type ColorRoles } from "../src/index.ts";

type Role = keyof ColorRoles;

const backgrounds: Role[] = ["bg", "bgSubtle", "surface", "surfaceRaised"];
const foregrounds: Role[] = ["text", "textMuted", "accent", "success", "warning", "danger", "info"];
const statuses = ["accent", "success", "warning", "danger", "info"] as const;

/** Body text minimum: AA everywhere, AAA in the high contrast theme. */
const textMinimum = { light: 4.5, dark: 4.5, highContrast: 7 } as const;
/** Non text minimum (WCAG 1.4.11) for control outlines and the focus ring. */
const uiMinimum = 3;

describe.each(themeNames)("%s theme", (name) => {
  const c = colors[name];
  const min = textMinimum[name];

  test.each(backgrounds.flatMap((bg) => foregrounds.map((fg) => [fg, bg] as const)))(
    "%s text on %s",
    (fg, bg) => {
      expect(contrastRatio(c[fg], c[bg])).toBeGreaterThanOrEqual(min);
    },
  );

  test.each(statuses)("%s on its subtle background, and body text on it", (status) => {
    const subtle = c[`${status}Subtle`];
    expect(contrastRatio(c[status], subtle)).toBeGreaterThanOrEqual(min);
    expect(contrastRatio(c.text, subtle)).toBeGreaterThanOrEqual(min);
  });

  test.each(statuses)("accentContrast text on a solid %s fill", (status) => {
    expect(contrastRatio(c.accentContrast, c[status])).toBeGreaterThanOrEqual(min);
  });

  test.each(backgrounds)("control outline and focus ring against %s", (bg) => {
    expect(contrastRatio(c.borderStrong, c[bg])).toBeGreaterThanOrEqual(uiMinimum);
    expect(contrastRatio(c.focusRing, c[bg])).toBeGreaterThanOrEqual(uiMinimum);
  });
});

test("contrastRatio matches the WCAG reference values", () => {
  expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
  expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
  expect(contrastRatio("#777777", "#ffffff")).toBeCloseTo(4.48, 2);
});
