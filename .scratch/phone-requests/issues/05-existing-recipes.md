# 05: Changing existing Recipes: edits, Cooks and Ratings

**What to build:** A Request about an existing Recipe ("fiz a carbonara hoje, 4 estrelas", "na carbonara, são 3 ovos") changes that Recipe: logging a Cook, changing the Rating, or editing its content. When it can't tell which Recipe is meant, the workflow asks on the Request and continues with the owner's next comment.

**Blocked by:** 03 (Walking skeleton)

**Status:** ready-for-agent

- [ ] The workflow decides whether a Request adds a Recipe or changes one, and which; unit tests for a clear match, several matches and no match
- [ ] Several or no matches: a Portuguese comment with a numbered list, and the run stops; the owner's next comment on the Request (an `issue_comment` run, same owner check) continues it
- [ ] Cooks are added newest first with today's date unless the Request says otherwise; the Rating changes only when the Request mentions one (same rules as `@log-cook`)
- [ ] Edits change only what the Request asks for; the rest of the Recipe file is unchanged (test with a recorded reply that changes more and is rejected, or a diff check)
- [ ] Tried for real: a Cook with a Rating, an edit, and an ambiguous Request
