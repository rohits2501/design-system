# Tokens

## Overview

`@house/tokens` is the shared visual language. The web gets CSS variables. A native screen gets a plain token object. Stay is the default look. Glass, editorial, cinema, and access are opt in. Glass frosts light and dark.

## Key files

| File                   | Owns                                 |
| ---------------------- | ------------------------------------ |
| `src/themes.ts`        | Theme object and preset metrics      |
| `src/preset-colors.ts` | Locked colors                        |
| `src/theme.css`        | Stay, the look with no `data-preset` |
| `src/presets.css`      | Glass, editorial, cinema, and access |
| `src/css.ts`           | Emits both CSS files                 |

## Commands

```bash
npm run build -w @house/tokens
npm test -w @house/tokens
```

## Conventions

- Follow the root rules.
- Colors live in the token source. A raw color outside that source fails `npm run check:colors`.
- `fontFamily.reading` and `fontFamily.dense` are names only. A Fontsource file is loaded only when a look uses that face.

## Gotchas

- `theme.css` and `presets.css` are generated. Commit them. CI fails when the emit drifts.
- Clearing `data-preset` returns to stay. Glass is opt in, and its high contrast block is solid.

## Related specs

- [0001 Stack and architecture](../../docs/specs/0001-stack-and-architecture/index.md)
- [0002 Theme presets](../../docs/specs/0002-theme-presets/index.md)

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
