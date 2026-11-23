# 11: `@add-recipe` skill

**What to build:** A project agent skill the owner invokes as `@add-recipe` to turn a pasted or dictated recipe into a valid Recipe file, ready to review and commit. It handles original Recipes (no Source) and Recipes adapted from one or more Sources.

**Blocked by:** 03 (Complete recipe rules), 07 (Photos)

**Status:** ready-for-agent

- [ ] The skill lives in the project skills folder and is committed (the `.gitignore` exception already exists)
- [ ] Accepts recipe text plus zero, one or several Source links, and optional Photos
- [ ] Normalises every quantity into a Standard Unit, a plain count or "a gosto", and lists every conversion it had to guess
- [ ] For Recipes from a Source: translates into Brazilian Portuguese and rewrites the Steps in its own words
- [ ] For original Recipes: keeps the owner's wording and only Normalises
- [ ] Fills in servings and total time when the recipe gives them
- [ ] Picks a lowercase kebab-case file name from the title that doesn't clash with an existing Recipe
- [ ] Removes location metadata from any Photo using the script from 07
- [ ] Runs the recipe rules on the result and fixes any problem before finishing
- [ ] Never commits; tells the owner the file is ready to review
- [ ] Follows the guidance in the `writing-for-agents` skill
- [ ] Tried on three examples (an original Recipe, one with a single Source, one with several Sources); the resulting files pass the build
