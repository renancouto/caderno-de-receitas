# 10: Search

**What to build:** A quiet search field under the index title finds Recipes by words in their title, Ingredients, Steps, Tags or Notes, updating as the owner types and working together with sorting and the Tag filter.

**Blocked by:** 09 (Sorting and Tag filter)

**Status:** ready-for-agent

- [ ] Pagefind indexes the built Recipe pages at build time
- [ ] The search field is an underlined input with no box, matching the design
- [ ] Results update as the owner types
- [ ] The index controls pass Pagefind's matching Recipes to the catalogue view, so search combines with sort and Tag
- [ ] A clear message when nothing matches
- [ ] The search text is kept in the page address with the order and Tag
- [ ] Works under the GitHub Pages base path
- [ ] Story play functions for typing, no results and clearing (with Pagefind stubbed at the component boundary)
- [ ] End-to-end test on the built site: search by title, by an Ingredient, by a word in the Notes, no results, and combined with a Tag
