# 08: A–Z index

**What to build:** The index looks like the index of a cookbook: every Recipe in alphabetical order grouped by first letter, a row of letters that jumps to each group, and entries with dotted leaders.

**Blocked by:** 03 (Complete recipe rules), 04 (Design foundation and screenshot tests)

**Status:** done

- [x] Catalogue view module (pure): given all Recipes, returns letter groups in Portuguese alphabetical order; accented titles sort and group correctly (e.g. "Pão" under P)
- [x] Site name above the "Índice" title, and the number of Recipes under it
- [x] Row of letters that jump to each group; only letters with Recipes appear
- [x] Each entry: title, dotted leader, Rating on the right (a dash when there is none); total time and times made underneath ("Nunca feita" when the Log is empty)
- [x] Two columns on wide screens, one on phones
- [x] Unit tests for the catalogue view's grouping and ordering
- [x] Stories for the index and entry states; a11y addon passes; screenshot tests at phone width
- [x] End-to-end test: groups, letter jumps and navigation to a Recipe and back

## Comments

Done. Notes for later tickets:

- Catalogue view: `src/lib/catalogue-view.ts` exports `byTitle(recipes)` (pt-BR collation, accent- and case-insensitive) and `letterGroups(recipes)` (`{ letter, recipes }[]`, accents grouped under the base letter, e.g. "Pão" under P). Both are generic over anything with a `title`. Ticket 09 adds the order, Tag filter, search set and right-hand value here; the index currently calls `letterGroups` directly.
- Times made comes from 05's `cookStats(log).timesMade` (`src/lib/cook-log.ts`). `formatTimesMade` in `src/lib/format.ts` gives "Nunca feita" or a plain count like "3×", so the index never switches singular/plural (AGENTS.md rule). For the same reason the Recipe count under "Índice" reads "Receitas · 4", not "4 receitas". The details line reads e.g. "45 min · 2×".
- Components: `IndexPage` takes `IndexRecipe[]` (`slug`, `title`, `rating?`, `totalMinutes?`, `timesMade`), built in `src/pages/index.astro`. `IndexEntry` renders one entry; the Rating is shown as stars/dash (hidden from screen readers) plus visually hidden text "Nota N de 5" / "Sem nota" (05's `.visually-hidden`).
- Uses 05's `--text-display` and `--measure-wide` tokens and `.visually-hidden` class; no new tokens. Two columns from 48rem.
- Letter groups have ids `letra-<L>` and are regions labelled by their letter.
- e2e Recipes added: `pao-de-queijo` (rated, made twice), `pudim` (rated, made once, 4 h), `abobora-assada` (no Rating, never made). With 05's `bolo-de-cenoura` the index has 5 Recipes in groups A, B, C, P. Ticket 09 can reuse them; any new e2e Recipe changes the index screenshot and the "Receitas · 5" count in `tests/e2e/index.spec.ts`.
