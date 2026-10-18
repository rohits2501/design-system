# @house/migration

Maps legacy styling onto `@house/tokens` roles: raw hexes (by usage, since white as a fill and white as text are different roles), utility palette classes such as `bg-blue-600`, and runtime theme keys such as `colors.textSecondary`. A value that has no place in the system maps to an explicit deprecated bucket with a reason.

`fixtures/inventory.json` is the contract: a test fails if any entry is unmapped. `fixtures/snippets/` holds before and after pairs, and `scoreRewrite(before, candidate)` scores a hand or codemod rewrite against them (1 means every expected role is used, nothing extra, no legacy leftovers).
