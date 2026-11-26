# 04: Photos from a Request

**What to build:** Images attached to a Request become the Recipe's Photos, and "foto do passo N" makes one a Step photo. The workflow downloads them, removes location data and commits only the clean copies, placed and named like `@add-recipe` does.

**Blocked by:** 03 (Walking skeleton)

**Status:** ready-for-agent

- [ ] Reading a Request finds its image attachments and any "foto do passo N" mention; unit tests cover none, one, several, and a Step mention with no matching Step
- [ ] Every image is stripped with the existing location code before it is committed; raw images are never committed
- [ ] Photos and Step photos placed in the Recipe's folder with the same names as `@add-recipe`; the Recipe file refers to them; `checkRecipe` and `check:photos` pass
- [ ] If ticket 01 found that GitHub keeps location data in attachments, the workflow's first comment reminds the owner to turn off location before attaching, and the spec and ADR say so
- [ ] Tried once for real with a Request that has a Photo and a Step photo
