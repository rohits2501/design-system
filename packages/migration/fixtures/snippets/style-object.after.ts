// The same styles on the plain token object. Works in a React Native StyleSheet or a web style prop.
import { themes } from "@house/tokens";

const { color } = themes.light;

export const styles = {
  screen: { backgroundColor: color.bg },
  card: { backgroundColor: color.surfaceRaised, borderColor: color.border },
  title: { color: color.text },
  caption: { color: color.textMuted },
  cta: { backgroundColor: color.accent, color: color.accentContrast },
  link: { color: color.accent },
  error: { color: color.danger },
};
