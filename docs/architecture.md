# Architecture

## One source, two outputs

`packages/tokens/src/preset-colors.ts` is the only place a color value is chosen. `themes.ts` turns those roles into the token object. From that one source:

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

Scale: `--space-0` to `--space-12` on a 4px grid, `--radius-sm` (4), `--radius-md` (8), `--radius-pill`, `--font-size-*` with matching `--line-height-*`, `--font-weight-*`, `--font-sans`, `--font-display`, `--font-mono`, `--tracking-display`, `--control-height-sm` (28), `--control-height-md` (36), `--focus-ring-width`, `--focus-ring-offset`, `--surface-alpha` (1), `--surface-backdrop` (`none`).

`borderStrong` and `focusRing` are additions to the planned role list: a divider and a control outline have different contrast rules (WCAG 1.4.11), so one `border` role could not serve both.

## Themes

Light is the default on `:root`. `data-theme="dark"` and `data-theme="high-contrast"` override the color roles on any wrapper. With no attribute set, `prefers-color-scheme: dark` and `prefers-contrast: more` pick the matching theme. High contrast is a light theme with black text and outlines.

Contrast is a test, not a review: every text role clears 4.5:1 on every background role in light and dark, and 7:1 in high contrast. Control outlines and the focus ring clear 3:1.

## Presets

A preset is a second axis beside the theme: `data-preset` picks a look, and `data-theme` still picks light, dark, or high contrast inside it. Stay is the default and needs no attribute: `theme.css` and `themes` are stay. Glass, editorial, cinema, and access live in the opt in `presets.css`.

- Set `data-preset` on `html` to leave stay. Descendants may carry `data-theme` (the catalog columns do) and follow the page preset. A nested preset inside another preset is not supported.
- A preset sets colors, radius, type scale, sans and display stacks, display tracking, control heights, focus ring width, and surface material. Components read these through `--font-display`, `--tracking-display`, `--control-height-sm`, `--control-height-md`, `--surface-alpha`, and `--surface-backdrop`; none of them branch on the preset.
- `stay` and `glass` set `--radius-sm` to 999, so buttons and inputs become pills and icon buttons become circles. Style a multi line text area with `--radius-md`.
- Stay, editorial, cinema, and access are solid. Glass light and dark frost regular buttons and surfaces (`blur(20px) saturate(1.8)`, alpha 0.62). A primary button stays a solid accent fill. High contrast and `prefers-reduced-transparency: reduce` stay solid. Contrast is tested on the solid color.
- Tokens name font families; they ship no font files. An app that wants the real face installs it. The catalog loads the six Fontsource families a look uses: Fraunces, Plus Jakarta Sans, Inter Tight, Atkinson Hyperlegible Next, Newsreader, and JetBrains Mono, all OFL. `fontFamily.reading` and `fontFamily.dense` name Source Sans 3 and IBM Plex Sans; an app loads those packages itself. Without a file the stack falls back to the system.
- `access` holds every text pair at 7:1 in all three appearances, steps type up one size (body 18px), and raises controls to 36 and 44px with a 3px focus ring. Underline links in the app when using it.
- Presets are original values in the spirit of public patterns, not brand copies: no brand names, brand colors, licensed fonts, or third party theme code.

## Accent

The default accent is stay's rose. An app that needs a different voice overrides `--accent` (and `--font-sans`) on a wrapper, or picks a preset. It does not add a second palette.

## Primitives

`@house/react` ships plain React components and one `styles.css`. Classes are prefixed `h-` and read only token variables. Components touch no browser API at module scope, so a server rendered app can render them, and they carry no `use client` directive or framework import.

## Guard rails

- `scripts/check-raw-color.mjs` fails on a hex, `rgb()`, or `hsl()` value outside the token source. A consuming app runs it on new UI files, with a baseline for files that predate adoption.
- `perf/budgets.json` caps the gzip size of the catalog JavaScript and CSS, `theme.css`, `presets.css`, and each package bundle.
- CI builds the packages before testing (Vite+ does not read npm `"*"` workspace ranges as task edges, so build order is declared with `dependsOn`), and fails if regenerated CSS differs from what is committed.
- `@house/migration` maps legacy colors, utility classes, and runtime style objects onto roles, with before and after snippets a later codemod can be scored against.
