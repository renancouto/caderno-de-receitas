# 05: Recipe page, complete

**What to build:** The editorial Recipe page (layout C from the prototype), readable on a phone while cooking: header, facts strip, Ingredients with Ingredient Groups, numbered Steps, quiet Notes, the Log timeline and the Source credit.

**Blocked by:** 03 (Complete recipe rules), 04 (Design foundation and screenshot tests)

**Status:** done

- [x] Header with the title and Tags; without a Photo it is a plain coloured header (Photos themselves come in 07)
- [x] Facts strip: Rating, times made, last made, total time, servings; optional facts the Recipe doesn't have (time, servings) are left out; the Rating shows "Sem nota" when absent, and times made shows "0" when the Log is empty (owner change: was "Nunca feita")
- [x] Times made and last made are derived from the Log
- [x] Ingredients as a list with names on the left and quantities right-aligned; Ingredient Groups as small headings
- [x] Quantities formatted in Portuguese: decimal comma, "L" for litres, "xíc." for cups (owner change: was "xícara"/"xícaras"), "a gosto", plain counts
- [x] Steps numbered with large numerals
- [x] Notes after the Steps with a small "Notas" label in a quiet style, only when present
- [x] Log as a timeline of Cooks, newest first, each date with its note if any; hidden when empty
- [x] "Adaptada de" credit linking each Source; hidden entirely for an original Recipe
- [x] Link back to the index
- [x] One column on phones, Ingredients beside Steps on wide screens
- [x] A story for every state: with and without each optional field, Ingredient Groups, never made, several Sources, no Sources, long title
- [x] All stories pass the a11y addon; screenshot tests added for the main states
- [x] End-to-end test checks a full Recipe page and a minimal one

## Comments

Done. Notes for later tickets:

- Shared pure modules: `src/lib/cook-log.ts` (`cookStats(log)` → `{ timesMade, lastMade? }`, `newestFirst(log)`) and `src/lib/format.ts` (`formatQuantity`, `formatMinutes`, `formatNumber`, `formatDate` ("1 nov. 2026"), `sourceName`). Ticket 08 should reuse these for times made, last made and dates.
- Components: `RecipePage` composes `FactsStrip`, `IngredientList`, `StepList`, `RecipeNotes`, `CookLog`, `SourceCredit`. Ticket 06 makes `IngredientList` and `StepList` tickable; Step numerals are a CSS counter (`.step::before`), so list item text is just the Step.
- The header is `.recipe-header` on `--color-panel` (new token, `#efe5d3`); ticket 07 puts the Photo there. Muted text fails contrast on the panel, so Tags use ink.
- The Rating shows stars (`aria-hidden`) plus visually hidden "4 de 5" (new shared `.visually-hidden` class in `base.css`); oxlint rejects `role="img"`.
- New tokens: `--color-panel`, `--text-display`, `--text-numeral`, `--measure-wide` (64rem). Two columns from 52rem.
- Stories: `components-recipepage--complete`, `--minimal`, `--one-source-made-once`, `--long-title`; the old `--default` story is gone. Screenshots cover the minimal and full pages and three stories.
- Test Recipes: `tests/e2e/recipes/bolo-de-cenoura.md` (every optional field) was added, so the e2e index now lists two Recipes (`page-index.png` reference updated).
- Owner change after review: no singular/plural switching anywhere. The noun goes in the label and the value is just a number: facts "Vezes feita: 0" (replaces "Nunca feita" on the Recipe page) and "Porções: 2"; cups are "xíc." like g, ml, L. The plural helpers were removed from `format.ts`; use `formatNumber`. Ticket 08's index should follow the same rule (spec story 7's "Nunca feita" may need the owner's call there).
