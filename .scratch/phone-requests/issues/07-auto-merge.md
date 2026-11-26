# 07: Auto-merge switch and "publicar direto"

**What to build:** A setting, off at first, lists which kinds of change merge automatically once the required checks pass: adding a Recipe, editing one, logging a Cook, changing the Rating. "publicar direto" in a Request auto-merges that one change. The site deploys after an auto-merge too.

**Blocked by:** 03 (Walking skeleton)

**Status:** wontfix

- [ ] The setting lives in one place the owner can change from the phone (for example a repository variable), with every kind off by default; documented in the spec
- [ ] Deciding whether to auto-merge is a small tested function: setting, kind of change, and "publicar direto"
- [ ] Auto-merge uses GitHub's auto-merge (squash) so it waits for the required checks
- [ ] After an auto-merge, the deploy runs (the merge to `main` happens through GitHub's auto-merge enabled with the GitHub App token, so the push to `main` starts CI and deploy; if it doesn't, start the deploy with `gh workflow run`, which is fine here because deploy isn't a required check)
- [ ] The pull request comment says whether it will merge automatically
- [ ] Tried for real with "publicar direto" on a small change

## Comments

Dropped on 2026-11-26: the owner changes the Catalogue only from the desktop. See the Outcome in `docs/adr/0003-phone-changes-through-requests.md`.
