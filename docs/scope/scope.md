# Scope: House design system

A shared visual language for your future web projects, and for the apps you already ship. One theme, one set of controls, and a check that keeps a second palette out.

**Build approach:** Tracer Bullet (prove one real path through tokens, one control, and the catalog before filling out the library).
**Workflow:** Beta (after build, check the running app, then add tests). The project default level of rigor. `/architect` is the recommended first stop for a feature with a real decision, but skippable when you already know the build. Any feature can carry its own tag (e.g. `· GA`) to do more or less.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit: if you already know how to build a feature, use `/develop` and skip `/architect`. You decide when a feature is `done`._

## At a glance

| #   | Feature                      | Phase      | Status      |
| --- | ---------------------------- | ---------- | ----------- |
| 1   | Stack and architecture       | Foundation | in-progress |
| 2   | Coding standards and tooling | Foundation | planned     |
| 3   | Token model                  | Foundation | in-progress |
| 4   | Shared primitives            | Foundation | in-progress |
| 5   | Catalog thread               | Slice 1    | in-progress |
| 6   | Color constraint             | Slice 2    | in-progress |
| 7   | Contrast and size budget     | Slice 3    | in-progress |
| 8   | Legacy style fixtures        | Slice 4    | in-progress |
| 9   | Document console adoption    | Adoption   | in-progress |
| 10  | AudioForge adoption          | Adoption   | in-progress |
| 11  | Bol dictation screen         | Adoption   | in-progress |
| 12  | Theme presets                | Slice 5    | done        |

## Foundations

### 1. Stack and architecture · in-progress

Choose how the library is built and how a later app installs it, then scaffold a repo that boots.
**Done when:** the stack is recorded in a spec and the empty scaffold builds locally.

- [x] Decide the stack (spec): `/architect stack and architecture`
- [x] Scaffold from the decision: `/develop stack and architecture`
- [x] Verify it: `/check verify stack and architecture`
- [x] Test it: `/test stack and architecture`

Spec [0001](../specs/0001-stack-and-architecture/index.md)
code in `./`

### 2. Coding standards and tooling · planned

Capture conventions from the real scaffold, then install lint, format, and type checks so later code follows them.
**Done when:** root `AGENTS.md` matches the scaffold, and lint, format, and typecheck run clean.

- [ ] Capture conventions and tooling choices: `/audit`
- [ ] Install the tooling: `/develop tooling`

### 3. Token model · in-progress

The shared roles for color, space, type, and radius, including light, dark, and high contrast, plus a plain value object a native screen can import.
**Done when:** one source emits themed web variables and a plain token object, and a later screen can override accent and font without a second palette.

- [x] Design it (spec): `/architect token model`
- [x] Build it: `/develop token model`
- [x] Test it: theme drift and contrast tests

Decided in spec [0001](../specs/0001-stack-and-architecture/index.md) · code in `packages/tokens/`

### 4. Shared primitives · in-progress

The small set of controls every later screen is built from. Focus is visible, and status is never color alone.
**Done when:** button, icon button, text, stack, surface, and field render from tokens only, with a visible focus ring and a disabled state.

- [x] Design it (spec): `/architect shared primitives`
- [x] Build it: `/develop shared primitives`
- [x] Test it: render tests for every primitive

Decided in spec [0001](../specs/0001-stack-and-architecture/index.md) · code in `packages/react/`

## Slice 1: Catalog thread

### 5. Catalog thread · in-progress

The walking skeleton. One real button, on a catalog page, in light, dark, and high contrast, installed the way a later app will install it.
**Done when:** the catalog builds, the button follows the active theme, and switching theme does not require a component change.

- [x] Build it: `/develop catalog thread`
- [x] Verify it: light, dark, and high contrast checked in the browser
- [x] Test it: the three themes render identical markup

code in `apps/catalog/`

## Slice 2: Color constraint

### 6. Color constraint · in-progress

A check that fails when a raw color appears outside the token source, with one sample file that is supposed to fail.
**Done when:** a fixture with a raw hex fails the check, and token source files pass.

- [x] Build it: `/develop color constraint`
- [x] Test it: fixtures fail, token source passes, and the CLI scans when run through an npm bin link

code in `packages/tokens/bin/check-raw-color.mjs`

## Slice 3: Contrast and size budget

### 7. Contrast and size budget · in-progress

Prove the themes meet a contrast bar, and that the catalog script and the theme file stay under a recorded size ceiling.
**Done when:** every text on surface pair in light, dark, and high contrast meets WCAG AA, and the catalog script plus theme file sit under checked in ceilings.

- [x] Build it: `/develop contrast and size budget`
- [x] Test it: contrast tests per theme; `npm run check:budget` against `perf/budgets.json`

code in `packages/tokens/tests/`, `scripts/check-budget.mjs`

## Slice 4: Legacy style fixtures

### 8. Legacy style fixtures · in-progress

A small set of before and after samples (a raw hex, a utility palette class, a runtime style object) mapped onto tokens or marked retired.
**Done when:** every fixture is mapped or explicitly retired, and a missing mapping fails the test.

- [x] Build it: `/develop legacy style fixtures`
- [x] Test it: every fixture mapped or retired

code in `packages/migration/`

## Slice 5: Theme presets

### 12. Theme presets · done

A second axis beside light, dark, and high contrast. Stay is the default look in `theme.css`. Editorial, cinema, and access are opt in through `presets.css`.
**Done when:** every preset passes the contrast bars in every appearance (access at 7:1 everywhere), a page with no `data-preset` renders stay, and the catalog shows every preset without a component change.

- [x] Design it (spec): `/architect theme presets`
- [x] Build it: `/develop theme presets`
  - [x] Preset model in the token source (AC-9)
  - [x] House defaults in `theme.css`, opt in `presets.css`, and their tests (AC-1 to AC-7)
  - [x] Components read the new variables (AC-7, AC-8)
  - [x] Catalog preset switcher and fonts (AC-8, AC-10)
  - [x] Budgets, docs, and version 0.2.0 (AC-11, AC-12)
- [x] Verify it: `/check verify theme presets`
- [x] Test it: `/test theme presets`

spec [0002](../specs/0002-theme-presets/index.md) · code in `packages/tokens/src/`, `packages/react/src/styles.css`, `apps/catalog/`

## Adoptions

Each app installs the packed tarballs from its own `vendor/` folder (`node scripts/vendor.mjs <app>`), so its CI does not need this repo.

### 9. Document console adoption · in-progress

Depend on the package, alias current variables, then replace shared controls. Stays on Next.
**Done when:** every screen reads package variable names, `Button` comes from `@house/react`, light and dark still work, and the bundle budget passes.

- [x] Alias the variables, then move screens to package names and re-export `Button`
- [x] Add `check:colors` to CI, with `app/globals.css` (scrim, shadow, PDF paper) as the only baselined file
- [x] Verify it: light and dark checked in the browser; tests, build, and budget pass

code in `../ai-document-intelligence-console`

### 10. AudioForge adoption · in-progress

Same three steps, keeping the serif font as a `--font-sans` override. Stays on Next; Tailwind stays for layout.
**Done when:** screens use package primitives and color names, no aliases remain, and the bundle budget passes.

- [x] Alias the variables; pin `data-theme="dark"` since the app was dark only
- [x] Restyle home, create form, review desk, demo player, and onboarding on `Button`, `Field`, `Surface`, and `Text`
- [x] Add `check:colors` to CI with no baseline
- [x] Verify it: screens checked in the browser; tests, build, and budget pass from a clean install

code in `../audioforge`

### 11. Bol dictation screen · in-progress

Point the screen styles at the token object. Native keyboards stay native.
**Done when:** `DictationScreen` has no raw colors and the web preview renders.

- [x] Map every hex in `DictationScreen` and the root layout to `themes.light.color`
- [x] Verify it: typecheck, server tests, and the web export render

code in `../bol/src/dictation/`

## Deferred

Kept so the plan stays honest.

- **Dense data grid**: a later control on the same tokens.
- **Package registry publish**: git or local install is enough until a registry is worth it.

## Legend

**The decision box.** Every feature carries exactly one, the sub-task whose label ends with `(spec)`. Its wording varies (`Design it (spec)` normally, `Decide the stack (spec)` on Stack and architecture), so skills locate it by that `(spec)` suffix, never by an exact label. Every other box is an execution box and `/architect` never ticks one.

**Feature lifecycle**: the scope updates as a feature moves; each row is what it shows and who sets it:

| State                        | Set by                                                                                 | The feature shows                                                                                                                                                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `planned` · needs a decision | `/scope`                                                                               | one box: `Design it (spec): /architect <feature>`                                                                                                                                                                                            |
| `in-progress` (designed)     | **`/architect` at spec capture**                                                       | `Design it` ticked; spec linked; `Build it: /develop <feature>` + **2 to 5 milestones**; the tier's closing boxes (`Verify it` Alpha+, `Test it` Beta+, `Review it` + `Document it` GA); any surfaced follow-up enrolled                     |
| `in-progress` (building)     | `/develop`                                                                             | milestone sub-boxes tick one by one; code pointer filled                                                                                                                                                                                     |
| `in-progress` (verified)     | `/check verify`                                                                        | `Build it` + milestones ticked; `Verify it` ticked                                                                                                                                                                                           |
| `done`                       | **you, when you decide it is** (any skill sets it when you say so); `/sync` reconciles | boxes you ran ticked, skipped ones marked skipped; the tier's last stage (`Prototype` → after `/develop`; `Alpha` → after `/check verify`; `Beta`/`GA` → after `/test`) is the suggested point to call it done; `/sync` captures conventions |

- **Next step** = the first unticked box (always a command or a tracked milestone).
- **needs a decision** = run `/architect` first; otherwise straight to `/develop` (or `/audit` for standards and tooling). The tag drops once the spec is captured.
- **Atomic build tasks live in the spec's `## Build plan`, not here**: the scope carries only the milestone rollup.
- **Status** `planned` → `in-progress` → `done`, plus `existing` (pre-workflow) and `dropped` (de-scoped, kept for history).
- **Approach tag** beside a heading (e.g. `· Facade`) overrides the project default for that feature; no tag = inherits it.
- **Workflow tier tag** beside a heading (e.g. `· GA`, `· Prototype`) sets that one feature's rigor above or below the project default; no tag inherits the default. It decides the feature's check boxes and each skill's next suggestion.
- **Workflow** (header line) is the project default, what runs after `/develop`: **Prototype** = nothing (trust develop's own build time self check); **Alpha** = `/check verify`; **Beta** = `/check verify` then `/test`; **GA** = adds a fresh model `/check review` then `/document`. A feature built on an unratified decision (an `Assumed` spec) stays flagged, but that never blocks `done`.
- **Pointer line** (`spec <n> · code in <path>`): the spec link added by `/architect`, the code path by `/develop`.
