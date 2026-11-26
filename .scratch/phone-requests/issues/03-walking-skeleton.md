# 03: Walking skeleton: a new Recipe from a Request

**What to build:** The owner opens an issue with recipe text (and optionally Source links, no photos yet); the workflow checks it's the owner, asks the free model for the Recipe, checks it against the recipe rules, and opens a pull request linked to the Request with the guessed conversions in a comment. CI runs on that pull request. If anything fails, the workflow comments the problem on the Request instead.

**Blocked by:** 01 (Confirm the facts), 02 (One rules document)

**Status:** ready-for-agent

- [ ] Owner-only steps, listed clearly: create a Gemini API key in Google AI Studio and save it as a repository secret; read the chosen model's free limits in AI Studio (they aren't in the docs) and note them here; create a private GitHub App installed only on this repository (Contents and Pull requests write) and save its ID and private key as repository secrets
- [ ] Workflow on `issues` opened; runs only when the issue's author and the actor are the owner's numeric user ID; minimal permissions; no `pull_request_target`
- [ ] The workflow's logic is small TypeScript modules with Vitest tests: reading the Request (text, links), the owner check, building the model's instructions from the rules document, turning the reply into a file and a list of guessed conversions
- [ ] The model's reply goes through `checkRecipe` before anything is committed; a reply that fails is reported on the Request
- [ ] Branch `request/<issue number>`, one commit, a pull request with `Closes #<n>`, and a Portuguese comment listing guessed conversions; a link to the pull request is commented on the Request
- [ ] The branch is pushed and the pull request opened with a GitHub App token (`actions/create-github-app-token`), so the normal `pull_request` CI runs and the required checks count for it; not `gh workflow run`, whose checks don't count (ticket 01)
- [ ] The model name is one config value (suggested: `gemini-3.8-flash`); the reply uses structured output (JSON Schema); only the Request's text and the rules are sent, never photos
- [ ] Failures (rules broken, model unavailable or over its free limit, `429 RESOURCE_EXHAUSTED`) produce a Portuguese comment on the Request and no pull request
- [ ] Tests never call the model: recorded replies, including one that breaks the recipe rules
- [ ] Tried once for real with a short Request; the pull request passes CI; the result is described in the closing note, and the pull request and issue are closed without merging unless the owner wants the Recipe
