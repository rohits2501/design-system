# Verify: Stack and architecture · spec 0001 · updated 2026-10-18

_Steps derived from spec 0001. This decision spec has no acceptance criteria, so the steps follow the scaffold gate. `/check verify` runs these; `/test` locks the durable ones._

## Commands

- [x] `npx vp install` from the repo root, with Node 22.18 or newer on PATH → dependencies install and the command exits 0
- [x] `npx vp check` → format and lint pass
- [x] `npx vp -C apps/catalog build` → the catalog writes `apps/catalog/dist/`
- [x] `npx vp -C packages/tokens pack` → `packages/tokens/dist/index.mjs` and `packages/tokens/dist/index.d.mts` exist, and `package.json` exports map `.`, `./tokens`, and `./theme.css`
- [x] Import `packages/tokens/dist/index.mjs` → `tokens.theme` is `placeholder`, and `packages/tokens/src/theme.css` contains `:root`
  - Superseded: the placeholder became the real token object (`themes`, `colors`, `renderThemeCss`). `packages/tokens/tests/theme.test.ts` now covers this step.

## Acceptance criteria coverage

- No acceptance criteria on this decision spec. The command steps cover the scaffold gate in the proposed stack table.
