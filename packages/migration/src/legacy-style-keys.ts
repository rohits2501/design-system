import { deprecated, role, type Mapping } from "./types.ts";

/**
 * Keys of a runtime theme object (`theme.colors.primary`, `palette.textSecondary`) and the role
 * each becomes. This is the shape a JS theme or a CSS in JS setup tends to carry.
 */
export const legacyStyleKey: Record<string, Mapping> = {
  primary: role("accent"),
  primaryLight: role("accentSubtle"),
  onPrimary: role("accentContrast"),
  background: role("bg"),
  backgroundAlt: role("bgSubtle"),
  surface: role("surface"),
  card: role("surfaceRaised"),
  text: role("text"),
  textPrimary: role("text"),
  textSecondary: role("textMuted"),
  divider: role("border"),
  outline: role("borderStrong"),
  focus: role("focusRing"),
  success: role("success"),
  successLight: role("successSubtle"),
  warning: role("warning"),
  warningLight: role("warningSubtle"),
  error: role("danger"),
  errorLight: role("dangerSubtle"),
  info: role("info"),
  infoLight: role("infoSubtle"),
  secondary: deprecated("accent", "A second brand color. The system has one accent."),
  tertiary: deprecated(null, "Unused third brand color. Delete it."),
};
