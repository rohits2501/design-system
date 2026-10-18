# House design system

One visual language for my web projects: semantic tokens, a small set of React primitives, and a check that keeps a second palette out.

| Package            | What it ships                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `@house/tokens`    | `theme.css` (light, dark, high contrast), opt in `presets.css`, and a plain token object for React Native |
| `@house/react`     | `Button`, `IconButton`, `Text`, `Stack`, `Surface`, `Field` plus `styles.css`                             |
| `@house/migration` | Legacy style fixtures mapped onto the tokens, with before and after snippets                              |
| `apps/catalog`     | A Vite gallery that installs the packages the way a consuming app does                                    |

## Use it in an app

```ts
import "@house/tokens/theme.css";
import "@house/react/styles.css";
import { Button, Stack } from "@house/react";
```

`theme.css` is the glass look: pill controls, a frosted surface, and the system font. Set `data-theme="dark"` or `data-theme="high-contrast"` on any wrapper to switch appearance. High contrast is solid. An app may override `--accent` and `--font-sans` on a wrapper. It does not add its own palette.

For another look, opt in and set `data-preset` on `html`:

```ts
import "@house/tokens/theme.css";
import "@house/tokens/presets.css";
document.documentElement.dataset.preset = "editorial"; // editorial, stay, cinema, access
```

`data-theme` still works inside a preset. Presets name their fonts but ship none; install the face you want (for example from Fontsource) or the system font is used. See [Presets](docs/architecture.md#presets) for what each one changes.

React Native screens import values, not CSS:

```ts
import { themes } from "@house/tokens";
const t = themes.light;
StyleSheet.create({ screen: { backgroundColor: t.color.bg } });
```

## Develop

This repo is built with [Vite+](https://viteplus.dev/) 1.3.0. Node 22.18 or newer.

```bash
npm install
npm run ready           # everything CI runs, in CI's order
npx vp check            # format, lint
npm run check:colors    # fail on a raw color outside the token source
npx vp run -r build     # pack the libraries in order, build the catalog
npx vp run -r test      # unit, contrast, preset, and mapping tests (after a build)
npm run check:budget    # fail when gzip size passes perf/budgets.json
```

Decisions live in [`docs/specs/`](docs/specs/) and [`docs/architecture.md`](docs/architecture.md).
