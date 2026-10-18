# 0001. Library workspace on Vite+

**Date**: 2026-10-18
**Status**: In Progress

## Summary

The design system is a small library workspace, not an application framework. Vite+ 1.3.0 builds the packages and the catalog. A later new app can use TanStack Start. The document console, AudioForge, and Bol stay on the frameworks they already have and only take the CSS and the token values.

## Decision

**Chosen option**: Option 3: Vite+ library, framework left to the app

Pin `vite-plus` at 1.3.0. Use npm and Node 22. Run `npx --package=vite-plus@1.3.0 vp` so a global install is optional. The empty scaffold is `@house/tokens` plus a private `catalog` app. `@house/react` arrives with the primitives. `@house/migration` arrives with the fixture slice.

## Proposed stack

| Layer            | Choice                                          | Reason                                                                                                                                                                                                                        |
| ---------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language         | TypeScript, strict                              | Shared by the web apps and the Expo screen.                                                                                                                                                                                   |
| Toolchain        | Vite+ 1.3.0 (`vp`)                              | One pinned tool for dev, test, lint, format, app build, and library pack. Bundles Vite 8.3.4, Vitest 5.0.5, Oxlint 1.88.0, Oxfmt 0.73.0, tsdown 0.23.1.                                                                       |
| Package manager  | npm                                             | Matches the apps that will install this.                                                                                                                                                                                      |
| Repo shape       | npm workspaces                                  | Empty scaffold: `packages/tokens` (`@house/tokens`) and `apps/catalog` (private, name `catalog`). Add `packages/react` (`@house/react`) with the primitives, and `packages/migration` (`@house/migration`) with the fixtures. |
| Module format    | ESM only                                        | `exports` maps `.` and `./tokens` to the token object, and `./theme.css` to the CSS. React peer is 18 or newer, declared when the React package exists. No CommonJS build.                                                    |
| Library build    | `vp pack`                                       | For this slice, `@house/tokens` packs a placeholder token object and a theme file. The React entry is a later slice.                                                                                                          |
| Catalog          | Vite app (`vp build`)                           | This slice only has to build. Importing the theme and rendering one control is the catalog thread, not the empty scaffold.                                                                                                    |
| Scaffold gate    | `vp install`, `vp check`, `vp build`, `vp pack` | All four must succeed on Node 22 before this feature is built.                                                                                                                                                                |
| New apps         | TanStack Start 1.0                              | Vite underneath, so the CSS import stays ordinary. Not a dependency of this repo.                                                                                                                                             |
| Existing apps    | Unchanged frameworks                            | Next.js for the document console and AudioForge. Expo for Bol. Native keyboards stay native.                                                                                                                                  |
| Styling contract | CSS variables plus a plain token object         | Web apps import the CSS. The Expo screen imports the object. No runtime CSS in JS library.                                                                                                                                    |
| Primary DB       | None                                            | Nothing is stored.                                                                                                                                                                                                            |
| Auth             | None                                            | The catalog is a local gallery.                                                                                                                                                                                               |
| Hosting          | Git or a local `file:` dependency               | A package registry waits until the proofs pass.                                                                                                                                                                               |

## Consequences

**Positive**:

- One package serves web and the Bol screen.
- The catalog can boot before any existing app is touched.

**Negative / tradeoffs**:

- Vite+ 1.3.0 is new. Pin it. Do not float to latest during the first slice. If `vp pack` emits the wrong `exports`, fix the pack config before adding a second bundler.
- Theme switching is a data attribute and a token object, not a framework theme provider.
- The Expo screen is not proven in this slice. The token entry stays plain ESM with no CSS import, so Metro can transpile it later. Proving that import waits for the Bol adoption.

**Neutral**:

- Storybook is not part of this repo. The catalog is the gallery.
- Lint of ordinary code is Oxlint through `vp check`. The raw color ban is a later slice, not part of this scaffold.

## Follow-up

- [ ] Token roles, theme names, and the real object shape belong in the token model spec. This slice may pack a placeholder.
- [ ] Control APIs belong in the shared primitives spec.
- [ ] A packed tarball install (not only the workspace symlink) is proved when the first existing app depends on the package.
