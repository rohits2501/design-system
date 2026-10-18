import { presetColors } from "./preset-colors.ts";

/** Semantic color roles. The only color API product code may use. */
export interface ColorRoles {
  bg: string;
  bgSubtle: string;
  surface: string;
  surfaceRaised: string;
  text: string;
  textMuted: string;
  /** Dividers and card edges. Decorative, so no contrast minimum. */
  border: string;
  /** Control outlines (inputs, default buttons). At least 3:1 against surface. */
  borderStrong: string;
  accent: string;
  /** Text and icons placed on a solid accent or status fill. */
  accentContrast: string;
  accentSubtle: string;
  focusRing: string;
  success: string;
  successSubtle: string;
  warning: string;
  warningSubtle: string;
  danger: string;
  dangerSubtle: string;
  info: string;
  infoSubtle: string;
}

export const themeNames = ["light", "dark", "highContrast"] as const;
export type ThemeName = (typeof themeNames)[number];

/** The `data-theme` attribute value for each theme. */
export const themeAttribute: Record<ThemeName, string> = {
  light: "light",
  dark: "dark",
  highContrast: "high-contrast",
};

/** The default palette. Stay, in light, dark, and high contrast. */
export const colors: Record<ThemeName, ColorRoles> = presetColors.stay;

export const presetNames = ["stay", "glass", "editorial", "cinema", "access"] as const;
export type PresetName = (typeof presetNames)[number];

/** Spacing on a 4px grid, in pixels. */
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

/** Corner radius, in pixels. */
export const radius = {
  sm: 4,
  md: 8,
  pill: 999,
} as const;

/** Font size and line height pairs, in pixels. */
export const fontSize = {
  xs: { size: 12, lineHeight: 16 },
  sm: { size: 14, lineHeight: 20 },
  md: { size: 16, lineHeight: 24 },
  lg: { size: 18, lineHeight: 28 },
  xl: { size: 24, lineHeight: 32 },
  "2xl": { size: 32, lineHeight: 40 },
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  bold: 650,
} as const;

/** Web font stacks. An app may override `--font-sans` with its own voice. */
export const fontFamily = {
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
  reading: '"Source Sans 3 Variable", "Source Sans 3", ui-sans-serif, system-ui, sans-serif',
  dense: '"IBM Plex Sans Variable", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
} as const;

export const focusRing = {
  width: 2,
  offset: 2,
} as const;

export type FontSizeStep = keyof typeof fontSize;
export type FontScale = Record<FontSizeStep, { size: number; lineHeight: number }>;

/** Everything a preset sets besides color. Space and font weight are shared by every preset. */
export interface PresetMetrics {
  radius: { sm: number; md: number; pill: number };
  fontSize: FontScale;
  fontFamily: { sans: string; display: string; mono: string };
  /** Letter spacing for the xl and 2xl display sizes, in em. */
  trackingDisplay: number;
  /** Minimum heights of the small and medium controls, in pixels. */
  controlHeight: { sm: number; md: number };
  focusRing: { width: number; offset: number };
  /**
   * Frosted surfaces on the web: backdrop blur in pixels, surface opacity, and backdrop
   * saturation. High contrast and reduced transparency are always solid. Native screens ignore this.
   */
  material: { blur: number; alpha: number; saturate: number };
}

const solid = { blur: 0, alpha: 1, saturate: 1 } as const;

function stack(first: string[]): string {
  return [...first, 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'].join(", ");
}

/** Shared metrics the other presets start from. Stay overrides radius and font. */
const baseMetrics: PresetMetrics = {
  radius,
  fontSize,
  fontFamily: { sans: fontFamily.sans, display: fontFamily.sans, mono: fontFamily.mono },
  trackingDisplay: 0,
  controlHeight: { sm: 28, md: 36 },
  focusRing,
  material: solid,
};

/**
 * Fontsource's variable packages register "<Family> Variable", so each stack names that first,
 * then the static family an app may self-host, then the system.
 */
export const presetMetrics: Record<PresetName, PresetMetrics> = {
  editorial: {
    ...baseMetrics,
    radius: { sm: 0, md: 0, pill: 999 },
    fontSize: {
      ...fontSize,
      xl: { size: 40, lineHeight: 48 },
      "2xl": { size: 64, lineHeight: 72 },
    },
    fontFamily: {
      sans: '"Newsreader Variable", "Newsreader", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
      display:
        '"Fraunces Variable", "Fraunces", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
      mono: fontFamily.mono,
    },
    trackingDisplay: -0.03,
  },
  stay: {
    ...baseMetrics,
    radius: { sm: 999, md: 12, pill: 999 },
    fontFamily: {
      sans: stack(['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"']),
      display: stack(['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"']),
      mono: fontFamily.mono,
    },
  },
  glass: {
    ...baseMetrics,
    radius: { sm: 999, md: 22, pill: 999 },
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      display: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      mono: fontFamily.mono,
    },
    controlHeight: { sm: 28, md: 44 },
    material: { blur: 20, alpha: 0.62, saturate: 1.8 },
  },
  cinema: {
    ...baseMetrics,
    radius: { sm: 2, md: 4, pill: 999 },
    fontFamily: {
      sans: stack(['"Inter Tight Variable"', '"Inter Tight"', "Inter"]),
      display: stack(['"Inter Tight Variable"', '"Inter Tight"', "Inter"]),
      mono: fontFamily.mono,
    },
    trackingDisplay: -0.02,
  },
  access: {
    ...baseMetrics,
    radius: { sm: 4, md: 4, pill: 999 },
    fontSize: {
      xs: { size: 14, lineHeight: 20 },
      sm: { size: 16, lineHeight: 24 },
      md: { size: 18, lineHeight: 28 },
      lg: { size: 20, lineHeight: 28 },
      xl: { size: 28, lineHeight: 36 },
      "2xl": { size: 36, lineHeight: 44 },
    },
    fontFamily: {
      sans: stack(['"Atkinson Hyperlegible Next Variable"', '"Atkinson Hyperlegible Next"']),
      display: stack(['"Atkinson Hyperlegible Next Variable"', '"Atkinson Hyperlegible Next"']),
      mono: fontFamily.mono,
    },
    controlHeight: { sm: 36, md: 44 },
    focusRing: { width: 3, offset: 2 },
  },
};

/** Color roles for every preset and appearance. `stay` is `colors`, the default. */
export const presetColorRoles: Record<PresetName, Record<ThemeName, ColorRoles>> = presetColors;

export interface Theme {
  name: ThemeName;
  preset: PresetName;
  color: ColorRoles;
  space: typeof space;
  radius: PresetMetrics["radius"];
  fontSize: FontScale;
  fontWeight: typeof fontWeight;
  fontFamily: PresetMetrics["fontFamily"];
  trackingDisplay: number;
  controlHeight: PresetMetrics["controlHeight"];
  focusRing: PresetMetrics["focusRing"];
  material: PresetMetrics["material"];
}

function theme(preset: PresetName, name: ThemeName): Theme {
  const m = presetMetrics[preset];
  return {
    name,
    preset,
    color: presetColorRoles[preset][name],
    space,
    radius: m.radius,
    fontSize: m.fontSize,
    fontWeight,
    fontFamily: m.fontFamily,
    trackingDisplay: m.trackingDisplay,
    controlHeight: m.controlHeight,
    focusRing: m.focusRing,
    material: name === "highContrast" ? solid : m.material,
  };
}

function appearances(preset: PresetName): Record<ThemeName, Theme> {
  return {
    light: theme(preset, "light"),
    dark: theme(preset, "dark"),
    highContrast: theme(preset, "highContrast"),
  };
}

/** Plain values for React Native `StyleSheet` and other non CSS consumers. This is `stay`, the default preset. */
export const themes: Record<ThemeName, Theme> = appearances("stay");

/** Every preset in every appearance, e.g. `presets.stay.dark.color.accent`. */
export const presets = Object.fromEntries(
  presetNames.map((name) => [name, appearances(name)]),
) as Record<PresetName, Record<ThemeName, Theme>>;
