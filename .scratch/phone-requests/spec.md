Status: ready-for-agent

# Spec: Requests from the phone

## Problem Statement

I add Recipes and log Cooks with `@add-recipe` and `@log-cook`, but only at the desktop, through a coding agent. When I've just cooked something, or found a recipe, I'm usually holding my phone, so changes wait until I'm back at the computer, and some are forgotten.

## Solution

I send a **Request** from the GitHub app: a plain issue saying in Portuguese what I want, with any Source links and photos. A GitHub Actions workflow checks that the Request is mine, uses a free model (Gemini's free tier) with the same rules as the two skills, and opens a pull request with the change. CI runs on it; I review and merge it on my phone, and the site deploys. Nothing is published before the merge, unless auto-merge is turned on for that kind of change. The full flow is in [`flow.md`](flow.md); the decision and its alternatives are in `docs/adr/0003-phone-changes-through-requests.md`.

## User Stories

### Sending a Request

1. As the owner, I want to open a GitHub issue on my phone in plain Portuguese, so that I can change the Catalogue without the desktop.
2. As the owner, I want a Request with recipe text to add a new Recipe, Normalised into Standard Units, so that phone and desktop produce the same Recipes.
3. As the owner, I want links in a Request to become the Recipe's Sources, and a Request without links to be treated as my own Recipe, so that my wording is kept.
4. As the owner, I want a Request from a Source to be translated into Portuguese and rewritten in its own words, as `@add-recipe` does.
5. As the owner, I want a Request like "fiz a carbonara hoje, 4 estrelas" to log a Cook and change the Rating, so that logging takes one sentence.
6. As the owner, I want a Request like "na carbonara, são 3 ovos" to edit an existing Recipe, so that I can fix mistakes from the phone.
7. As the owner, I want images attached to a Request to become Photos, and "foto do passo 3" to make one a Step photo, so that I can add photos from the phone.
8. As the owner, I want one Request to cover one Recipe, so that each change has its own pull request.

### Getting the change

9. As the owner, I want the workflow to open a pull request linked to my Request, so that merging it closes the Request.
10. As the owner, I want the pull request to list every unit conversion that was guessed, so that I can check them.
11. As the owner, I want the workflow to ask on the Request when it can't tell which Recipe I mean, and to take my next comment as the answer.
12. As the owner, I want a comment on the Request explaining the problem when the result breaks the recipe rules or the model is unavailable, and no pull request in that case.
13. As the owner, I want to comment "refazer" to run a Request again and replace its pull request, and editing the Request's text not to rerun it, so that my edits in the pull request are never overwritten by surprise.
14. As the owner, I want the CI checks to run on the workflow's pull requests, so that they can be merged under branch protection.
15. As the owner, I want every comment from the workflow in Portuguese.

### Publishing

16. As the owner, I want to review and merge the pull request myself, so that nothing is published without me.
17. As the owner, I want an auto-merge switch, off by default, that can be turned on per kind of change (adding, editing, logging a Cook, changing the Rating), so that I can stop reviewing changes I trust.
18. As the owner, I want "publicar direto" in a Request to publish that one change without review.
19. As the owner, I want the site to deploy after an auto-merge too.

### Safety and privacy

20. As the owner, I want only my Requests to start the workflow, so that nobody else can spend the model's free quota or change the Catalogue.
21. As the owner, I want photos never committed with location data, so that my home isn't published.
22. As the owner, I want a Request's text treated as untrusted, so that a Request can't make the workflow do anything except produce a Recipe change.

### One set of rules

23. As the owner, I want the desktop skills and the workflow to follow the same written rules, so that changing a rule changes it everywhere.

## Implementation Decisions

- **Trigger:** `issues` (opened) and `issue_comment` (created) events. The workflow runs only when the issue's author and the event's actor are the owner, compared by numeric user ID. Never `pull_request_target`; permissions are the minimum each job needs.
- **Model:** Gemini through Google AI Studio's free tier, with its API key as a repository secret. The model only returns a Recipe file (or the changed one) and a list of guessed conversions; it can't run commands or touch other files. Its instructions are built from the shared rules file used by both skills.
- **Shared rules:** the Normalising, translation, file-format and naming rules move out of the two skills into one rules document that the skills point to and the workflow sends to the model.
- **Pull request:** a branch per Request (`request/<issue number>`), one commit with the Recipe and stripped photos, `Closes #<n>` in the body, and a Portuguese comment with the guessed conversions. "refazer" force-pushes the same branch.
- **CI on the workflow's commits:** commits pushed with the Action's own token don't start workflows, so the workflow starts CI with `gh workflow run` on the branch (CI gains a `workflow_dispatch` trigger with unchanged job names). After an auto-merge it starts the deploy the same way. If checks started this way don't count for the pull request, switch to a GitHub App token.
- **Photos:** downloaded from the Request's attachments, location data removed with the existing stripping code, placed next to the Recipe like `@add-recipe` does. Raw images are never committed.
- **Ambiguity:** when a Request matches several Recipes or none, the workflow comments a numbered list and stops; the owner's next comment continues the Request.
- **Auto-merge:** a repository setting read by the workflow, listing which kinds of change merge automatically (empty at first). "publicar direto" in a Request overrides it for that Request. Merging uses GitHub's auto-merge once the required checks pass.
- **Repository:** stays public on GitHub Pages (ADR 0003).

## Testing Decisions

- The workflow's logic lives in small TypeScript modules run by the workflow, tested with Vitest: reading a Request (text, links, attachments, "foto do passo N", "refazer", "publicar direto"), the owner check, matching a Request to a Recipe, building the model's instructions, and deciding whether to auto-merge.
- The model is never called in tests or CI: tests use recorded model replies, including bad ones that break the recipe rules.
- The model's output always goes through `checkRecipe` before a pull request is opened; tests cover a reply that fails it.
- The first ticket checks the three facts this design depends on (Gemini's free limits, checks started by `gh workflow run`, location data in attachments) before anything is built on them.

## Out of Scope

- Undoing a change: use GitHub's Revert button on the merged pull request, or send another Request.
- More than one Recipe per Request.
- Other models or paid plans.
- Making the repository private.

## Further Notes

- The Backlog's "Add from phone" becomes this feature; "Log a Cook from phone, no AI" is no longer needed.

## Tickets

The work is split into tickets in [`issues/`](issues/), each with its own checklist; the order is in [`tickets.md`](tickets.md).

- [ ] 01 · Confirm the facts the design depends on
- [ ] 02 · One rules document for the skills and the workflow
- [ ] 03 · Walking skeleton: a new Recipe from a Request
- [ ] 04 · Photos from a Request
- [ ] 05 · Changing existing Recipes: edits, Cooks and Ratings
- [ ] 06 · Running a Request again
- [ ] 07 · Auto-merge switch and "publicar direto"
