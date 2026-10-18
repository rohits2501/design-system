// A runtime theme object read through style props, the pattern a JS theme or CSS in JS app carries.
export const legacyTheme = {
  colors: {
    primary: "#1976d2",
    onPrimary: "#ffffff",
    background: "#fafafa",
    card: "#ffffff",
    textPrimary: "#212121",
    textSecondary: "#757575",
    divider: "#e0e0e0",
    error: "#d32f2f",
    secondary: "#3b82f6",
  },
};

const { colors } = legacyTheme;

export const styles = {
  screen: { backgroundColor: colors.background },
  card: { backgroundColor: colors.card, borderColor: colors.divider },
  title: { color: colors.textPrimary },
  caption: { color: colors.textSecondary },
  cta: { backgroundColor: colors.primary, color: colors.onPrimary },
  link: { color: colors.secondary },
  error: { color: colors.error },
};
