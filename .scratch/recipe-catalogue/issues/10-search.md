# 10: Search

**What to build:** A quiet search field under the index title finds Recipes by words in their title, Ingredients, Steps, Tags or Notes, updating as the owner types and working together with sorting and the Tag filter.

**Blocked by:** 09 (Sorting and Tag filter)

**Status:** done

- [x] Pagefind indexes the built Recipe pages at build time
- [x] The search field is an underlined input with no box, matching the design
- [x] Results update as the owner types
- [x] The index controls are one line of quiet text controls ("Ordenar por:" with Nota, Mais feitas, Há mais tempo, Mais rápidas; "Tags:"; "Limpar" when anything is active; owner decision, 2026-11-24)
- [x] No A–Z option and no letter row or headings: the default is one plain A–Z list (owner decision, 2026-11-24)
- [x] New order "Mais rápidas" (`order=quickest`): total time ascending, no time last (owner decision, 2026-11-24)
- [x] The index controls pass Pagefind's matching Recipes to the catalogue view, so search combines with sort and Tag
- [x] A clear message when nothing matches
- [x] The search text is kept in the page address with the order and Tag
- [x] Works under the GitHub Pages base path
- [x] Story play functions for typing, no results and clearing (with Pagefind stubbed at the component boundary)
- [x] End-to-end test on the built site: search by title, by an Ingredient, by a word in the Notes, no results, and combined with a Tag

## Comments

Done. Notes for later tickets:

- Pagefind 1.6.0 runs after the Astro build: `pnpm build`, `test:e2e` and `screenshots:run` all run `pagefind --site <outDir>`. Only pages with `data-pagefind-body` are indexed; that attribute is on the Recipe page's `<main>` (the index page is not indexed). Only Recipe content is indexed: the `<main>` is not marked; several `data-pagefind-body` elements mark the title, Tags, Ingredient groups, Steps, Notes paragraphs and Cook notes, so interface labels are never indexed. New content needs the attribute; new labels need nothing.
- `src/lib/search.ts` loads `<base>/pagefind/pagefind.js` at runtime (so the base path works) and maps result addresses to slugs with `slugFromUrl`. `IndexPage` takes an optional `search` prop (default Pagefind); stories pass a stub. `slugs` is no longer a prop: the island keeps it as state.
- Page address: `?q=<text>` joins `order` and `tag`. Typing uses `replaceState` (no history entry per key); `parseQuery` and `queryParam` in `catalogue-view.ts` read and write it. Sort and Tag links keep `q`.
- Pagefind matches loosely (word stems and fuzzy), so an unrelated word can still match; the e2e "no results" test uses "feijoada".
- `astro dev` has no Pagefind index; the field then shows "A busca não está disponível." Run `pnpm build` and `astro preview` to try search.
- Stories added: `Searching`, `NoResults`, `ClearingTheSearch`; screenshots for the first two.

Owner decisions, 2026-11-24 (changed after the first version):

- The controls are one line: `Ordenar por: Nota · Mais feitas · Há mais tempo · Mais rápidas   Tags: … ` then "Limpar" when an order, Tag or search is active. "Limpar" resets order, Tag and search (it replaces "Limpar filtro").
- There is no "A–Z" link and no letter row or headings; A–Z is the default and stays out of the address. `letterGroups`, the letter anchors and their tests and stories are gone, and `catalogueView` now returns a plain list. The index is one column at every width (a ranked list reads badly in newspaper columns). The letter index is in `.scratch/backlog.md` for about 30 Recipes.
- `order=quickest` sorts by `totalMinutes` ascending; Recipes without it go last, ties by title.
- Owner decision, 2026-11-24: an index entry looks the same in every order. The value on the right is always the Rating; the details line is unchanged. The order-dependent value code (`Value`, `timesMadeValue`, `lastMadeValue`, the `order` prop on `IndexEntry`) is gone, which supersedes the "value on the right matches the order" behaviour from ticket 09 and the "time shown on the right" for "Mais rápidas".
- Owner decisions, 2026-11-24 (prototype variant C2, built into the real components; the prototype is deleted):
  - Site name "Minhas receitas": the index `h1` and page titles ("Pudim · Minhas receitas"). The base path `/caderno-de-receitas`, the repository name and addresses are unchanged; renaming them is a separate change.
  - Index header centred: `h1`, then "ÍNDICE · N" (count in accent), the centred italic search field on a `--color-line` underline, then the controls. On phones each label ("Ordenar por:", "Tags:") sits on its own line above its options; from 40rem everything shares one baseline. The active option is accent italic; "Limpar" shows only when something is active.
  - Entries: Fraunces title, Rating as "4/5" (accent) or "–/5" (muted) with screen-reader text "Nota N de 5" / "Sem nota"; italic details "45 min · Feita · 2" or "Nunca feita" (`formatTimesMade` changed). One centred column, `--measure` wide, with variant B's hairline (`--color-line`) between entries. The dotted leader is gone.
  - Stories: "Pages/Índice" (`pages-index`: Default, Sorted, FilteredByTag, Searching with clearing, NoResults) and "Pages/Receita" (`pages-recipe`); screenshot names changed accordingly.
