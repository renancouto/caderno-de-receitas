# 11: `@add-recipe` skill

**What to build:** A project agent skill the owner invokes as `@add-recipe` to turn a pasted or dictated recipe into a valid Recipe file, ready to review and commit. It handles original Recipes (no Source) and Recipes adapted from one or more Sources.

**Blocked by:** 03 (Complete recipe rules), 07 (Photos), 13 (Step photos)

**Status:** done

- [x] The skill lives in the project skills folder and is committed (the `.gitignore` exception already exists)
- [x] Accepts recipe text plus zero, one or several Source links, and optional Photos
- [x] Places Step photos under the right Step (`   ![](<slug>/passo-1.jpg)`, see 13's note) and removes their location metadata
- [x] Normalises every quantity into a Standard Unit, a plain count or "a gosto", and lists every conversion it had to guess
- [x] For Recipes from a Source: translates into Brazilian Portuguese and rewrites the Steps in its own words
- [x] For original Recipes: keeps the owner's wording and only Normalises
- [x] Fills in servings and total time when the recipe gives them
- [x] Picks a lowercase kebab-case file name from the title that doesn't clash with an existing Recipe
- [x] Removes location metadata from any Photo using the script from 07
- [x] Runs the recipe rules on the result and fixes any problem before finishing
- [x] Never commits; tells the owner the file is ready to review
- [x] Follows the guidance in the `writing-for-agents` skill
- [x] Tried on three examples (an original Recipe, one with a single Source, one with several Sources); the resulting files pass the build

## Comments

Done. Notes and differences from the ticket:

- `.agents/skills/add-recipe/SKILL.md`, user-invoked (`disable-model-invocation: true`). No new helper: it uses `pnpm strip:location` (07), `pnpm check:photos` and `pnpm check:recipe` (12).
- Photos go in `recipes/<name>/`: `capa.jpg` (header), then `foto-2.jpg`…; Step photos are `passo-<N>.jpg`, indented under their Step (13's format).
- It never commits: it hands the file back with every guessed conversion listed. Once the owner approves, it lands through `@log-cook`'s PR steps on branch `add-recipe/<name>` with subject `Add recipe: <title>`.
- Tried by following the skill in a temp copy of `recipes/` (nothing kept): an original (`farofa-da-vo`, owner's wording, a Photo and a Step photo on Step 2), one Source (`pancakes-americanas`, allrecipes, translated and rewritten, cups/tbsp/tsp turned into g and ml, a Step photo on Step 3), several Sources (`feijoada-simples`, two links merged, lb turned into g). The images were generated with a GPS tag; `strip:location` removed it (`hasLocationMetadata` false afterwards). All files print `ok` in `pnpm check:recipe`, and `astro build` with `RECIPES_DIR` set to the copy built 5 pages.
- Gotcha: `RECIPES_DIR` must sit inside the site root (Astro rejects an absolute path outside it), so the build was run from an ignored `.astro/` folder.
