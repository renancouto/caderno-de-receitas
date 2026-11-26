# 06: Running a Request again

**What to build:** Commenting "refazer" on a Request runs it again and replaces its pull request's contents. Editing the Request's text alone never reruns it.

**Blocked by:** 03 (Walking skeleton)

**Status:** wontfix

- [ ] "refazer" (any case, as the whole comment) reruns with the Request's current text; unit test for recognising it
- [ ] The same branch is replaced (force-push) and the same pull request is updated, with the GitHub App token so CI runs again; the guessed-conversions comment is replaced, not duplicated
- [ ] A Request that failed before (no pull request) gets one on a successful rerun
- [ ] Editing the issue's text does not start a run

## Comments

Dropped on 2026-11-26: the owner changes the Catalogue only from the desktop. See the Outcome in `docs/adr/0003-phone-changes-through-requests.md`.
