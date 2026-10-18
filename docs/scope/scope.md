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
| 3   | Token model                  | Foundation | planned     |
| 4   | Shared primitives            | Foundation | planned     |
| 5   | Catalog thread               | Slice 1    | planned     |
| 6   | Color constraint             | Slice 2    | planned     |
| 7   | Contrast and size budget     | Slice 3    | planned     |
| 8   | Legacy style fixtures        | Slice 4    | planned     |

## Foundations

### 1. Stack and architecture · in-progress

Choose how the library is built and how a later app installs it, then scaffold a repo that boots.
**Done when:** the stack is recorded in a spec and the empty scaffold builds locally.

- [x] Decide the stack (spec): `/architect stack and architecture`
- [x] Scaffold from the decision: `/develop stack and architecture`
- [ ] Verify it: `/check verify stack and architecture`
- [ ] Test it: `/test stack and architecture`

Spec [0001](../specs/0001-stack-and-architecture/index.md)
code in `./`

### 2. Coding standards and tooling · planned

Capture conventions from the real scaffold, then install lint, format, and type checks so later code follows them.
**Done when:** root `AGENTS.md` matches the scaffold, and lint, format, and typecheck run clean.

- [ ] Capture conventions and tooling choices: `/audit`
- [ ] Install the tooling: `/develop tooling`

### 3. Token model · planned · needs a decision

The shared roles for color, space, type, and radius, including light, dark, and high contrast, plus a plain value object a native screen can import.
**Done when:** one source emits themed web variables and a plain token object, and a later screen can override accent and font without a second palette.

- [ ] Design it (spec): `/architect token model`

### 4. Shared primitives · planned · needs a decision

The small set of controls every later screen is built from. Focus is visible, and status is never color alone.
**Done when:** button, icon button, text, stack, surface, and field render from tokens only, with a visible focus ring and a disabled state.

- [ ] Design it (spec): `/architect shared primitives`

## Slice 1: Catalog thread

### 5. Catalog thread · planned

The walking skeleton. One real button, on a catalog page, in light, dark, and high contrast, installed the way a later app will install it.
**Done when:** the catalog builds, the button follows the active theme, and switching theme does not require a component change.

- [ ] Build it: `/develop catalog thread`

## Slice 2: Color constraint

### 6. Color constraint · planned

A check that fails when a raw color appears outside the token source, with one sample file that is supposed to fail.
**Done when:** a fixture with a raw hex fails the check, and token source files pass.

- [ ] Build it: `/develop color constraint`

## Slice 3: Contrast and size budget

### 7. Contrast and size budget · planned

Prove the themes meet a contrast bar, and that the catalog script and the theme file stay under a recorded size ceiling.
**Done when:** every text on surface pair in light, dark, and high contrast meets WCAG AA, and the catalog script plus theme file sit under checked in ceilings.

- [ ] Build it: `/develop contrast and size budget`

## Slice 4: Legacy style fixtures

### 8. Legacy style fixtures · planned

A small set of before and after samples (a raw hex, a utility palette class, a runtime style object) mapped onto tokens or marked retired.
**Done when:** every fixture is mapped or explicitly retired, and a missing mapping fails the test.

- [ ] Build it: `/develop legacy style fixtures`

## Deferred

Out of scope until the package proofs pass. Kept so the plan stays honest.

- **Document console adoption**: depend on the package, alias current variables, then replace shared controls. Stays on its current app framework. · needs a decision
- **AudioForge adoption**: same three steps, keeping the serif font as an override. · needs a decision
- **Bol dictation screen**: point the screen styles at the token object. Native keyboards stay native. · needs a decision
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
