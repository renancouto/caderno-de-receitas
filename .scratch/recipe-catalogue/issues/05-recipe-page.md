# 05: Recipe page, complete

**What to build:** The editorial Recipe page (layout C from the prototype), readable on a phone while cooking: header, facts strip, Ingredients with Ingredient Groups, numbered Steps, quiet Notes, the Log timeline and the Source credit.

**Blocked by:** 03 (Complete recipe rules), 04 (Design foundation and screenshot tests)

**Status:** ready-for-agent

- [ ] Header with the title and Tags; without a Photo it is a plain coloured header (Photos themselves come in 07)
- [ ] Facts strip: Rating, times made, last made, total time, servings; optional facts the Recipe doesn't have (time, servings) are left out; the Rating shows "Sem nota" when absent, and times made shows "Nunca feita" when the Log is empty
- [ ] Times made and last made are derived from the Log
- [ ] Ingredients as a list with names on the left and quantities right-aligned; Ingredient Groups as small headings
- [ ] Quantities formatted in Portuguese: decimal comma, "L" for litres, "xícara"/"xícaras", "a gosto", plain counts
- [ ] Steps numbered with large numerals
- [ ] Notes after the Steps with a small "Notas" label in a quiet style, only when present
- [ ] Log as a timeline of Cooks, newest first, each date with its note if any; hidden when empty
- [ ] "Adaptada de" credit linking each Source; hidden entirely for an original Recipe
- [ ] Link back to the index
- [ ] One column on phones, Ingredients beside Steps on wide screens
- [ ] A story for every state: with and without each optional field, Ingredient Groups, never made, several Sources, no Sources, long title
- [ ] All stories pass the a11y addon; screenshot tests added for the main states
- [ ] End-to-end test checks a full Recipe page and a minimal one
