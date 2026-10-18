/**
 * Primitive ramps. Nothing outside this package reads these directly: semantic
 * roles in `themes.ts` point at them, and the public API only exposes roles.
 */
export const palette = {
  neutral: {
    0: "#ffffff",
    50: "#f7f7f8",
    100: "#eeeef1",
    200: "#dedee4",
    300: "#c4c4cd",
    400: "#9d9daa",
    500: "#73737f",
    600: "#585863",
    700: "#42424b",
    800: "#2c2c33",
    850: "#222228",
    900: "#18181c",
    950: "#0f0f12",
    1000: "#000000",
  },
  accent: {
    50: "#eef1ff",
    100: "#e0e6ff",
    300: "#a6b2fc",
    400: "#8591f8",
    600: "#4d44e0",
    800: "#352f9e",
    900: "#2c2a78",
    950: "#1d1b47",
  },
  green: {
    50: "#edfcf3",
    400: "#4fd884",
    700: "#157a3b",
    900: "#124d2a",
    950: "#0a2a17",
  },
  amber: {
    50: "#fffaeb",
    400: "#f9be2a",
    700: "#94570a",
    900: "#6b3e0c",
    950: "#33240a",
  },
  red: {
    50: "#fef2f2",
    400: "#f77b7b",
    700: "#b4201f",
    900: "#7c1d1d",
    950: "#3b1010",
  },
  blue: {
    50: "#eff5ff",
    400: "#66a8f8",
    700: "#1f4fd1",
    900: "#1e3a86",
    950: "#0d1d3d",
  },
} as const;
