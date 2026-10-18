# Verify: theme presets · spec 0002 · updated 2026-10-18

_Steps derived from spec 0002 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] Open the catalog. There is no Faces section. Stay, Glass, Editorial, Cinema, and Access still paint. → AC-10
- [x] A code sample, such as the job id, paints in JetBrains Mono. → AC-13
- [x] Press Editorial. Body text paints in Newsreader. A large title paints in Fraunces. → AC-13

## Commands

- [x] `npm run check:budget` stays inside the ceilings. Catalog CSS sits about 10 percent above the measured size after Source Sans 3 and IBM Plex Sans are gone. → AC-11

## Acceptance-criteria coverage

- AC-10 covered by the no Faces step
- AC-11 covered by the budget command
- AC-13 covered by the code sample and the Editorial step
- AC-1 through AC-9 and AC-12 were checked on the earlier preset pass
