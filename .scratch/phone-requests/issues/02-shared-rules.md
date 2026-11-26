# 02: One rules document for the skills and the workflow

**What to build:** The rules `@add-recipe` and `@log-cook` follow (Normalising, translating and rewriting text from Sources, keeping the owner's wording for originals, the Recipe file format, file and photo names, adding a Cook, changing a Rating) live in one document. Both skills point to it, and the workflow in later tickets sends it to the model. Changing a rule then changes it everywhere.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] One rules document in the repository, written for a model that has only that document and the Request (no tools, no file access)
- [ ] `@add-recipe` and `@log-cook` point to it and keep only their own steps (finding files, running checks, landing)
- [ ] Nothing in the skills' behaviour changes; re-run one example of each skill to confirm
- [ ] Follows the guidance in the `writing-for-agents` skill
