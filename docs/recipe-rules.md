# Recipe rules

How to write a change to the owner's recipe **Catalogue**. You have this document, the owner's **Request** (a message in Portuguese asking for one change to one Recipe), today's date, and, when the Request changes an existing Recipe, that Recipe's current file. Every rule here works from those alone.

Everything written into a Recipe is in Brazilian Portuguese.

## Terms

- **Recipe**: one dish, kept as one Markdown file with YAML front matter.
- **Source**: a link the Recipe was adapted from; a credit only. A Recipe with no Source is an **Original Recipe**, the owner's own.
- **Ingredient**: one line of the ingredient list; **Ingredient Group**: a named subset, such as "Cobertura".
- **Step**: one numbered instruction. **Notes**: the owner's free-text tweaks and observations.
- **Tag**: a free-form label, such as "jantar".
- **Photo**: an image of the dish supplied by the owner; a **Step photo** shows one Step.
- **Standard Unit**: `g`, `ml`, `l`, or `cup` (250 ml).
- **Normalising**: rewriting every quantity into a Standard Unit, a plain count, or "a gosto".
- **Rating**: the owner's single 1–5 opinion of the Recipe.
- **Cook**: one occasion the owner made the Recipe: a date, optionally with a note. The **Log** is the list of Cooks.

## Wording: original or from Sources

- **Original** (the Request has no Source link): keep the owner's wording in the title, Ingredient names, Steps and Notes. Change only quantities (see Normalising), Step numbering and obvious typos.
- **From Sources** (one or several links): translate into Brazilian Portuguese and rewrite every Step in your own words, as a short instruction that carries the same actions, times and temperatures. Merge several Sources into one Recipe, following the owner's text where the Sources disagree. Each Source goes in `sources:` as its URL, a credit only; copy no text and no image from a Source.

## Normalising

Each Ingredient ends as exactly one of:

- `quantity` with `unit` `g`, `ml`, `l` or `cup` (250 ml);
- a plain count: `quantity` with no `unit` (`Ovos`, 3);
- `toTaste: true` ("a gosto").

Convert everything else, and record each conversion you had to guess, one per line ("1 colher de sopa de manteiga → 15 g"):

- spoon measures: 1 colher de sopa = 15 ml, 1 colher de chá = 5 ml; for solids weigh it (1 colher de sopa de açúcar ≈ 12 g);
- A Brazilian "xícara" (or "xícara de chá"): 1 `cup`, no conversion; it's the same cup the owner measures with.
- US cups: 240 ml; write `cup` when the 4% difference doesn't matter, as in most savoury dishes, otherwise ml or g;
- oz → 28 g, lb → 454 g, fl oz → 30 ml;
- °F → °C, in the Step text;
- "uma pitada" → "a gosto";
- "1 lata" → the grams or ml printed on a typical can.

Round to sensible kitchen numbers. Done when no Ingredient has any other unit.

## Recipe file

```markdown
---
title: Bolo de cenoura com cobertura
sources:
  - https://panelinha.com.br/receita/bolo
servings: 12
totalMinutes: 75
tags: [sobremesa, café da tarde]
rating: 4
photos: [bolo-de-cenoura-com-cobertura/capa.jpg]
ingredients:
  - name: Massa
    items:
      - name: Cenoura
        quantity: 300
        unit: g
      - name: Ovos
        quantity: 3
  - name: Cobertura
    items:
      - name: Sal
        toTaste: true
log:
  - date: 2026-11-23
    note: Precisava de mais açúcar.
---

## Preparo

1. Bata a cenoura e os ovos no liquidificador.
   ![](bolo-de-cenoura-com-cobertura/passo-1.jpg)
2. Asse por 40 minutos a 180 °C.

## Notas

Fica melhor no dia seguinte.
```

- `title`: required.
- `sources`: only for a Recipe from Sources, as a list of URLs.
- `servings` and `totalMinutes`: only when the recipe gives them (convert hours to minutes); leave them out rather than guess.
- `tags`: only the ones the owner names.
- `ingredients`: required. Keep a group the recipe names ("Para a cobertura" → `name: Cobertura`); otherwise one group with no `name`.
- `rating` and `log`: left out of a new Recipe; set only as described under Cooks and Ratings.
- Body: `## Preparo` with a numbered list, then `## Notas` only when there are Notes.

## File and Photo names

- **File name**: take the title, lowercase it, drop accents and punctuation, join words with `-`, add `.md` (`Pão de queijo mineiro` → `pao-de-queijo-mineiro.md`). When that name already belongs to a different dish, add a distinguishing word from the recipe (`-vegano`, `-de-forno`).
- **Photos** live in the folder named after the file (`pao-de-queijo-mineiro/`), in lowercase kebab-case, keeping the image's extension (jpg, jpeg, png, webp or avif).
  - Photos of the dish: `capa.jpg` for the first, then `foto-2.jpg`, `foto-3.jpg`, …, listed in that order in `photos: [<name>/capa.jpg, …]`. The first is the page header.
  - Step photo: `passo-<N>.jpg` for Step N, on its own line indented under that Step with empty alt text, as in the example above. One image per Step. When it isn't clear which Step a photo shows, ask.

## Cooks and Ratings

When the Request says the owner made a Recipe ("fiz a carbonara hoje, precisava de mais pimenta"):

- **Date**: today's date unless the Request gives another ("ontem", "sábado", "dia 3"); resolve it against today's date to `YYYY-MM-DD`. When the day can't be resolved to one date (a bare weekday that could be two dates), ask.
- **Note**: the owner's remark about that occasion, in Brazilian Portuguese and in the owner's own words, trimmed to what they said ("Precisava de mais pimenta."). Omit `note` when they said nothing about the occasion.
- **Rating**: a whole number from 1 to 5, only when the Request gives one ("nota 5", "4 estrelas"). A vague opinion ("ficou ótima") is a note, and the Rating stays as it is.

Edit only these front-matter lines:

- Add the Cook to `log`, creating `log` when absent. Keep the Log **newest first**: insert the Cook where its date belongs, so a past date lands below newer Cooks; a Cook with the same date as an existing one goes above it.
- Write the Cook as `- date: 2026-11-23` with `note: ...` beneath it when present, matching the file's existing indentation and quoting. Quote the note when it contains `:` or `#`.
- Set `rating` when the Request gives one, replacing any existing value.
- Every other line of the file (body, other fields, existing Cooks) stays byte for byte as it was.
