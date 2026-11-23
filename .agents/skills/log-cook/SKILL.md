---
name: log-cook
description: Log a Cook (and optionally a new Rating) on a Recipe from a sentence, then land it on protected main through a squash-merged PR.
disable-model-invocation: true
---

The owner writes one sentence in Portuguese, such as "fiz a carbonara hoje, precisava de mais pimenta". Add one **Cook** to the matching **Recipe**'s **Log** and land it on `main`. Terms are in `GLOSSARY.md`.

`main` is protected: it takes no direct pushes, and a PR merges only when the required checks pass, squashed. The change therefore travels on a short branch and a PR.

## Steps

1. **Start clean.** Run `git status --short`; if anything is uncommitted, stop and tell the owner. Then `git switch main && git pull --ff-only`. Done when `main` equals `origin/main` and the tree is clean.

2. **Find the Recipe.** Compare the dish named in the sentence with each Recipe's `title` and file name in `recipes/`, ignoring case and accents. Done when exactly one Recipe matches, or you have asked.
   - One match: use it.
   - Several matches ("carbonara" fits `carbonara-picante` and `carbonara-classica`): list them numbered with their titles and ask the owner to choose. Wait for the answer; never pick for them.
   - No match: say so and list the closest titles. Stop; creating a Recipe belongs to `@add-recipe`.

3. **Read the sentence for the Cook.**
   - **Date**: today's date unless the sentence gives another ("ontem", "sábado", "dia 3"). Resolve it against today's date to `YYYY-MM-DD`. When the sentence gives a day you cannot resolve (a bare weekday that could be two dates), ask.
   - **Note**: the owner's remark about that occasion, written in Brazilian Portuguese in the owner's own words, trimmed to what they said ("Precisava de mais pimenta."). Omit `note` when they said nothing about the occasion.
   - **Rating**: a whole number from 1 to 5 only when the sentence gives one ("nota 5", "4 estrelas"). A vague opinion ("ficou ótima") is a note, not a Rating; leave the Rating as it is.

4. **Edit the file** `recipes/<file-name>.md`, changing only these lines of the front matter:
   - Add the Cook to `log`, creating `log` when absent. Keep the Log **newest first**: insert the Cook at the position its date belongs, so a Cook dated in the past lands below newer ones; a Cook with the same date as an existing one goes above it.
   - Set `rating` when step 3 found one, replacing any existing value.
   - Write the Cook as `- date: 2026-11-23` with `note: ...` beneath it when present, matching the indentation and quoting already in the file. Quote the note when it contains `:` or `#`.
   - Leave the body, the other fields and the existing Cooks byte for byte as they were.

5. **Run the recipe rules.** `pnpm check:recipe recipes/<file-name>.md`. Done when it prints `ok`; on a problem, fix the edit and run it again. If a problem was already in the file before your edit, show it to the owner and stop.

6. **Show the owner the change**: `git diff` of the file plus one line saying what was logged. Land it right away unless the owner asked to review first.

7. **Land it.** Use the Recipe's file name and the Cook's date in these names.
   1. `git switch -c log-cook/<file-name>-<date>`
   2. `git add recipes/<file-name>.md`, then commit with the subject `Log cook: <Recipe title>` (72 characters or fewer; shorten the title if needed), no body.
   3. `git push -u origin HEAD`
   4. `gh pr create --title "Log cook: <Recipe title>" --body "Logs a Cook on <Recipe title>."`
   5. `gh pr checks --watch`. Done when every check has passed. If one fails, show the owner the failure and stop; leave the PR open.
   6. `gh pr merge --squash --delete-branch`
   7. `git switch main && git pull --ff-only`. Done when the local `main` contains the squashed commit and the tree is clean.

8. **Report** in one or two sentences in Portuguese: the Recipe, the date, the Rating if changed, and the merged PR link.
