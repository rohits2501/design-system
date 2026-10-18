# Migration

## Overview

`@house/migration` maps legacy hex colors, utility classes, and theme keys onto `@house/tokens` roles. Fixtures keep a before snippet and an after snippet.

## Key files

| File | Owns |
|---|---|
| `src/map.ts` | The mapping |
| `fixtures/` | Before and after snippets |

## Commands

```bash
npm test -w @house/migration
```

## Conventions

- Follow the root rules.
- A legacy color maps onto a token role. It does not add a second palette.

## Related specs

- [0001 Stack and architecture](../../docs/specs/0001-stack-and-architecture/index.md)

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
