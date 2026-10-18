# House design system

## Stack

- **Language / Runtime**: TypeScript, strict, Node 22 (22.18 or newer)
- **Framework**: Vite+ 1.3.0 library workspace. The catalog is a Vite app. This repo is not an app framework.
- **Key dependencies**: vite-plus, React 19 (peer 18 or newer), TypeScript 7
- **Package manager**: npm workspaces

## Build approach

Tracer Bullet. Prove one real path through tokens, one control, and the catalog before filling out the library.

## Commands

```bash
npm install
npm run ready
npm run dev -w catalog
```

## Specs

Stored in `docs/specs/`. Format: `docs/specs/NNNN-title/`.

## Git

- integration: off

## Tooling

- Lint and format with `npx vp check`. Tests are unit and integration via `npx vp run -r test`, after a build. CI on main already runs the ready check. Before every commit, run `npm run ready` (format, lint, raw colors, build, tests, size budget). No commit hook is installed yet.

## Rules

- Functions are pure by default. Side effects stay at the edges. Data is immutable: use `const`, and do not mutate in place.
- Prefer plain functions over classes. Module level values are constants only.
- Expected failures return a Result or an explicit error.
- Tests assert input and output.
- Keep the workspace layout: `packages/tokens`, `packages/react`, `packages/migration`, `apps/catalog`.

## Agent skills

- [vite-plus](.agents/skills/vite-plus/): `firzus/agent-skills`, Vite+ and the `vp` CLI
- [vite](.agents/skills/vite/): `antfu/skills`, Vite config and library builds
- [vitest](.agents/skills/vitest/): `antfu/skills`, Vitest tests
- [tsdown](.agents/skills/tsdown/): `rolldown/tsdown`, library pack and type declarations
- [design-tokens](.agents/skills/design-tokens/): `julianoczkowski/designer-skills`, CSS variable tokens
- [vercel-composition-patterns](.agents/skills/vercel-composition-patterns/): `vercel-labs/agent-skills`, React composition, including React 19
- [vercel-react-best-practices](.agents/skills/vercel-react-best-practices/): `vercel-labs/agent-skills`, React performance
- [web-design-guidelines](.agents/skills/web-design-guidelines/): `vercel-labs/agent-skills`, UI and accessibility review

## Context files

- [packages/tokens/AGENTS.md](packages/tokens/AGENTS.md): token source, theme CSS, and contrast
- [packages/react/AGENTS.md](packages/react/AGENTS.md): React primitives
- [packages/migration/AGENTS.md](packages/migration/AGENTS.md): legacy style mapping
- [apps/catalog/AGENTS.md](apps/catalog/AGENTS.md): gallery app

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
