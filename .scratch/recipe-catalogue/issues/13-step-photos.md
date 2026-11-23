# 13: Step photos

**What to build:** A Step can have its own photo, shown with that Step on the Recipe page. Step photos are entirely optional: a Recipe can have none, some Steps can have one, or every Step can.

**Blocked by:** 07 (Photos)

**Status:** needs-triage

Owner decisions (2026-11-23):

- A Step's photo is a Markdown image on its own line, indented under the Step in the "Preparo" list: `   ![](passo-3.jpg)`. No front matter field.
- On phones the image sits above the Step text.
- Step photos follow the same rules as Photos (from 07): the file must exist next to the Recipe, and committed files carry no location metadata.
- `@add-recipe` (11) accepts Step photos too.

Before building, a throwaway Storybook prototype shows the design (phone and wide screen, Recipes with no, some and all Step photos) for the owner to approve. Then set this ticket to `ready-for-agent`.

- [ ] The recipe rules read an optional image per Step and reject a Step photo whose file doesn't exist
- [ ] Steps without a photo look exactly as they do now
- [ ] Each Step photo is resized and served in modern formats with responsive sizes by Astro's image processing, with the Step text as context for its alternative text
- [ ] On phones the photo is above the Step text; the wide-screen layout follows the approved prototype
- [ ] The location metadata check from 07 covers Step photos
- [ ] `@add-recipe` places Step photos under the right Step and removes their location metadata
- [ ] Unit tests for reading Step photos (none, some, all, missing file)
- [ ] Stories for none, some and all Steps with photos; a11y addon passes; screenshot tests for the main states
- [ ] End-to-end test: a Recipe with some Step photos shows each image with its Step
