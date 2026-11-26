# Research: facts the phone Requests design depends on

Ticket: [01](issues/01-confirm-facts.md). Checked on 2026-11-26 unless noted. Earlier notes (2025-11-25) are folded in where still true.

| # | Fact | Spec assumed | Found | Changes tickets |
| - | ---- | ------------ | ----- | --------------- |
| 1 | Gemini free tier | usable, JSON replies | Yes, with caveats | 03 (model choice, quota handling) |
| 2 | `gh workflow run` checks count for the PR | yes | **No** | 03, 06, 07; spec and ADR 0003 |
| 3 | GitHub strips location from attachments | unknown | **No**, neither for CLI nor for phone (GitHub app) uploads | 04; spec and ADR 0003 |

## 1. Gemini free tier (Google AI Studio)

**Models on the free tier.** The pricing page lists "Free of charge" on the Standard tab for, among others, `gemini-4-hydrogen`, `gemini-3.8-flash`, `gemini-3.6-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`, `gemini-2.5-pro` and `gemini-2.5-flash`. The large Gemini 4 models (`carbon`, `argon`, `neon`) and `gemini-3.1-pro-preview` are **not** on the free tier. Source: https://ai.google.dev/gemini-api/docs/pricing

- Suggested model: `gemini-3.8-flash` (newest free Flash), or `gemini-4-hydrogen`, which the structured-output docs use in every example. Both are multilingual general models; Portuguese quality isn't documented per language, so judge it on recorded replies in ticket 03. Keep the model name in one config value so it can change.

**Limits.** The rate-limits page no longer publishes free-tier numbers per model: "Rate limits depend on a variety of factors (such as your usage tier) and can be viewed in Google AI Studio", and "Specified rate limits are not guaranteed". Limits are per project (not per API key), measured as RPM, input TPM and RPD; RPD resets at midnight Pacific time; preview models are more restricted. Free tier has no spend cap. Source: https://ai.google.dev/gemini-api/docs/rate-limits

- The actual numbers for the chosen model must be read at https://aistudio.google.com/rate-limit after the owner creates the project (owner step in ticket 03). One Request is one or two calls, so even single-digit RPM and a few dozen RPD are enough; the workflow must still treat `429 RESOURCE_EXHAUSTED` as "model unavailable" (user story 12).

**Use from GitHub Actions.** Nothing in the terms restricts where calls come from; access is by API key, so a repository secret works. Relevant terms (Gemini API Additional Terms, effective 2026-03-23, https://ai.google.dev/gemini-api/terms):

- "Use of Google AI Studio and Gemini API is for developers building with Google AI models for professional or business purposes, not for consumer use." A personal recipe site is a grey area; noted, not a blocker.
- Free ("Unpaid") use: Google may use prompts and replies to improve products, and human reviewers may read them. "Do not submit sensitive, confidential, or personal information." Recipes are fine; **never send photos or anything with location data to the model**.
- Users in the EEA, Switzerland or the UK may only use Paid Services when making API clients available to users there. Not relevant while the only user is the owner, outside the EEA.
- Free-tier projects may need verification: https://ai.google.dev/gemini-api/docs/verification

**JSON replies.** Yes. Structured outputs take a JSON Schema in `response_format` (`mime_type: application/json`, `schema: {...}`) through the Interactions API (`POST /v1beta/interactions`, `Api-Revision: 2026-05-20`); the JS SDK is `@google/genai`, and the docs pair it with Zod (`z.fromJSONSchema`). The page's own first example is a recipe extractor. Source: https://ai.google.dev/gemini-api/docs/structured-output. The reply must still go through `checkRecipe`.

**Unchanged from earlier notes:** GitHub Models was retired on 2026-07-30 (https://docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models), so a Gemini key is still needed.

## 2. Do checks started with `gh workflow run` count for the pull request?

**Answer: No.** Tested 2026-11-26.

Test: branch `test/dispatch-checks` from `main`, with CI's `pull_request:` trigger replaced by `workflow_dispatch:` (so only the dispatched run exists). Opened PR #18, ran `gh workflow run ci.yml --ref test/dispatch-checks` with my own (human) token. Run 45807091830 (`event: workflow_dispatch`) passed all three required jobs on the PR's head SHA `10546f8`.

- REST `commits/<sha>/check-runs`: the three check runs exist on the head SHA, app `github-actions`, and their `pull_requests` field even lists PR #18.
- But `gh pr checks 18`: "no checks reported"; `gh pr view --json statusCheckRollup`: empty; GraphQL `Commit.statusCheckRollup`: `null`, although `Commit.checkSuites` shows the `workflow_dispatch` suite. `mergeStateStatus` stayed `BLOCKED` (also after "ready for review", ~2 min later). Branch protection has no required reviews, so the missing checks are the only blocker.
- Control: PR #17 (normal `pull_request` CI) shows all checks in its rollup.

So check runs from `workflow_dispatch` attach to the SHA but are left out of the status rollup and don't satisfy the required checks (`strict`, app_id 15368 = GitHub Actions). With a human token; a `GITHUB_TOKEN` dispatch would be no better.

Docs (https://docs.github.com/en/actions/concepts/security/github_token, "When `GITHUB_TOKEN` triggers workflow runs"):

- Confirmed: "`workflow_dispatch` and `repository_dispatch` events always create workflow runs" with `GITHUB_TOKEN`.
- **New:** "when a workflow using `GITHUB_TOKEN` creates or updates a pull request, the resulting `pull_request` event creates workflow runs in an **approval-required** state. The pull request displays a banner in the merge box, and a user with write access to the repository can start the runs by selecting **Approve workflows to run**." Other activity types don't create runs. Pushes still don't. "If you need workflow runs from workflow-created pull requests to execute without requiring approval, use a GitHub App installation access token or a personal access token."

Cleanup: PR #18 closed, remote and local branch deleted.

**Options for ticket 03:**

1. **GitHub App token** (`actions/create-github-app-token`), the spec's fallback: the push and PR are made with the app's token, so normal `pull_request` CI runs and counts, with no tap. Needs an owner step (create a private app on this repo with Contents and Pull requests write, save app ID and private key as secrets). Works with auto-merge (ticket 07).
2. **`GITHUB_TOKEN` + approval tap:** CI runs normally once the owner taps "Approve workflows to run" on the PR. No secrets, but one more tap per PR (and per "refazer" force-push), and it defeats auto-merge (ticket 07). Not tested; whether the GitHub mobile app shows that button is unknown.

Recommendation: option 1.

## 3. Location data in issue attachments

**Docs:** GitHub's docs say nothing about removing EXIF or location from attachments. They do say: "For public repositories, uploaded files can be accessed without authentication." Sources: https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/attaching-files and https://docs.github.com/en/github-cli/github-cli/attaching-files-with-github-cli (`gh issue comment --attach`, needs push access; so uploading attachments without a browser *is* possible now).

**Test 1, CLI upload (done, 2026-11-26):** attached `gps-test.jpg` (copy of `tests/fixtures/photos-with-location/gps.jpg`, fake GPS) to issue #19 with `gh issue comment 19 --attach`. Downloaded `https://github.com/user-attachments/assets/de19e7c5-…` **without authentication**: the file is byte-identical to the original, `file` shows `GPS-Data`, and `hasLocationMetadata` returns `true`. **GitHub did not strip anything.**

**Test 2, phone upload (done, 2026-11-26):** the owner attached a photo to issue #19 from the GitHub app on a Pixel 9a (a fresh camera photo, `PXL_20261126_132913101`, not `gps-test.jpg`). Downloaded `https://github.com/user-attachments/assets/d1e1772d-…` **without authentication** (HTTP 200, 1.9 MB, 3000×4000): EXIF intact (`Google`, `Pixel 9a`, date), with a GPS block holding latitude and longitude (GPS tags 0–7, 16, 17, 29), and `hasLocationMetadata` returns `true`. **Neither the GitHub app nor GitHub's servers strip location.** The coordinates were not printed or recorded here; the downloaded copy was deleted.

**Action for the owner:** that comment on issue #19 holds a real photo with real coordinates and is public. Delete the comment; the asset URL may stay reachable for a while after that (earlier notes, Medium confidence), so ask GitHub Support to remove it if the location matters.

**Consequence:** a photo attached to a Request is public, with its original metadata, as soon as it's uploaded, before the workflow runs. Stripping in the workflow keeps location out of git, but not out of the attachment. ADR 0003's "Photos are attached to the Request, never committed raw" doesn't protect the home location on its own.

- Ticket 04's conditional checklist item applies: the workflow's comment must remind the owner to turn off location, and the spec and ADR must say attachments are public with their metadata. Consider also: the workflow checks each attachment with `hasLocationMetadata` and, if found, comments a warning in Portuguese telling the owner to delete that comment's image (deleting the comment may not remove the asset right away; earlier notes, Medium confidence).
- The phone setting is the real fix: iPhone camera location off, or share sheet → Options → Location off.

## Ticket impact summary

- **03:** use a GitHub App token for the push and PR instead of `gh workflow run`; add the app's creation to the owner steps; pick a free model (`gemini-3.8-flash`) via a config value; owner reads the actual limits in AI Studio; handle `429`.
- **06 ("refazer"):** force-pushes with the app token, so CI reruns normally.
- **07:** deploy after auto-merge: a push to `main` made by the app's merge triggers deploy normally; `gh workflow run` for the deploy is still fine (deploy isn't a required check).
- **04:** location is not stripped by GitHub; add the reminder and warning; update spec and ADR 0003.
- **Spec "CI on the workflow's commits"** and ADR 0003 need rewording once these are accepted.
