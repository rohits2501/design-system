# Architecture

## One source, two outputs

`packages/tokens/src/themes.ts` is the only place a color value is chosen. It points semantic roles at the primitive ramps in `palette.ts`. From that one source:

- `theme.css` is generated (`npm run emit -w @house/tokens`). A test fails if the checked in file drifts from the source.
- The package entry exports the same values as a plain object (`themes.light.color.bg`), so a React Native `StyleSheet` reads roles without importing CSS or React.

## Roles

| Role                                                    | CSS variable                       | Use                                       |
| ------------------------------------------------------- | ---------------------------------- | ----------------------------------------- |
| `bg`, `bgSubtle`                                        | `--bg`, `--bg-subtle`              | Page and inset backgrounds                |
| `surface`, `surfaceRaised`                              | `--surface`, `--surface-raised`    | Cards, panels, menus                      |
| `text`, `textMuted`                                     | `--text`, `--text-muted`           | Body and secondary text                   |
| `border`                                                | `--border`                         | Dividers. Decorative, no contrast minimum |
| `borderStrong`                                          | `--border-strong`                  | Control outlines, at least 3:1            |
| `accent`, `accentSubtle`                                | `--accent`, `--accent-subtle`      | Primary action, links, selection          |
| `accentContrast`                                        | `--accent-contrast`                | Text on any solid accent or status fill   |
| `focusRing`                                             | `--focus-ring`                     | Focus outline, at least 3:1               |
| `success`, `warning`, `danger`, `info` (plus `…Subtle`) | `--success`, `--success-subtle`, … | Status text and tinted backgrounds        |

Scale: `--space-0` to `--space-12` on a 4px grid, `--radius-sm` (4), `--radius-md` (8), `--radius-pill`, `--font-size-*` with matching `--line-height-*`, `--font-weight-*`, `--font-sans`, `--font-mono`, `--focus-ring-width`, `--focus-ring-offset`.

`borderStrong` and `focusRing` are additions to the planned role list: a divider and a control outline have different contrast rules (WCAG 1.4.11), so one `border` role could not serve both.

## Themes

Light is the default on `:root`. `data-theme="dark"` and `data-theme="high-contrast"` override the color roles on any wrapper. With no attribute set, `prefers-color-scheme: dark` and `prefers-contrast: more` pick the matching theme. High contrast is a light theme with black text and outlines.

Contrast is a test, not a review: every text role clears 4.5:1 on every background role in light and dark, and 7:1 in high contrast. Control outlines and the focus ring clear 3:1.

## Accent

One accent, an indigo. It is the only brand color in the default theme. An app that needs a different voice overrides `--accent` (and `--font-sans`) on a wrapper. It does not add a second palette, and a second accent is a named theme override in this package, not a file in the app.

## Primitives

`@house/react` ships plain React components and one `styles.css`. Classes are prefixed `h-` and read only token variables. Components touch no browser API at module scope, so a server rendered app can render them, and they carry no `use client` directive or framework import.

## Guard rails

- `scripts/check-raw-color.mjs` fails on a hex, `rgb()`, or `hsl()` value outside the token source. A consuming app runs it on new UI files, with a baseline for files that predate adoption.
- `perf/budgets.json` caps the gzip size of the catalog JavaScript and `theme.css`.
- `@house/migration` maps legacy colors, utility classes, and runtime style objects onto roles, with before and after snippets a later codemod can be scored against.
