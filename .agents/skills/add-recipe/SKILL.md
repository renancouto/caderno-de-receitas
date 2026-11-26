---
name: add-recipe
description: Turn a pasted or dictated recipe, with optional Source links and Photos, into a valid Recipe file ready for the owner to review.
disable-model-invocation: true
---

The owner pastes or dictates a recipe, with zero, one or several **Source** links and optionally **Photos** and Step photos. Write it as one new **Recipe** in `recipes/` and hand it back for review. Every rule for the Recipe's content (wording, Normalising, file format, names) is in `docs/recipe-rules.md`: read it before step 2 and apply every rule. `tests/e2e/recipes/bolo-de-cenoura.md` shows every field in use.

## Steps

1. **Start clean.** Run `git status --short`; if anything is uncommitted, stop and tell the owner. Then `git switch main && git pull --ff-only`. Done when `main` equals `origin/main` and the tree is clean.

2. **Name the file** by the rules' File name rule. If `recipes/<name>.md` or the folder `recipes/<name>/` already exists, read that Recipe: the same dish means stop and tell the owner; a different dish means add a distinguishing word. Done when the name is kebab-case and unused.

3. **Write the Recipe** to `recipes/<name>.md` following the rules: original or from Sources, Normalising every Ingredient, the file format. Done when no Ingredient has a unit outside the Standard Units, and you have the list of guessed conversions.

4. **Place the Photos.** Skip when the owner gave none. Put every image in `recipes/<name>/` under the rules' Photo names, and reference them as the rules describe. Then run `pnpm strip:location recipes/<name>/*` and `pnpm check:photos`. Done when `check:photos` passes (the repository is public, so a GPS tag would leak the owner's home).

5. **Run the recipe rules.** `pnpm check:recipe recipes/<name>.md`. Done when it prints `ok`; on a problem, fix the file and run it again.

6. **Hand it back** in Portuguese, and stop there; the owner reviews first, so leave everything uncommitted. Say:
   - the file (and Photo folder) is ready to review;
   - every conversion you guessed, one per line ("1 colher de sopa de manteiga → 15 g");
   - anything you left out or assumed (no servings given, a Step you split).

## After the owner's review

When the owner approves and asks you to land it, use the `@log-cook` landing (its step 6) with branch `add-recipe/<name>`, `git add recipes/<name>.md recipes/<name>/`, and subject and PR title `Add recipe: <title>`.
