# 06: Running a Request again

**What to build:** Commenting "refazer" on a Request runs it again and replaces its pull request's contents. Editing the Request's text alone never reruns it.

**Blocked by:** 03 (Walking skeleton)

**Status:** ready-for-agent

- [ ] "refazer" (any case, as the whole comment) reruns with the Request's current text; unit test for recognising it
- [ ] The same branch is replaced (force-push) and the same pull request is updated; CI runs again; the guessed-conversions comment is replaced, not duplicated
- [ ] A Request that failed before (no pull request) gets one on a successful rerun
- [ ] Editing the issue's text does not start a run
