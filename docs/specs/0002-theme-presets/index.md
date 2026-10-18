# 0002. Theme presets as a second axis beside appearance

**Date**: 2026-10-18
**Status**: Accepted

## Summary

Stay is the default look. `theme.css` and the `themes` object are stay, so a page with no `data-preset` is the stay look: pill controls, Plus Jakarta Sans, and a solid surface. Glass, editorial, cinema, and access live in an opt in `presets.css`. Glass frosts regular buttons and surfaces. There is no house preset. Light, dark, and high contrast still work inside every look. Components stay the same; they only read variables.

Four more open faces join that contract. JetBrains Mono is the code face on every look. Newsreader is the editorial body, and Fraunces stays the large titles. Source Sans 3 and IBM Plex Sans stay as named stacks an app turns on itself. They are not new looks, and the catalog does not download their files. The catalog stylesheet had grown by loading faces no look paints.

## Requirements

**User stories**:

- As an app author, I want to pick a distinct look for a new product without writing a palette, so that every product still shares one component API and one set of contrast guarantees.
- As an existing app (the console, AudioForge, Bol), I want nothing to change unless I opt in, so that adopting a new version of the package is safe.
- As a reader who needs larger text and bigger targets, I want an accessible preset whose text clears 7:1 in every appearance, so that a product can ship that look without custom work.
- As an app author, I want a code face on every look, and two named text stacks I can turn on in my own app, so that long reading and dense screens stay inside the same tokens without the catalog paying for files no look uses.

**Acceptance criteria**:

- **AC-1**: An app that imports only `theme.css` renders the stay preset. `theme.css` contains no `data-preset` selector. `:root` carries stay: `--radius-sm: 999px`, `--radius-md: 12px`, Plus Jakarta Sans, `--surface-alpha: 1`, `--surface-backdrop: none`, `--control-height-sm: 28px`, `--control-height-md: 36px`. Its high contrast block is solid.
- **AC-2**: With `presets.css` imported and `<html data-preset="P">`, the page takes preset P's metrics and its light colors. Adding `data-theme="dark"` or `"high-contrast"` on `html` gives P's dark or high contrast colors.
- **AC-3**: With `data-preset` set and no `data-theme`, the operating system's dark setting and its more contrast setting pick P's dark and high contrast blocks. With neither attribute set, the page resolves to stay.
- **AC-4**: An element carrying `data-theme` inside `<html data-preset="P">` gets P's colors for that appearance, so catalog columns follow the active preset.
- **AC-5**: `presets.css` has no `stay` selector. Stay is only `theme.css`. Setting `data-preset` to glass, editorial, cinema, or access overrides it, and clearing the attribute returns to stay.
- **AC-6**: Every preset in every appearance passes the existing contrast bars: text 4.5:1 in light and dark, 7:1 in high contrast, control outline and focus ring 3:1. `access` text pairs clear 7:1 in all three appearances.
- **AC-7**: Stay, editorial, cinema, and access are solid (`--surface-alpha: 1`, `--surface-backdrop: none`) in light, dark, and high contrast. Glass light and dark use `--surface-alpha: 0.62` and `--surface-backdrop: blur(20px) saturate(1.8)`. Glass high contrast is solid. `prefers-reduced-transparency: reduce` keeps every surface solid, including glass and the catalog columns.
- **AC-8**: Components gain no new props. `Text` sizes xl and 2xl use `--font-display` and `--tracking-display`. `Button`, `IconButton`, and `.h-input` heights come from the control height variables. The rendered markup of the gallery is identical across presets.
- **AC-9**: `themes` and `colors` equal the stay palette. `presets` has stay, glass, editorial, cinema, and access. Glass light and dark are frosted. High contrast material is always solid.
- **AC-10**: The catalog has a preset switcher on the document element, loads the six open families a look uses (Plus Jakarta Sans, Fraunces, Inter Tight, Atkinson Hyperlegible Next, Newsreader, and JetBrains Mono), and renders every preset in every appearance with the same primitives. It does not load Source Sans 3 or IBM Plex Sans, and it shows no Faces sample.
- **AC-11**: `theme.css` stays under its gzip ceiling (raised only if the new house variables require it), `presets.css` has its own ceiling, and the catalog ceilings sit about 10 percent above the measured sizes.
- **AC-12**: No raw color appears outside the token source, `@house/tokens` ships no font binaries, and nothing calls a font CDN.
- **AC-13**: Every preset, including the stay block in `theme.css`, sets `--font-mono` to `"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`. Editorial sets `--font-sans` to `"Newsreader Variable", "Newsreader", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif`, and keeps Fraunces as `--font-display`. `fontFamily.reading` is `"Source Sans 3 Variable", "Source Sans 3", ui-sans-serif, system-ui, sans-serif`. `fontFamily.dense` is `"IBM Plex Sans Variable", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif`. Stay, glass, cinema, and access keep their current sans and display stacks. The two extra stacks are not presets.

## Decision

**Chosen option**: Option 2: presets as a second attribute axis, shipped in a separate opt in `presets.css`.

Presets are named sets of token values selected by `data-preset`, orthogonal to `data-theme`, emitted from the same TypeScript source into a file apps import only when they want them.

## Feature design

**Token source** (`packages/tokens/src/`):

- `themes.ts`: `presetNames` (`stay`, `glass`, `editorial`, `cinema`, `access`), `presetMetrics` (radius, font scale in px, sans/display/mono stacks, display tracking in em, control heights, focus ring, material), `presetColorRoles`, `presets`, and `themes` (stay).
- `preset-colors.ts`: the locked color roles for stay, glass, editorial, cinema, and access, light, dark, and high contrast. These values are the contract; a change goes through the contrast test.

**Locked values**: the hexes, radii, stacks, and type overrides are recorded in the phase 2 plan and now live in `preset-colors.ts` and `presetMetrics`. Summary per preset:

| Preset    | Radius sm/md | Sans / display             | Type change                           | Controls sm/md | Material (light, dark)            |
| --------- | ------------ | -------------------------- | ------------------------------------- | -------------- | --------------------------------- |
| stay      | 999 / 12     | Plus Jakarta Sans          | none                                  | 28 / 36        | solid                             |
| glass     | 999 / 22     | system (`-apple-system`)   | none                                  | 28 / 44        | blur 20, alpha 0.62, saturate 1.8 |
| editorial | 0 / 0        | Newsreader / Fraunces      | xl 40/48, 2xl 64/72, tracking -0.03em | 28 / 36        | solid                             |
| cinema    | 2 / 4        | Inter Tight                | tracking -0.02em                      | 28 / 36        | solid                             |
| access    | 4 / 4        | Atkinson Hyperlegible Next | one step up (md 18/28)                | 36 / 44        | solid                             |

Each open family is named as `"<Family> Variable"` first (the name Fontsource variable packages register), then the static family, then the system.

Every preset shares one mono stack: JetBrains Mono, then the system mono. Editorial body text is Newsreader. Two more stacks live on `fontFamily` and on no preset: `reading` (Source Sans 3) and `dense` (IBM Plex Sans). An app opts in by setting `--font-sans` to that stack and installing the package itself. The catalog imports `@fontsource-variable/newsreader` and `@fontsource-variable/jetbrains-mono`, plus the four faces the other looks already use. It does not import `@fontsource-variable/source-sans-3` or `@fontsource-variable/ibm-plex-sans`, and it has no Faces sample. Every named family is SIL Open Font License 1.1. Tokens still ship no font files.

**CSS contract**:

New variables on every block: `--font-display`, `--tracking-display`, `--surface-alpha`, `--surface-backdrop`, `--control-height-sm`, `--control-height-md`. Focus ring width becomes per preset through the existing `--focus-ring-width`.

`theme.css` (stay, no `data-preset` selectors): `:root` is stay light, including its solid material. `data-theme` and the operating system media rules carry the other stay appearances. High contrast is solid.

`presets.css`, in this order:

1. Per opt in preset P (glass, editorial, cinema, access): `html[data-preset="P"], [data-preset="P"] [data-theme="light"]` sets P metrics plus P light colors. Glass also sets its frosted material.
2. Per P: `html[data-preset="P"][data-theme="dark"], [data-preset="P"] [data-theme="dark"]` sets P dark colors; same for `high-contrast` with solid material.
3. Per P: `@media (prefers-color-scheme: dark)` and `@media (prefers-contrast: more)` with `html[data-preset="P"]:not([data-theme])`.
4. Last rule: `@media (prefers-reduced-transparency: reduce)` resets `--surface-alpha: 1` and `--surface-backdrop: none` on `:root, [data-preset], [data-preset] [data-theme]`.

**Component contract** (`packages/react/src/styles.css`, no new props):

- `.h-text--xl, .h-text--2xl`: `font-family: var(--font-display); letter-spacing: var(--tracking-display)`.
- `.h-surface--default`, `.h-surface--raised`: background `color-mix(in srgb, var(--surface or --surface-raised) calc(var(--surface-alpha) * 100%), transparent)`, `backdrop-filter` and `-webkit-backdrop-filter: var(--surface-backdrop)`.
- Regular `.h-button` and icon buttons use that same frost, plus a 1px top highlight whose strength is `1 - --surface-alpha` (invisible when alpha is 1). `.h-button--primary` stays a solid `--accent` fill, with no backdrop and no highlight.
- `.h-button--sm`, `.h-button--md`, `.h-icon-button` sizes, `.h-input`: `min-height`, `width` from `--control-height-sm` / `--control-height-md`.

**Value sourcing**:

| Action                | Value                                           | Source                                                                                    |
| --------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Render any component  | color roles                                     | `presetColorRoles[preset][appearance]` emitted as CSS variables                           |
| Render any component  | radius, type scale, control heights, focus ring | `presetMetrics[preset]`                                                                   |
| Choose the preset     | the active preset                               | `data-preset` on `html` (app or catalog switcher); absent means stay                      |
| Choose the appearance | light, dark, high contrast                      | `data-theme` on `html` or an element; absent means the OS settings                        |
| Frosted surface       | blur, opacity, and saturation                   | `presetMetrics[preset].material`, forced solid for high contrast and reduced transparency |
| Show a real font      | the font file                                   | the app or catalog imports the Fontsource package; tokens name the family only            |
| Code text             | `--font-mono`                                   | the shared JetBrains Mono stack on every preset, including stay in `theme.css`            |
| Editorial body        | `--font-sans` on the editorial preset           | the Newsreader stack; `--font-display` stays Fraunces                                     |
| Long product reading  | the reading stack                               | `fontFamily.reading` (Source Sans 3); the app sets `--font-sans` and loads the file       |
| Dense admin text      | the dense stack                                 | `fontFamily.dense` (IBM Plex Sans); the app sets `--font-sans` and loads the file         |
| Native screen         | any value                                       | `presets[name][appearance]` or `themes` (stay)                                            |

**Key invariants**:

- Stay is what a page gets when no preset is set. Glass is opt in. There is no house preset. Regular buttons frost only when the active preset's material does. Primary buttons stay a solid accent fill.
- Components read only variables; no component branches on preset.
- Contrast is measured on the solid hex, never through blur.

**Security model**: not applicable (static styling). Licensing: no brand names, brand colors (`#FF385C`, `#E50914`, `#007AFF`), licensed fonts, or third party template code.

**Critical test scenarios**:

- `theme.css` drift test and a check that it has no `data-preset` selector, verifies **AC-1**.
- Selector order assertions in the emitted `presets.css` (preset blocks, media rules, reduced transparency last), verifies **AC-2**, **AC-3**, **AC-4**, **AC-5**, **AC-7**.
- Contrast matrix over `presetNames` by `themeNames`, plus 7:1 for access, verifies **AC-6**.
- Token object: `themes` equals `presets.stay`, JSON round trip, high contrast material solid, verifies **AC-9**.
- Catalog: identical markup per preset, the six Fontsource imports a look uses, no Faces sample, and no Source Sans 3 or IBM Plex Sans import, verifies **AC-8**, **AC-10**.
- Emitted stacks: shared mono, editorial sans, `fontFamily.reading`, and `fontFamily.dense` match the strings in **AC-13**. Stay, glass, cinema, and access sans and display stacks are unchanged.
- `npm run check:budget` and `npm run check:colors`, verifies **AC-11**, **AC-12**.

## Build plan

1. Preset model in `themes.ts` and `preset-colors.ts` (done, commit `a8b3dbc`), satisfies **AC-9**.
2. Emit house defaults into `theme.css` and the ordered `presets.css`; export `./presets.css` from the package (done, `d88ceb7`), satisfies **AC-1**, **AC-2**, **AC-3**, **AC-4**, **AC-5**, **AC-7**.
3. Tests: generalized contrast matrix, selector assertions, token object checks (done, `721a8a4`), satisfies **AC-1** to **AC-7**, **AC-9**.
4. Component rules in `styles.css` (done, `73dd75b`), satisfies **AC-7**, **AC-8**.
5. Catalog: preset switcher, `presets.css`, four Fontsource packages, catalog test, browser check of every preset and appearance (done, `30a7bf7`), satisfies **AC-8**, **AC-10**.
6. Budgets, architecture doc, README, version 0.2.0 (done), satisfies **AC-11**, **AC-12**.
7. Name the four stacks in `themes.ts` (shared mono, editorial sans, `fontFamily.reading`, `fontFamily.dense`) and emit them (done), satisfies **AC-13**.
8. Catalog imported Newsreader, Source Sans 3, IBM Plex Sans, and JetBrains Mono, and showed the reading and dense specimens (done, then narrowed by task 9), satisfies **AC-13**.
9. Remove `@fontsource-variable/source-sans-3` and `@fontsource-variable/ibm-plex-sans` from the catalog (`apps/catalog/package.json`, `main.tsx`, and lockfile), remove the Faces section from `App.tsx`, and update catalog tests (`main.test.ts`, `catalog.test.tsx`) and `docs/architecture.md`. Keep `fontFamily.reading` and `fontFamily.dense` in tokens. Run `npm run ready`, read the gzipped catalog CSS from `npm run check:budget`, and set `perf/budgets.json` catalog CSS `maxBytes` to about 10 percent above that measured size in the same change (done), satisfies **AC-10**, **AC-11**.

## Consequences

**Positive**:

- New products get a distinct look without a second palette or a component fork.
- The catalog stylesheet stops paying for two faces no look uses.
- Existing apps are untouched until they opt in.

**Negative / tradeoffs**:

- `presets.css` repeats each preset's roles across appearances and media rules; it is several times the size of `theme.css`, paid only by apps that import it.
- Glass and stay set `--radius-sm` to 999, so every control on `--radius-sm` becomes a pill, including any multi line text area an app styles with that variable.
- Glass blur depends on `backdrop-filter`; `prefers-reduced-transparency` is not supported in every browser, so the solid fallback relies on high contrast or the app.
- Preset scoping is page level (`html`) plus appearance on descendants. A whole nested preset subtree is not supported.
- Editorial body falls back to a serif (Georgia and its neighbors) when Newsreader is not loaded, so that look's body is no longer the system sans.
- `theme.css` names JetBrains Mono. An app that does not load the file still renders the system mono. The family name in the file changes on the next pack.
- Source Sans 3 and IBM Plex Sans stay as names only. An app that copies the stack and does not install the package gets the system sans. The catalog no longer proves those two faces on screen.

**Neutral**:

- `Theme` gains fields; `themes` keeps its values, so native callers keep working.
- Consuming repos keep their current tarballs until a new pack is cut.

## Follow-up

- [ ] Cut a 0.2.0 tarball for an app only when that app chooses a preset.
- [ ] A link primitive would let `access` underline links in the package instead of in each app.
- [ ] A density axis (`data-density`) stays out of this slice.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).
