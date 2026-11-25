---
name: add-recipe
description: Turn a pasted or dictated recipe, with optional Source links and Photos, into a valid Recipe file ready for the owner to review.
disable-model-invocation: true
---

The owner pastes or dictates a recipe, with zero, one or several **Source** links and optionally **Photos** and Step photos. Write it as one new **Recipe** in `recipes/` and hand it back for review. Terms are in `GLOSSARY.md`; `tests/e2e/recipes/bolo-de-cenoura.md` shows every field in use.

Everything written into the Recipe is in Brazilian Portuguese.

## Steps

1. **Start clean.** Run `git status --short`; if anything is uncommitted, stop and tell the owner. Then `git switch main && git pull --ff-only`. Done when `main` equals `origin/main` and the tree is clean.

2. **Pick the branch.**
   - **Original** (no Source): keep the owner's wording in the title, Ingredient names, Steps and Notes. Change only quantities (step 4), Step numbering and obvious typos.
   - **From Sources** (one or several): translate into Brazilian Portuguese and rewrite every Step in your own words, as a short instruction that carries the same actions, times and temperatures. Merge several Sources into one Recipe, following the owner's text where the Sources disagree. Each Source goes in `sources:` as its URL, a credit only; copy no text and no image from a Source.

3. **Name the file.** Take the title, lowercase it, drop accents and punctuation, join words with `-` (`Pão de queijo mineiro` → `pao-de-queijo-mineiro`). If `recipes/<name>.md` or the folder `recipes/<name>/` already exists, read that Recipe: the same dish means stop and tell the owner; a different dish means add a distinguishing word from the recipe (`-vegano`, `-de-forno`). Done when the name is kebab-case and unused.

4. **Normalise every Ingredient.** Each one ends as exactly one of:
   - `quantity` with `unit` `g`, `ml`, `l` or `cup` (250 ml);
   - a plain count: `quantity` with no `unit` (`Ovos`, 3);
   - `toTaste: true` ("a gosto").

   Convert everything else and note each conversion you had to guess: spoon measures (1 colher de sopa = 15 ml, de chá = 5 ml; for solids weigh it, e.g. 1 colher de sopa de açúcar ≈ 12 g), US cups (240 ml; write `cup` when the 4% difference doesn't matter, as in most savoury dishes, otherwise ml or g), oz (28 g), lb (454 g), fl oz (30 ml), °F (to °C in the Step), "uma pitada" (→ "a gosto"), "1 lata" (→ grams or ml printed on a typical can). Round to sensible kitchen numbers. Keep a group the recipe names ("Para a cobertura" → `name: Cobertura`); otherwise one group with no `name`. Done when no Ingredient has any other unit.

5. **Fill the front matter**: `title`, `sources` (only From Sources), `servings` and `totalMinutes` when the recipe gives them (convert hours to minutes; leave out rather than guess), `tags` only if the owner names some, then `ingredients`. Leave out `rating` and `log`. The body is `## Preparo` with a numbered list, then `## Notas` only when there are Notes.

6. **Place the Photos.** Skip when the owner gave none. Put every image in the folder `recipes/<name>/`, lowercase kebab-case names, keeping the extension (jpg, jpeg, png, webp, avif):
   - A Photo of the dish: `capa.jpg` for the first, then `foto-2.jpg`, …, listed in order in `photos: [<name>/capa.jpg]`. The first is the page header.
   - A Step photo: `passo-<N>.jpg` for Step N, written on its own line indented under that Step with empty alt text:
     ```markdown
     1. Bata a cenoura e os ovos no liquidificador.
        ![](bolo-de-cenoura/passo-1.jpg)
     ```
     One image per Step. When it isn't clear which Step a photo shows, ask.
   - Then run `pnpm strip:location recipes/<name>/*` and `pnpm check:photos`. Done when `check:photos` passes (the repository is public, so a GPS tag would leak the owner's home).

7. **Run the recipe rules.** `pnpm check:recipe recipes/<name>.md`. Done when it prints `ok`; on a problem, fix the file and run it again.

8. **Hand it back** in Portuguese, and stop there; the owner reviews first, so leave everything uncommitted. Say:
   - the file (and Photo folder) is ready to review;
   - every conversion you guessed in step 4, one per line ("1 colher de sopa de manteiga → 15 g");
   - anything you left out or assumed (no servings given, a Step you split).

## After the owner's review

When the owner approves and asks you to land it, use the `@log-cook` landing (its step 7) with branch `add-recipe/<name>`, `git add recipes/<name>.md recipes/<name>/`, and subject and PR title `Add recipe: <title>`.
