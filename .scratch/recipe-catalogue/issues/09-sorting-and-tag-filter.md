# 09: Sorting and Tag filter

**What to build:** The owner can sort the index by A–Z, Rating, times made or longest since last made, and filter it by one Tag. The view is kept in the page address so reloading or going back keeps it.

**Blocked by:** 08 (A–Z index)

**Status:** ready-for-agent

- [ ] Sort options as a row of quiet text links: A–Z · Nota · Mais feitas · Há mais tempo
- [ ] A–Z keeps the letter groups; every other order shows one flat list with dotted leaders
- [ ] The value on the right matches the order: stars, "5×", or the last-made date
- [ ] Recipes without the sorted value (no Rating, never made) go to the end
- [ ] Tags as small text links; choosing one filters the list; a way to clear the filter
- [ ] Sort and Tag combine
- [ ] The current order and Tag are kept in the page address
- [ ] The controls are a hydrated island; without JavaScript the A–Z index still works
- [ ] Unit tests in the catalogue view for every order, ties, missing values and Tag filtering
- [ ] Story play functions for sorting, filtering and clearing
- [ ] End-to-end test for each order, a Tag filter, a combination, and reload keeping the view
