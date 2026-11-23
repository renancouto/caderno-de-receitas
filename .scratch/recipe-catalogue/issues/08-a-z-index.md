# 08: A–Z index

**What to build:** The index looks like the index of a cookbook: every Recipe in alphabetical order grouped by first letter, a row of letters that jumps to each group, and entries with dotted leaders.

**Blocked by:** 03 (Complete recipe rules), 04 (Design foundation and screenshot tests)

**Status:** ready-for-agent

- [ ] Catalogue view module (pure): given all Recipes, returns letter groups in Portuguese alphabetical order; accented titles sort and group correctly (e.g. "Pão" under P)
- [ ] Site name above the "Índice" title, and the number of Recipes under it
- [ ] Row of letters that jump to each group; only letters with Recipes appear
- [ ] Each entry: title, dotted leader, Rating on the right (a dash when there is none); total time and times made underneath ("Nunca feita" when the Log is empty)
- [ ] Two columns on wide screens, one on phones
- [ ] Unit tests for the catalogue view's grouping and ordering
- [ ] Stories for the index and entry states; a11y addon passes; screenshot tests at phone width
- [ ] End-to-end test: groups, letter jumps and navigation to a Recipe and back
