# 0002. Theme presets: decision record

## Context

The house system has one look: indigo accent, system sans, 4px and 8px corners, in light, dark, and high contrast. Future products want distinct identities (frosted glass, editorial, hospitality, cinematic, and a plain accessible look) without each one inventing a palette, which is the exact drift the package exists to stop.

Three apps already consume `theme.css` from vendored tarballs. Any change that alters house values or grows the file they import is a cost to them with no benefit.

The looks borrow public patterns from well known products. Their fonts are licensed and cannot ship, and their brand colors are trademarked assets. Bright brand hexes also fail the package's own rule that one accent serves as both link text and the primary button fill.

## Options considered

Documented from the phase 2 plan and the follow up conversation.

### Option 1: Presets inside `theme.css`

Every preset block ships in the one file every app imports.

**Pros**: one import; no new export.
**Cons**: roughly triples the gzipped file for apps that only use house; every existing app pays for looks it never shows.

### Option 2: A separate opt in `presets.css` (chosen)

`theme.css` stays house only; presets emit to a second file apps import when they want them.

**Pros**: existing apps unchanged in bytes and values; same TypeScript source.
**Cons**: one more import for apps that use a preset; two budgets to keep.

### Option 3: One file per preset

`presets/glass.css` and so on.

**Pros**: smallest runtime cost per app.
**Cons**: five exports, five budgets, and a house pair file every one of them needs; more surface than the current number of consumers justifies.

Also ruled out: adopting shadcn/ui, MUI, or Base UI as the styling layer (the package already does what their preset idea needs, and adopting them would add a second component API), and copying any gallery theme or preset string (licensing).

## Rationale

The forces are coherence and one component API. Option 2 keeps the single TypeScript source. Option 3 is a reasonable later split if an app ever ships with a single preset and measures the cost; the emitter can produce it from the same model.

Glass replaces house as the default. `theme.css`, `colors`, and `themes` are glass. Editorial, stay, cinema, and access stay in `presets.css`. Apps already on the 0.1.1 tarball keep the old look until they take a new pack. A change in this repo does not update those apps on its own.

Presets are original values checked against the same contrast math, not brand copies. Accents sit near the inspiration in spirit and differ in hex. The `access` preset was added at the engineer's request as the plain, large type look of public service sites, and it is the only preset that changes control height and type scale, which is why those became tokens.

Two corrections to the plan came from review: `backdrop-filter: blur(0px)` still creates a stacking context and a containing block for fixed children, so solid surfaces use `none` through `--surface-backdrop`; and an explicit `data-preset="house"` needs descendant pairs emitted last to beat another preset's descendant rules.

## Evidence

All 15 non house color blocks were run through the repo's contrast matrix before they were locked: zero failures. Access weakest text pair: 7.37 (light), 9.03 (dark), 9.81 (high contrast).
