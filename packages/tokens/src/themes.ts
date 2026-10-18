import { palette as p } from "./palette.ts";

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

const light: ColorRoles = {
  bg: p.neutral[50],
  bgSubtle: p.neutral[100],
  surface: p.neutral[0],
  surfaceRaised: p.neutral[0],
  text: p.neutral[900],
  textMuted: p.neutral[600],
  border: p.neutral[200],
  borderStrong: p.neutral[500],
  accent: p.accent[600],
  accentContrast: p.neutral[0],
  accentSubtle: p.accent[50],
  focusRing: p.accent[600],
  success: p.green[700],
  successSubtle: p.green[50],
  warning: p.amber[700],
  warningSubtle: p.amber[50],
  danger: p.red[700],
  dangerSubtle: p.red[50],
  info: p.blue[700],
  infoSubtle: p.blue[50],
};

const dark: ColorRoles = {
  bg: p.neutral[950],
  bgSubtle: p.neutral[900],
  surface: p.neutral[900],
  surfaceRaised: p.neutral[850],
  text: p.neutral[50],
  textMuted: p.neutral[400],
  border: p.neutral[800],
  borderStrong: p.neutral[500],
  accent: p.accent[400],
  accentContrast: p.neutral[950],
  accentSubtle: p.accent[950],
  focusRing: p.accent[300],
  success: p.green[400],
  successSubtle: p.green[950],
  warning: p.amber[400],
  warningSubtle: p.amber[950],
  danger: p.red[400],
  dangerSubtle: p.red[950],
  info: p.blue[400],
  infoSubtle: p.blue[950],
};

const highContrast: ColorRoles = {
  bg: p.neutral[0],
  bgSubtle: p.neutral[100],
  surface: p.neutral[0],
  surfaceRaised: p.neutral[0],
  text: p.neutral[1000],
  textMuted: p.neutral[800],
  border: p.neutral[1000],
  borderStrong: p.neutral[1000],
  accent: p.accent[800],
  accentContrast: p.neutral[0],
  accentSubtle: p.accent[50],
  focusRing: p.neutral[1000],
  success: p.green[900],
  successSubtle: p.green[50],
  warning: p.amber[900],
  warningSubtle: p.amber[50],
  danger: p.red[900],
  dangerSubtle: p.red[50],
  info: p.blue[900],
  infoSubtle: p.blue[50],
};

export const colors: Record<ThemeName, ColorRoles> = { light, dark, highContrast };

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
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
} as const;

export const focusRing = {
  width: 2,
  offset: 2,
} as const;

export interface Theme {
  name: ThemeName;
  color: ColorRoles;
  space: typeof space;
  radius: typeof radius;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  focusRing: typeof focusRing;
}

function theme(name: ThemeName): Theme {
  return { name, color: colors[name], space, radius, fontSize, fontWeight, focusRing };
}

/** Plain values for React Native `StyleSheet` and other non CSS consumers. */
export const themes: Record<ThemeName, Theme> = {
  light: theme("light"),
  dark: theme("dark"),
  highContrast: theme("highContrast"),
};
