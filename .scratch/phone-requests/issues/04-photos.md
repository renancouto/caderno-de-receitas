# 04: Photos from a Request

**What to build:** Images attached to a Request become the Recipe's Photos, and "foto do passo N" makes one a Step photo. The workflow downloads them, removes location data and commits only the clean copies, placed and named like `@add-recipe` does.

**Blocked by:** 03 (Walking skeleton)

**Status:** wontfix

- [ ] Reading a Request finds its image attachments and any "foto do passo N" mention; unit tests cover none, one, several, and a Step mention with no matching Step
- [ ] Every image is stripped with the existing location code before it is committed; raw images are never committed
- [ ] Photos and Step photos placed in the Recipe's folder with the same names as `@add-recipe`; the Recipe file refers to them; `checkRecipe` and `check:photos` pass
- [ ] GitHub keeps location data in attachments (ticket 01; the spec and ADR already say so): the workflow's first comment on a Request with images reminds the owner to turn off location on the phone, and if `hasLocationMetadata` finds location in an attachment, the comment warns in Portuguese to delete that image from the Request
- [ ] Images are never sent to the model
- [ ] Tried once for real with a Request that has a Photo and a Step photo

## Comments

Dropped on 2026-11-26: the owner changes the Catalogue only from the desktop. See the Outcome in `docs/adr/0003-phone-changes-through-requests.md`.
