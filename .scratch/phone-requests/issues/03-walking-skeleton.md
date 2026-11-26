# 03: Walking skeleton: a new Recipe from a Request

**What to build:** The owner opens an issue with recipe text (and optionally Source links, no photos yet); the workflow checks it's the owner, asks the free model for the Recipe, checks it against the recipe rules, and opens a pull request linked to the Request with the guessed conversions in a comment. CI runs on that pull request. If anything fails, the workflow comments the problem on the Request instead.

**Blocked by:** 01 (Confirm the facts), 02 (One rules document)

**Status:** wontfix

- [x] Owner-only steps, listed clearly: create a Gemini API key in Google AI Studio and save it as a repository secret; read the chosen model's free limits in AI Studio (they aren't in the docs) and note them here; create a private GitHub App installed only on this repository (Contents and Pull requests write) and save its ID and private key as repository secrets
- [x] Workflow on `issues` opened; runs only when the issue's author and the actor are the owner's numeric user ID; minimal permissions; no `pull_request_target`
- [x] The workflow's logic is small TypeScript modules with Vitest tests: reading the Request (text, links), the owner check, building the model's instructions from the rules document, turning the reply into a file and a list of guessed conversions
- [x] The model's reply goes through `checkRecipe` before anything is committed; a reply that fails is reported on the Request
- [x] Branch `request/<issue number>`, one commit, a pull request with `Closes #<n>`, and a Portuguese comment listing guessed conversions; a link to the pull request is commented on the Request
- [x] The branch is pushed and the pull request opened with a GitHub App token (`actions/create-github-app-token`), so the normal `pull_request` CI runs and the required checks count for it; not `gh workflow run`, whose checks don't count (ticket 01)
- [x] The model name is one config value (suggested: `gemini-3.8-flash`); the reply uses structured output (JSON Schema); only the Request's text and the rules are sent, never photos
- [x] Failures (rules broken, model unavailable or over its free limit, `429 RESOURCE_EXHAUSTED`) produce a Portuguese comment on the Request and no pull request
- [x] Tests never call the model: recorded replies, including one that breaks the recipe rules
- [ ] Tried once for real with a short Request; the pull request passes CI; the result is described in the closing note, and the pull request and issue are closed without merging unless the owner wants the Recipe

## Notes

- Owner steps: Gemini API key (`GEMINI_API_KEY`) and the private GitHub App (`REQUESTS_APP_ID`, `REQUESTS_APP_PRIVATE_KEY`) are saved as repository secrets. Free limits for `gemini-3.8-flash` (from https://aistudio.google.com/rate-limit): 5 requests per minute, 250K tokens per minute, 20 requests per day (read 2026-11-26). Plenty for a few Requests a day; "refazer" counts too.
- Built: `.github/workflows/requests.yml` (owner ID 230893, checked in the job's `if` and again in `scripts/handle-request.ts`); modules in `src/lib/requests/` (`request`, `instructions` with the `model` config value and JSON Schema, `gemini`, `reply`, `comments`, `handle-request`); recorded replies in `src/lib/requests/replies/` (`invalid-key.json` is a real reply; the others follow the documented shapes, since no key was available locally).
- `create-github-app-token` v3 deprecates `app-id` in favour of `client-id`; it still works (warning only). Switch by saving the app's Client ID as a secret.
- Rule problems in the failure comment are `checkRecipe`'s English messages under a Portuguese heading.
- Real try: not done yet (the `issues` trigger only runs from the default branch).
- First real try (issue #24, 2026-11-26): the Interactions API (`/v1beta/interactions`) answered `403 PERMISSION_DENIED` for this free key, while `models` and `generateContent` accepted it (`generateContent` then gave `503 UNAVAILABLE`, the model being busy). Switched to `generateContent` with `responseJsonSchema`, retry a busy model (503) three times over about a minute, and report a refused key (401/403) as such instead of "o modelo não respondeu".

## Comments

Dropped on 2026-11-26: the owner changes the Catalogue only from the desktop. See the Outcome in `docs/adr/0003-phone-changes-through-requests.md`.
