# 12: `@log-cook` skill

**What to build:** A project agent skill the owner invokes as `@log-cook` with a sentence like "fiz a carbonara hoje, precisava de mais pimenta". It adds a Cook to the right Recipe's Log and commits it.

**Blocked by:** 03 (Complete recipe rules)

**Status:** ready-for-agent

- [ ] The skill lives in the project skills folder and is committed (the `.gitignore` exception already exists)
- [ ] Finds the Recipe from the sentence; asks the owner to choose when more than one matches, and never guesses
- [ ] Adds a Cook with the date (today unless the sentence says otherwise) and the note, if any, newest first in the Log
- [ ] Updates the Rating when the owner mentions one
- [ ] Runs the recipe rules on the changed file before committing
- [ ] Commits the change with a short message naming the Recipe
- [ ] Follows the guidance in the `writing-for-agents` skill
- [ ] Tried on examples: a clear match, an ambiguous match, a Cook with a Rating, a Cook dated in the past; the files pass the build
