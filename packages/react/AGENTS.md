# React primitives

## Overview

`@house/react` is the small control set on the tokens: Button, IconButton, Text, Stack, Surface, and Field. Apps import the components and `styles.css`.

## Key files

| File             | Owns                              |
| ---------------- | --------------------------------- |
| `src/index.ts`   | Public components                 |
| `src/styles.css` | Control styles on token variables |

## Commands

```bash
npm test -w @house/react
```

## Conventions

- Follow the root rules.
- Components read CSS variables. Theme is an attribute on a wrapper, not a new prop.

## Related specs

- [0001 Stack and architecture](../../docs/specs/0001-stack-and-architecture/index.md)

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
