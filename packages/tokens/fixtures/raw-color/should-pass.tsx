// Token references, anchors, and ids are not colors.
export function Banner() {
  return (
    <a
      href="#main"
      id="banner-1"
      style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
    >
      Saved
    </a>
  );
}
