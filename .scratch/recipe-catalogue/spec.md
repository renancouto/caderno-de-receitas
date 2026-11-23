Status: ready-for-agent

# Spec: Recipe Catalogue v1

## Problem Statement

My recipes are scattered: some are my own, some I adapted from several places, and many live on YouTube or random websites. Finding them again means searching through notes, playlists and bookmarks, recipes online can be deleted or changed at any time, and each one uses its own units (tablespoons, US cups, pinches), so I keep converting while cooking. I can't record my own tweaks next to a recipe, how much I liked it, or when I last made it.

## Solution

A personal Catalogue of Recipes, named **Caderno de receitas**, published as a static website in Brazilian Portuguese, which I own entirely. Each Recipe is a file in a git repository with every quantity in a Standard Unit. A Recipe may be my own, with no Source, or adapted from one or more Sources, which are kept only as credit links and whose text is rewritten in my own words. I add Recipes and log Cooks by talking to my coding agent through two project skills (`@add-recipe` and `@log-cook`), which write the files; GitHub Actions tests the site and publishes it to GitHub Pages on every push.

The site has two pages: a cookbook-style A–Z index of the Catalogue with search, sorting and Tag filtering, and an editorial Recipe page designed for reading on a phone while cooking, where Ingredients and Steps can be ticked off.

## User Stories

### Reading the Catalogue

1. As the owner, I want an index of every Recipe in alphabetical order grouped by first letter, so that I can browse the Catalogue like the index of a cookbook.
2. As the owner, I want a row of letters at the top of the index that jumps to each letter group, so that I can reach a Recipe quickly in a long list.
3. As the owner, I want only letters that have Recipes to appear in that row, so that I never jump to an empty group.
4. As the owner, I want each index entry to show the title, a dotted leader and the Rating on the right, so that the index reads like a printed cookbook.
5. As the owner, I want each index entry to show the total time and how many times I've made it underneath, so that I can choose by effort and familiarity.
6. As the owner, I want a Recipe with no Rating to show a dash instead of empty stars, so that "not rated" is distinct from a low Rating.
7. As the owner, I want a Recipe never made to say "Nunca feita", so that I can spot Recipes I haven't tried.
8. As the owner, I want the number of Recipes shown under the index title, so that I can see the size of my Catalogue.
9. As the owner, I want a quiet search field under the index title, so that I can find a Recipe by words in its title, Ingredients, Steps, Tags or Notes.
10. As the owner, I want search results to update as I type, so that I don't have to submit anything.
11. As the owner, I want a clear message when nothing matches my search, so that an empty list isn't confusing.
12. As the owner, I want to sort the index by A–Z, Rating, times made, or longest since last made, so that I can answer questions like "what haven't I made in a while?".
13. As the owner, I want the A–Z order to keep the letter groups and every other order to show one flat list, so that grouping only appears where it makes sense.
14. As the owner, I want the value on the right of each entry to match the current order (stars for Rating, "5×" for times made, a date for last made), so that I can see why a Recipe is where it is.
15. As the owner, I want Recipes without the value being sorted on (no Rating, never made) to go to the end of the list, so that they don't crowd out the ones that have it.
16. As the owner, I want a row of Tag links to filter the index to one Tag, and a way to clear the filter, so that I can see all my "jantar" Recipes at once.
17. As the owner, I want search, sort and Tag filter to work together, so that I can, for example, find vegetarian Recipes I haven't made in a while.
18. As the owner, I want the current search, order and Tag kept in the page address, so that reloading or going back to the index keeps my view.

### Reading a Recipe

19. As the owner, I want a full-width header with my Photo, the title and Tags over it, so that the Recipe page feels like a cookbook spread.
20. As the owner, I want a Recipe without a Photo to show a plain coloured header with the title instead, so that it still looks finished.
21. As the owner, I want a strip of facts under the header (Rating, times made, last made, total time, servings), so that I see the essentials at a glance.
22. As the owner, I want facts that a Recipe doesn't have (no time, no servings) to be left out of the strip rather than shown empty, so that the page has no gaps.
23. As the owner, I want Ingredients as a list with the name on the left and the quantity right-aligned, so that I can scan quantities quickly.
24. As the owner, I want Ingredient Groups ("Massa", "Cobertura") shown as small headings within the Ingredients, so that multi-part Recipes stay clear.
25. As the owner, I want quantities written in Portuguese (e.g. "1,5 L", "2 xícaras", "a gosto"), so that the page reads naturally.
26. As the owner, I want Steps numbered with large numerals, so that I can find my place at a glance while cooking.
27. As the owner, I want to tap an Ingredient or Step to tick it off, and tap it again to untick it, so that I can keep track while cooking.
28. As the owner, I want ticked items to fade and be struck through, so that I can still read them if I need to.
29. As the owner, I want ticks to be usable with the keyboard as well as by tapping, so that the page stays accessible.
30. As the owner, I want ticks to reset when I reload the page, so that each Cook starts fresh.
31. As the owner, I want my Notes shown after the Steps with a small "Notas" label in a quiet style, so that my tweaks are there without competing with the Recipe.
32. As the owner, I want my Log shown as a timeline of Cooks, newest first, each with its date and note, so that I can remember how previous attempts went.
33. As the owner, I want a Cook without a note to show just its date, so that the Log stays tidy.
34. As the owner, I want a small "Adaptada de" credit linking to each Source, and no credit line at all on my own Recipes, so that I remember where a Recipe came from without original Recipes looking incomplete.
35. As the owner, I want a link back to the index from the Recipe page, so that I can return to browsing.
36. As the owner, I want each Recipe at a stable address based on its file name, so that links don't break when I change its title.
37. As the owner, I want the Recipe page laid out in one column on a phone and with Ingredients beside the Steps on a wide screen, so that it works in the kitchen and at a desk.

### Look and feel

38. As the owner, I want the site to use Fraunces for headings, Newsreader for reading text and Libre Caslon Text for labels, quantities and dates, so that it feels like a fine-dining menu and stays readable.
39. As the owner, I want an ivory background with a brown accent and a light theme only, so that it looks warm and calm.
40. As the owner, I want all text to meet WCAG AA contrast, so that it's readable in a bright kitchen.
41. As the owner, I want the site to be designed phone-first with generous spacing, so that I can read it at arm's length.
42. As the owner, I want all interface text in Brazilian Portuguese, so that the site is in my language.

### Adding Recipes and logging Cooks

43. As the owner, I want to run `@add-recipe` with a recipe pasted or written in my own words, plus any Source links, and get a Recipe file, so that adding a Recipe takes minutes.
44. As the owner, I want `@add-recipe` to accept a Recipe with no Source, so that I can record my own recipes.
43b. As the owner, I want `@add-recipe` to accept several Sources for one Recipe, so that a recipe I put together from several places credits all of them.
45. As the owner, I want `@add-recipe` to Normalise every quantity into a Standard Unit, a plain count or "a gosto", so that I never convert while cooking.
46. As the owner, I want `@add-recipe` to translate a recipe taken from a Source into Brazilian Portuguese and rewrite its Steps in its own words, so that the Catalogue is consistent and doesn't copy anyone else's text.
47. As the owner, I want `@add-recipe` to keep my own wording for original Recipes and only Normalise the quantities, so that my recipes stay in my voice.
48. As the owner, I want `@add-recipe` to tell me which conversions it guessed (e.g. a tablespoon of an unusual ingredient), so that I can check them.
49. As the owner, I want `@add-recipe` to fill in servings and total time whenever the recipe gives them, so that future servings adjustment has the data.
50. As the owner, I want `@add-recipe` to choose a file name from the title and avoid clashing with existing Recipes, so that addresses are unique.
51. As the owner, I want `@add-recipe` to accept Photos I supply and remove their location metadata, so that my home location is never published.
52. As the owner, I want `@add-recipe` to check the new file against the recipe rules before finishing, so that I never commit a Recipe that breaks the build.
53. As the owner, I want to review the file `@add-recipe` writes before committing, so that I stay in control of my Catalogue.
54. As the owner, I want to run `@log-cook` with a sentence like "fiz a carbonara hoje, precisava de mais pimenta" and have it add a Cook to the right Recipe's Log, so that logging is effortless.
55. As the owner, I want `@log-cook` to ask me which Recipe I mean when the sentence matches more than one, so that it never logs to the wrong one.
56. As the owner, I want `@log-cook` to update the Rating when I mention one, so that I can rate in the same sentence.
57. As the owner, I want to edit a Recipe file by hand at any time (Notes, Rating, Tags), so that I'm never locked into the skills.

### Safety and publishing

58. As the owner, I want the build to fail with a clear message naming the file and the problem when a Recipe breaks the rules, so that a mistake is never published.
59. As the owner, I want every push to main to be tested and published automatically to GitHub Pages, so that I never deploy by hand.
60. As the owner, I want publishing to happen only when all tests pass, so that a broken site is never published.
61. As the owner, I want every pull request to run the full test suite, so that changes are checked before they reach main.
62. As the owner, I want a check that fails when a committed Photo contains location metadata, so that a mistake outside `@add-recipe` is still caught.

## Implementation Decisions

### Architecture

- The site is a static Astro site, rebuilt and published by GitHub Actions to GitHub Pages from a public repository (ADR 0001). There is no database, server, login or editing interface: editing means committing.
- All visual UI is written as Preact components; Astro loads content, generates the static pages, hydrates islands and processes images (ADR 0002). Only the interactive parts are hydrated in the browser: the tick-off list and the index controls (search, sort, Tag filter). Everything else ships no JavaScript.
- Styling is plain CSS. The site is light theme only.
- Code, file names, data field names, page addresses and the glossary are in English. All interface text and Recipe content are in Brazilian Portuguese.
- Page addresses: the index at the site root, each Recipe at `/recipes/<file-name>`. The file name is chosen from the title when the Recipe is created and never changes with the title.

### Recipe file format

- One Markdown file per Recipe in a single recipes folder, with Photos in the same folder or a sibling folder named after the Recipe.
- A structured front-matter block holds everything except the Steps and Notes, which are Markdown sections in the body. The shape (refined from the UI prototype's type, with field names in English and units as internal keys):

  ```ts
  type Unit = "g" | "ml" | "l" | "cup"; // cup = 250 ml

  type Ingredient =
    | { name: string; quantity: number; unit?: Unit } // no unit = plain count ("2 ovos")
    | { name: string; toTaste: true };                // "a gosto"

  type IngredientGroup = { name?: string; items: Ingredient[] };

  type Cook = { date: string /* YYYY-MM-DD */; note?: string };

  type RecipeData = {
    title: string;
    sources?: string[];   // URLs; none for an original Recipe
    servings?: number;
    totalMinutes?: number;
    tags?: string[];
    rating?: 1 | 2 | 3 | 4 | 5;
    photos?: string[];    // first one is the header Photo
    ingredients: IngredientGroup[]; // at least one Ingredient
    log?: Cook[];
  };
  ```

- Steps are a numbered Markdown list under a "Preparo" heading; Notes are free text under a "Notas" heading. Steps are required, Notes are optional.
- Units are displayed in Portuguese: `cup` as "xícara"/"xícaras", `l` as "L", numbers with a decimal comma.
- Times made, last made and "never made" are always derived from the Log, never stored.

### Modules

- **Recipe rules**: a pure module that takes the raw contents of a Recipe file and returns either the parsed Recipe or a list of problems, each with a human-readable message. It owns every rule: required fields, allowed units, quantities positive, Rating between 1 and 5, valid ISO dates, every Source is a URL, at least one Ingredient and one Step, file name is lowercase kebab-case. The Astro content collection uses it, so the build fails with the file name and every problem. `@add-recipe` and `@log-cook` also run it before finishing.
- **Catalogue view**: a pure module that, given all Recipes plus a search result set, an order and a Tag, returns what the index shows: either letter groups (A–Z) or a flat list, with the value to show on the right of each entry. Sorting uses Portuguese collation for titles. Recipes missing the sorted value go last.
- **Search**: Pagefind indexes the built Recipe pages at build time. The index controls ask Pagefind for matching Recipe addresses and pass them to the Catalogue view. Searching works offline once loaded and needs no server.
- **UI components** (Preact): index page, index entry, letter row, index controls, Recipe header, facts strip, Ingredient list, Step list, tick-off list, Notes, Log timeline, Source credit (hidden when there are no Sources).
- **Project skills**: `@add-recipe` and `@log-cook` live in the project's agent skills folder. They are AI instructions plus any small scripts they need (for example, removing image metadata and running the recipe rules).

### Design

- The design is fixed by the UI prototype on the `prototype/ui` branch and recorded in `.scratch/recipe-catalogue/design-verdict.md`: layout C on both pages, Fraunces (light) for headings, Newsreader for reading text, Libre Caslon Text for labels, quantities and dates, ivory background `#f9f4ea`, lines `#e6dccb`, ink `#1d1c1a`, muted `#6f6a62`, accent `#8a5a3b`.
- The site name "Caderno de receitas" appears above the index title and in every page's browser title (e.g. "Carbonara picante · Caderno de receitas").
- The prototype code itself is not reused; it is rewritten properly as components with tests.
- Fonts are self-hosted rather than loaded from Google Fonts, so the site doesn't depend on a third party.

## Testing Decisions

A good test checks behaviour the owner can see or rely on, through a module's public interface: what a page shows, what happens when you tap, which files fail the build and why. Tests never reach into component internals or private functions, and they survive refactoring that doesn't change behaviour.

There are three seams, from highest to lowest:

1. **The built site** (Playwright end-to-end): build the site from a folder of test Recipes covering every case (Photo or none, groups, never made, no Rating, many Tags, long titles, accented titles), then test the real pages at phone and desktop widths: index grouping and letter jumps, search with Pagefind, every sort order, Tag filter, combinations, the page address keeping the view, navigating to a Recipe and back, Recipe addresses, ticking items. Separately, building with a folder containing an invalid Recipe must fail, and the error output must name the file and the problem.
2. **Components** (Storybook with the official Preact framework, run as tests by Storybook's Vitest addon in Vitest browser mode with Playwright's Chromium): a story for every visual state of every component, play functions for every interaction (ticking and unticking by tap and keyboard, searching, sorting, filtering, clearing), and the accessibility addon failing any story with a violation.
3. **Recipe rules and Catalogue view** (Vitest unit tests): one case per rule and per sort or filter behaviour, including edge cases like a Rating of 0 or 6, a "tbsp" unit, an empty Ingredient Group, a malformed date, ties in sorting and accented titles.

Also:

- **Visual regression**: Playwright screenshot comparisons of key stories and both pages at phone width. Screenshots differ between macOS and Linux, so the reference screenshots are always generated in the same Linux environment CI uses: locally through a Docker container running the official Playwright image (one command to update them), and in GitHub Actions in the same image. They are never generated on macOS.
- **Photo metadata check**: a test that fails if any committed Photo contains location metadata.
- **CI**: every pull request and every push to main runs type checking, unit tests, component tests, visual regression, end-to-end tests and the photo check. Publishing to GitHub Pages runs only after all of them pass.
- There is no prior art in the repository; these are the first tests.

## Out of Scope

Everything in `.scratch/backlog.md`, specifically:

- Importing from websites or YouTube automatically.
- Adjusting servings.
- Cooking mode (keeping the screen on, one Step at a time).
- Shopping lists and meal planning.
- A custom domain.
- Adding several Recipes at once.
- Adding Recipes or logging Cooks from a phone.

Also out of scope: dark mode, any login or editing interface on the site, downloading videos or copying Source photos, keeping the original Recipe next to a tweaked version (Notes cover tweaks), and Ratings per Cook.

## Further Notes

- Domain terms are defined in `GLOSSARY.md`; decisions in `docs/adr/0001-static-site-recipes-as-files.md` and `docs/adr/0002-page-ui-as-preact-components.md`.
- The UI prototype (all variants explored) is on the `prototype/ui` branch; the chosen design is in `.scratch/recipe-catalogue/design-verdict.md`.
- The repository is public, so `@add-recipe` must rewrite Steps taken from a Source in its own words rather than copying them, and must strip Photo location metadata.
