# House design system

One visual language for my web projects: semantic tokens, a small set of React primitives, and a check that keeps a second palette out.

| Package            | What it ships                                                                      |
| ------------------ | ---------------------------------------------------------------------------------- |
| `@house/tokens`    | `theme.css` (light, dark, high contrast) and a plain token object for React Native |
| `@house/react`     | `Button`, `IconButton`, `Text`, `Stack`, `Surface`, `Field` plus `styles.css`      |
| `@house/migration` | Legacy style fixtures mapped onto the tokens, with before and after snippets       |
| `apps/catalog`     | A Vite gallery that installs the packages the way a consuming app does             |

## Use it in an app

```ts
import "@house/tokens/theme.css";
import "@house/react/styles.css";
import { Button, Stack } from "@house/react";
```

Set `data-theme="dark"` or `data-theme="high-contrast"` on any wrapper to switch theme. An app may override `--accent` and `--font-sans` on a wrapper. It does not add its own palette.

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
npx vp check            # format, lint
npx vp run -r test      # unit, contrast, and mapping tests
npx vp run -r build     # pack the libraries, build the catalog
npm run check:colors    # fail on a raw color outside the token source
npm run check:budget    # fail when gzip size passes perf/budgets.json
```

Decisions live in [`docs/specs/`](docs/specs/) and [`docs/architecture.md`](docs/architecture.md).
