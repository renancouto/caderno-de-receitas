# 13: Step photos

**What to build:** A Step can have its own photo, shown with that Step on the Recipe page. Step photos are entirely optional: a Recipe can have none, some Steps can have one, or every Step can.

**Blocked by:** 07 (Photos)

**Status:** ready-for-agent

Owner decisions (2026-11-23):

- A Step's photo is a Markdown image on its own line, indented under the Step in the "Preparo" list: `   ![](passo-3.jpg)`. No front matter field.
- The image sits above the Step text on every width (phone and wide), spanning the Step's text column to the right of its number (option A of the prototype, 2026-11-24).
- A ticked Step with a photo: the photo is greyed and faded, the text struck through, as in the prototype.
- Step photos follow the same rules as Photos (from 07): the file must exist next to the Recipe, and committed files carry no location metadata.
- `@add-recipe` (11) accepts Step photos too.

The throwaway prototype (local branch `prototype-13`, not merged) was approved with option A.

- [ ] The recipe rules read an optional image per Step and reject a Step photo whose file doesn't exist
- [ ] Steps without a photo look exactly as they do now
- [ ] Each Step photo is resized and served in modern formats with responsive sizes by Astro's image processing, with the Step text as context for its alternative text
- [ ] The photo is above the Step text at every width, as in the approved prototype
- [ ] The location metadata check from 07 covers Step photos
- [ ] `@add-recipe` places Step photos under the right Step and removes their location metadata
- [ ] Unit tests for reading Step photos (none, some, all, missing file)
- [ ] One story per state (no Step photos, some, all, ticked), widths via the viewport toolbar; a11y addon passes; screenshot tests for the main states at phone and wide widths
- [ ] End-to-end test: a Recipe with some Step photos shows each image with its Step
