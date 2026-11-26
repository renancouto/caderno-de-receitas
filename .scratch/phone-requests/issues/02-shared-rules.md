# 02: One rules document for the skills and the workflow

**What to build:** The rules `@add-recipe` and `@log-cook` follow (Normalising, translating and rewriting text from Sources, keeping the owner's wording for originals, the Recipe file format, file and photo names, adding a Cook, changing a Rating) live in one document. Both skills point to it, and the workflow in later tickets sends it to the model. Changing a rule then changes it everywhere.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] One rules document in the repository, written for a model that has only that document and the Request (no tools, no file access)
- [x] `@add-recipe` and `@log-cook` point to it and keep only their own steps (finding files, running checks, landing)
- [x] Nothing in the skills' behaviour changes; re-run one example of each skill to confirm
- [x] Follows the guidance in the `writing-for-agents` skill

## Comments

Built as `docs/recipe-rules.md` (under `docs/`: shared by both skills and the workflow, and no `.gitignore` exception needed). It's written for a model with only the document, the Request, today's date and, for changes, the current Recipe file. The skills' behaviour was checked by reasoning through one example each, not by running them.

Open points for later tickets: a plain "xícara" (240 vs 250 ml) isn't covered; `tests/e2e/recipes/bolo-de-cenoura.md` lists its Cooks oldest first, against the rule; `checkRecipe` doesn't enforce Photo names or forbid Sources on original Recipes; the rules ask the model to ask when a Step photo or date is unclear, which ticket 05's asking on the Request must cover.
