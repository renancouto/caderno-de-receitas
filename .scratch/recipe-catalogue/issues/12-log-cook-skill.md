# 12: `@log-cook` skill

**What to build:** A project agent skill the owner invokes as `@log-cook` with a sentence like "fiz a carbonara hoje, precisava de mais pimenta". It adds a Cook to the right Recipe's Log and commits it.

**Blocked by:** 03 (Complete recipe rules)

**Status:** done

- [x] The skill lives in the project skills folder and is committed (the `.gitignore` exception already exists)
- [x] Finds the Recipe from the sentence; asks the owner to choose when more than one matches, and never guesses
- [x] Adds a Cook with the date (today unless the sentence says otherwise) and the note, if any, newest first in the Log
- [x] Updates the Rating when the owner mentions one
- [x] Runs the recipe rules on the changed file before committing
- [x] Lands the change with a short message naming the Recipe: `main` is protected (no direct pushes, squash-merged PRs with passing checks only), so the skill commits on a short branch, opens a PR with `gh pr create`, waits with `gh pr checks --watch`, squash-merges, and returns to an up-to-date `main`
- [x] Follows the guidance in the `writing-for-agents` skill
- [x] Tried on examples: a clear match, an ambiguous match, a Cook with a Rating, a Cook dated in the past; the files pass the build

## Comments

Done. Differences from the ticket and notes:

- "Commits the change" became "lands the change" because `main` is protected: the skill uses branch `log-cook/<file-name>-<date>`, a PR, `gh pr checks --watch` and `gh pr merge --squash --delete-branch`. It stops and leaves the PR open if a check fails.
- New script `pnpm check:recipe <file>...` (`scripts/check-recipe.ts`, logic and unit test in `src/lib/check-recipe-file.ts`) runs `checkRecipe` with the file's own name; ticket 11 can use it too. It runs under Node's built-in TypeScript support, hence the `.ts` import extensions.
- The skill is user-invoked (`disable-model-invocation: true`), so it costs no context when unused.
- Tried on copies in a temp folder (no PRs, nothing pushed), all passing `pnpm check:recipe`: a unique match (`carbonara-picante`, Cook dated today with a note); an ambiguous "carbonara" (also matches a second carbonara Recipe, so the skill asks); a Cook with a Rating (`rating: 5` added alongside the Cook); a past-dated Cook ("2026-11-10" inserted below newer Cooks, a note with `:` quoted).
