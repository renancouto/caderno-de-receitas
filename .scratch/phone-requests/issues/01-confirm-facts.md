# 01: Confirm the three facts the design depends on

**What to build:** A short research note (`.scratch/phone-requests/research.md`) that confirms, with sources and tests where possible, the facts the rest of the tickets rely on. If any answer differs from the spec's assumption, say which tickets change and how.

**Blocked by:** None (can start immediately)

**Status:** done

Starting point: `/private/var/folders/_9/3r84t7ws287502jrf2vvpzjw0000gp/T/opencode/recipe-notes/research-pr-recipes.md` (earlier research; copy what's still true into the note).

- [x] Gemini free tier through Google AI Studio: current request and token limits for a model good at Portuguese, whether free-tier use is allowed from GitHub Actions, and whether it supports a JSON-shaped reply
- [x] Checks started with `gh workflow run` on a pull request's branch: do they count as the required checks for that pull request under branch protection? Test it on a throwaway pull request in this repository (add `workflow_dispatch` to CI on that branch only), then close the pull request and delete the branch
- [x] Location data in issue attachments: prepare a small test image with fake GPS coordinates; the owner attaches it to a throwaway issue from the phone (owner-only step, list it clearly); download the attachment and check it with `exiftool` or the existing location check; then close the issue
- [x] For each fact: the answer, the source or test, and the date

## Comments

Done 2026-11-26; findings in [`../research.md`](../research.md).

- Gemini free tier: usable with JSON Schema replies (`gemini-3.8-flash` suggested); free limits are only visible in AI Studio; free-tier prompts may be used by Google, so photos are never sent to the model.
- `gh workflow run` checks do **not** count for a pull request (tested on PR #18). The method is now a GitHub App token; tickets 03, 06 and 07, the spec, `flow.md` and ADR 0003 were updated.
- GitHub keeps location data in attachments, from the CLI and from the GitHub app on the phone (issue #19, now closed). Ticket 04, the spec and ADR 0003 were updated with the reminder and warning. The phone test used a real photo with real coordinates; the owner should delete that comment on #19.

