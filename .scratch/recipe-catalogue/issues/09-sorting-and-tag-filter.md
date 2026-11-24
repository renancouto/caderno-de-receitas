# 09: Sorting and Tag filter

**What to build:** The owner can sort the index by A–Z, Rating, times made or longest since last made, and filter it by one Tag. The view is kept in the page address so reloading or going back keeps it.

**Blocked by:** 08 (A–Z index)

**Status:** done

- [x] Sort options as a row of quiet text links: A–Z · Nota · Mais feitas · Há mais tempo
- [x] A–Z keeps the letter groups; every other order shows one flat list with dotted leaders
- [x] The value on the right matches the order: stars, "5×", or the last-made date
- [x] Recipes without the sorted value (no Rating, never made) go to the end
- [x] Tags as small text links; choosing one filters the list; a way to clear the filter
- [x] Sort and Tag combine
- [x] The current order and Tag are kept in the page address
- [x] The controls are a hydrated island; without JavaScript the A–Z index still works
- [x] Unit tests in the catalogue view for every order, ties, missing values and Tag filtering
- [x] Story play functions for sorting, filtering and clearing
- [x] End-to-end test for each order, a Tag filter, a combination, and reload keeping the view

## Comments

Done. Notes for later tickets:

- `src/lib/catalogue-view.ts` now exports `catalogueView(recipes, { order, tag?, slugs? })` → `{ kind: "grouped", groups }` (A–Z) or `{ kind: "flat", recipes }`; `allTags`, `parseView(search)`, `viewSearch(currentSearch, view)` and `orders`. Orders are `alphabetical` (default), `rating`, `times-made`, `least-recent`. Recipes without the value go last; ties by title. Never-made Recipes go last in "Há mais tempo" too.
- Page address: `?order=<order>&tag=<tag>`; the default order is left out. `viewSearch` keeps every other parameter, so ticket 10 should add its `q` parameter the same way and pass the matching Recipes' slugs as `slugs` (`IndexPage` already accepts an optional `slugs` set and hands it to `catalogueView`).
- `IndexPage` is now a hydrated island (`client:load`). The server renders the default A–Z view; on mount it reads the address and listens to `popstate`. Without JavaScript the A–Z index works and the controls are plain links to `?order=…`. Reloading therefore briefly shows A–Z before the saved view appears.
- New `IndexControls` (sort links "A–Z · Nota · Mais feitas · Há mais tempo", Tag links, "Limpar filtro"). The letter row only shows in A–Z; "Receitas · N" counts the Recipes shown. `IndexRecipe` gained `lastMade` and `tags`; `IndexEntry` takes an `order` and shows stars, "5×" or the last-made date (a dash when missing).
- Stories: `SortedByRating` and `FilteredByTag` (filter, combine, clear). Their plays change the page address, so `beforeEach` restores it. e2e Recipes got tags (`pudim`: sobremesa, `pao-de-queijo`: salgado); the index screenshot changed.

Ticket 10 (owner decision, 2026-11-24) removed the A–Z link (A–Z is the default when no order is chosen), made A–Z a plain list like the other orders, replaced "Limpar filtro" with "Limpar" (resets order, Tag and search), and added the "Mais rápidas" order. `catalogueView` returns a plain list now.
