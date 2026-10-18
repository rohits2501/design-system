# 0002. Theme presets: decision record

## Context

The house system has one look: indigo accent, system sans, 4px and 8px corners, in light, dark, and high contrast. Future products want distinct identities (frosted glass, editorial, hospitality, cinematic, and a plain accessible look) without each one inventing a palette, which is the exact drift the package exists to stop.

Three apps already consume `theme.css` from vendored tarballs. Any change that alters house values or grows the file they import is a cost to them with no benefit.

The looks borrow public patterns from well known products. Their fonts are licensed and cannot ship, and their brand colors are trademarked assets. Bright brand hexes also fail the package's own rule that one accent serves as both link text and the primary button fill.

The shipped faces cover stay, cinema, access, and editorial titles. Editorial body text is still the system sans. Code is still the system mono. There is no named stack for a quieter long read, and none for a denser admin voice. Any face added here has to be one the package can ship.

The catalog stylesheet is gated. Loading a font file there raises the ceiling for every visitor, including a face no look paints.

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

### Option A: Fill the empty font roles (chosen)

Keep the five looks. Put JetBrains Mono on every preset's mono stack. Put Newsreader on the editorial body and leave Fraunces on the titles. Export Source Sans 3 as `fontFamily.reading` and IBM Plex Sans as `fontFamily.dense`. An app opts in by setting `--font-sans` and loading the file. The catalog once loaded those files and showed a Faces sample; Option D removes that load.

**Pros**: no new palette, no new contrast matrix, and the locked sans faces stay put.
**Cons**: the two extra stacks do nothing until an app sets the variable. Loading their files in the catalog raises a ceiling no look needs. Editorial body becomes a serif even before Newsreader loads.

### Option D: Keep the names, drop the catalog files (chosen for those two faces)

Leave `fontFamily.reading` and `fontFamily.dense` as strings. Stop importing Source Sans 3 and IBM Plex Sans in the catalog, and remove the Faces sample. Keep the six faces a look actually uses.

**Pros**: the catalog stylesheet shrinks. An app that wants either voice still has the exact stack to copy, and installs the package itself.
**Cons**: the catalog no longer shows those two faces, so a wrong string is easier to miss until an app loads the file.

### Option E: Delete the names as well

Remove `fontFamily.reading` and `fontFamily.dense` along with the catalog files.

**Pros**: nothing names a face the catalog does not prove.
**Cons**: an app that wants the stack has to invent the string, which is how font choices drift.

### Option B: Replace stay and cinema

Source Sans 3 replaces Plus Jakarta Sans. IBM Plex Sans replaces Inter Tight.

**Pros**: every new face shows up the moment you switch looks.
**Cons**: it throws away two locked faces and changes the default file every app already depends on.

### Option C: A new preset per face

Each new face gets colors, radius, and a contrast pass.

**Pros**: the catalog switcher shows them with no extra specimen.
**Cons**: four new palettes for a type choice, and the contrast work repeats for faces that do not need their own accent.

## Rationale

The forces are coherence and one component API. Option 2 keeps the single TypeScript source. Option 3 is a reasonable later split if an app ever ships with a single preset and measures the cost; the emitter can produce it from the same model.

Glass replaced house as the default, and a later choice replaced glass with stay. Glass then came back as an opt in look: lighter frost (blur 20, alpha 0.62, saturate 1.8), capsule controls, and the system font. `theme.css`, `colors`, and `themes` stay stay. Apps already on an older tarball keep that pack's look until they take a new one. A change in this repo does not update those apps on its own.

Presets are original values checked against the same contrast math, not brand copies. Accents sit near the inspiration in spirit and differ in hex. The `access` preset was added at the engineer's request as the plain, large type look of public service sites, and it is the only preset that changes control height and type scale, which is why those became tokens.

The four added faces are Newsreader, Source Sans 3, IBM Plex Sans, and JetBrains Mono. Each publishes a Fontsource variable package under the SIL Open Font License 1.1. The catalog loads Newsreader and JetBrains Mono because a look uses them. Source Sans 3 and IBM Plex Sans stay as names only; an app loads them the same way it already loads Plus Jakarta Sans, Fraunces, Inter Tight, and Atkinson when it needs them. Geist stays out of this slice. Faces whose license is not the Open Font License stay out too.

Option A wins because the empty roles are the code stack and the editorial body. The other two faces are voices an app chooses, not new products. Option B would reopen the default look. Option C would invent palettes the type choice does not need.

The catalog half of Option A does not survive the measurement. Four new packages took the catalog stylesheet from about 7000 bytes to 9506 bytes gzipped. Source Sans 3 and IBM Plex Sans are not a look, so Option D keeps their names and drops their files. Option E would throw away a string an app can copy safely. The catalog loads a file only when a look uses it. Newsreader and JetBrains Mono stay.

Two corrections to the plan came from review: `backdrop-filter: blur(0px)` still creates a stacking context and a containing block for fixed children, so solid surfaces use `none` through `--surface-backdrop`; and an explicit `data-preset="house"` needs descendant pairs emitted last to beat another preset's descendant rules.

## Evidence

All 15 non house color blocks were run through the repo's contrast matrix before they were locked: zero failures. Access weakest text pair: 7.37 (light), 9.03 (dark), 9.81 (high contrast).
