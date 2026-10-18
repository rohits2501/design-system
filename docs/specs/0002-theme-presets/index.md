# 0002. Theme presets as a second axis beside appearance

**Date**: 2026-10-18
**Status**: In Progress

## Summary

The house design system gets five optional looks, called presets: glass, editorial, stay, cinema, and access. A preset changes colors, corner shapes, fonts, and a few sizes, while light, dark, and high contrast still work inside each one. Apps opt in by importing one extra CSS file and setting `data-preset` on the page, so apps that only import `theme.css` see no change. Components stay the same; they only read variables.

## Requirements

**User stories**:

- As an app author, I want to pick a distinct look for a new product without writing a palette, so that every product still shares one component API and one set of contrast guarantees.
- As an existing app (the console, AudioForge, Bol), I want nothing to change unless I opt in, so that adopting a new version of the package is safe.
- As a reader who needs larger text and bigger targets, I want an accessible preset whose text clears 7:1 in every appearance, so that a product can ship that look without custom work.

**Acceptance criteria**:

- **AC-1**: An app that imports only `theme.css` renders as before. Every existing house value is unchanged, `theme.css` contains no `data-preset` selector, and the new variables carry house defaults: `--font-display` equals the sans stack, `--tracking-display: 0em`, `--surface-alpha: 1`, `--surface-backdrop: none`, `--control-height-sm: 28px`, `--control-height-md: 36px`.
- **AC-2**: With `presets.css` imported and `<html data-preset="P">`, the page takes preset P's metrics and its light colors. Adding `data-theme="dark"` or `"high-contrast"` on `html` gives P's dark or high contrast colors.
- **AC-3**: With `data-preset` set and no `data-theme`, the operating system's dark setting and its more contrast setting pick P's dark and high contrast blocks. With neither attribute set, the page resolves to house exactly as today.
- **AC-4**: An element carrying `data-theme` inside `<html data-preset="P">` gets P's colors for that appearance, so catalog columns follow the active preset.
- **AC-5**: An element carrying `data-preset="house"`, with or without its own `data-theme`, renders house values even inside another preset.
- **AC-6**: Every preset in every appearance passes the existing contrast bars: text 4.5:1 in light and dark, 7:1 in high contrast, control outline and focus ring 3:1. `access` text pairs clear 7:1 in all three appearances.
- **AC-7**: Glass light and dark paint surfaces at 72 percent opacity with a 24px backdrop blur. Glass high contrast, every other preset, house, and anything under `prefers-reduced-transparency: reduce` (including catalog columns) are solid with `backdrop-filter: none`.
- **AC-8**: Components gain no new props. `Text` sizes xl and 2xl use `--font-display` and `--tracking-display`. `Button`, `IconButton`, and `.h-input` heights come from the control height variables. The rendered markup of the gallery is identical across presets.
- **AC-9**: The token object stays backward compatible. `themes` is house and unchanged in value. `presets[name][appearance]` is plain JSON for every preset, and high contrast material is always solid.
- **AC-10**: The catalog has a preset switcher on the document element, loads the four open font families, and renders every preset in every appearance with the same primitives.
- **AC-11**: `theme.css` stays under its gzip ceiling (raised only if the new house variables require it), `presets.css` has its own ceiling, and the catalog ceilings sit about 10 percent above the measured sizes.
- **AC-12**: No raw color appears outside the token source, `@house/tokens` ships no font binaries, and nothing calls a font CDN.

## Decision

**Chosen option**: Option 2: presets as a second attribute axis, shipped in a separate opt in `presets.css`.

Presets are named sets of token values selected by `data-preset`, orthogonal to `data-theme`, emitted from the same TypeScript source into a file apps import only when they want them.

## Feature design

**Token source** (`packages/tokens/src/`):

- `themes.ts`: `presetNames` (`house`, `glass`, `editorial`, `stay`, `cinema`, `access`), `presetMetrics` (radius, font scale in px, sans/display/mono stacks, display tracking in em, control heights, focus ring, material), `presetColorRoles`, `presets`, and `themes` (house).
- `preset-colors.ts`: the locked color roles for the five non house presets, light, dark, and high contrast. These values are the contract; a change goes through the contrast test.

**Locked values**: the hexes, radii, stacks, and type overrides are recorded in the phase 2 plan and now live in `preset-colors.ts` and `presetMetrics`. Summary per preset:

| Preset    | Radius sm/md | Sans / display             | Type change                           | Controls sm/md | Material (light, dark) |
| --------- | ------------ | -------------------------- | ------------------------------------- | -------------- | ---------------------- |
| house     | 4 / 8        | system / system            | none                                  | 28 / 36        | solid                  |
| glass     | 999 / 16     | Apple system stack         | none                                  | 28 / 36        | blur 24px, alpha 0.72  |
| editorial | 0 / 0        | system / Fraunces          | xl 40/48, 2xl 64/72, tracking -0.03em | 28 / 36        | solid                  |
| stay      | 999 / 12     | Plus Jakarta Sans          | none                                  | 28 / 36        | solid                  |
| cinema    | 2 / 4        | Inter Tight                | tracking -0.02em                      | 28 / 36        | solid                  |
| access    | 4 / 4        | Atkinson Hyperlegible Next | one step up (md 18/28)                | 36 / 44        | solid                  |

Each open family is named as `"<Family> Variable"` first (the name Fontsource variable packages register), then the static family, then the system.

**CSS contract**:

New variables on every block: `--font-display`, `--tracking-display`, `--surface-alpha`, `--surface-backdrop`, `--control-height-sm`, `--control-height-md`. Focus ring width becomes per preset through the existing `--focus-ring-width`.

`theme.css` (house only, unchanged selectors): `:root` adds the house defaults above.

`presets.css`, in this order:

1. Per non house preset P: `html[data-preset="P"], [data-preset="P"] [data-theme="light"]` sets P metrics plus P light colors.
2. Per P: `html[data-preset="P"][data-theme="dark"], [data-preset="P"] [data-theme="dark"]` sets P dark colors; same for `high-contrast` with solid material.
3. Per P: `@media (prefers-color-scheme: dark)` and `@media (prefers-contrast: more)` with `html[data-preset="P"]:not([data-theme])`.
4. House pairs last: `[data-preset="house"], [data-preset="house"] [data-theme="light"]` with house metrics and light colors, then the dark and high contrast pairs, so an explicit house wins inside another preset.
5. Last rule: `@media (prefers-reduced-transparency: reduce)` resets `--surface-alpha: 1` and `--surface-backdrop: none` on `:root, [data-preset], [data-preset] [data-theme]`.

**Component contract** (`packages/react/src/styles.css`, no new props):

- `.h-text--xl, .h-text--2xl`: `font-family: var(--font-display); letter-spacing: var(--tracking-display)`.
- `.h-surface--default`, `.h-surface--raised`: background `color-mix(in srgb, var(--surface or --surface-raised) calc(var(--surface-alpha) * 100%), transparent)`, `backdrop-filter` and `-webkit-backdrop-filter: var(--surface-backdrop)`.
- `.h-button--sm`, `.h-button--md`, `.h-icon-button` sizes, `.h-input`: `min-height`, `width` from `--control-height-sm` / `--control-height-md`.

**Value sourcing**:

| Action                | Value                                           | Source                                                                                    |
| --------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Render any component  | color roles                                     | `presetColorRoles[preset][appearance]` emitted as CSS variables                           |
| Render any component  | radius, type scale, control heights, focus ring | `presetMetrics[preset]`                                                                   |
| Choose the preset     | the active preset                               | `data-preset` on `html` (app or catalog switcher); absent means house                     |
| Choose the appearance | light, dark, high contrast                      | `data-theme` on `html` or an element; absent means the OS settings                        |
| Frosted surface       | blur and opacity                                | `presetMetrics[preset].material`, forced solid for high contrast and reduced transparency |
| Show a real font      | the font file                                   | the app or catalog imports the Fontsource package; tokens name the family only            |
| Native screen         | any value                                       | `presets[name][appearance]` or `themes` (house)                                           |

**Key invariants**:

- House values never change as a side effect of a preset.
- Components read only variables; no component branches on preset.
- Contrast is measured on the solid hex, never through blur.

**Security model**: not applicable (static styling). Licensing: no brand names, brand colors (`#FF385C`, `#E50914`, `#007AFF`), licensed fonts, or third party template code.

**Critical test scenarios**:

- `theme.css` drift test and a check that it has no `data-preset` selector, verifies **AC-1**.
- Selector order assertions in the emitted `presets.css` (preset blocks, media rules, house pairs, reduced transparency last), verifies **AC-2**, **AC-3**, **AC-4**, **AC-5**, **AC-7**.
- Contrast matrix over `presetNames` by `themeNames`, plus 7:1 for access, verifies **AC-6**.
- Token object: `themes` equals `presets.house`, JSON round trip, high contrast material solid, verifies **AC-9**.
- Catalog: identical markup per preset, verifies **AC-8**, **AC-10**.
- `npm run check:budget` and `npm run check:colors`, verifies **AC-11**, **AC-12**.

## Build plan

1. Preset model in `themes.ts` and `preset-colors.ts` (done, commit `a8b3dbc`), satisfies **AC-9**.
2. Emit house defaults into `theme.css` and the ordered `presets.css`; export `./presets.css` from the package, satisfies **AC-1**, **AC-2**, **AC-3**, **AC-4**, **AC-5**, **AC-7**.
3. Tests: generalized contrast matrix, selector assertions, token object checks, satisfies **AC-1** to **AC-7**, **AC-9**.
4. Component rules in `styles.css`, satisfies **AC-7**, **AC-8**.
5. Catalog: preset switcher, `presets.css`, four Fontsource packages, catalog test, browser check of every preset and appearance, satisfies **AC-8**, **AC-10**.
6. Budgets, architecture doc, README, version 0.2.0, satisfies **AC-11**, **AC-12**.

## Consequences

**Positive**:

- New products get a distinct look without a second palette or a component fork.
- Existing apps are untouched until they opt in.

**Negative / tradeoffs**:

- `presets.css` repeats each preset's roles across appearances and media rules; it is several times the size of `theme.css`, paid only by apps that import it.
- Glass and stay set `--radius-sm` to 999, so every control on `--radius-sm` becomes a pill, including any multi line text area an app styles with that variable.
- Glass blur depends on `backdrop-filter`; `prefers-reduced-transparency` is not supported in every browser, so the solid fallback relies on high contrast or the app.
- Preset scoping is page level (`html`) plus appearance on descendants; a whole nested preset subtree other than house is not supported.

**Neutral**:

- `Theme` gains fields; `themes` keeps its values, so native callers keep working.
- Consuming repos keep their current tarballs until a new pack is cut.

## Follow-up

- [ ] Cut a 0.2.0 tarball for an app only when that app chooses a preset.
- [ ] A link primitive would let `access` underline links in the package instead of in each app.
- [ ] A density axis (`data-density`) stays out of this slice.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).
