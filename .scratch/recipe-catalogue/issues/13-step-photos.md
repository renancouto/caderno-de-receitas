# 13: Step photos

**What to build:** A Step can have its own photo, shown with that Step on the Recipe page. Step photos are entirely optional: a Recipe can have none, some Steps can have one, or every Step can.

**Blocked by:** 07 (Photos)

**Status:** done

Owner decisions (2026-11-23):

- A Step's photo is a Markdown image on its own line, indented under the Step in the "Preparo" list: `   ![](passo-3.jpg)`. No front matter field.
- The image sits above the Step text on every width (phone and wide), spanning the Step's text column to the right of its number (option A of the prototype, 2026-11-24).
- A ticked Step with a photo: the photo is greyed and faded, the text struck through, as in the prototype.
- Step photos follow the same rules as Photos (from 07): the file must exist next to the Recipe, and committed files carry no location metadata.
- `@add-recipe` (11) accepts Step photos too.

The throwaway prototype (local branch `prototype-13`, not merged) was approved with option A.

- [x] The recipe rules read an optional image per Step and reject a Step photo whose file doesn't exist
- [x] Steps without a photo look exactly as they do now
- [x] Each Step photo is resized and served in modern formats with responsive sizes by Astro's image processing, with the Step text as context for its alternative text
- [x] The photo is above the Step text at every width, as in the approved prototype
- [x] The location metadata check from 07 covers Step photos
- [ ] `@add-recipe` places Step photos under the right Step and removes their location metadata
- [x] Unit tests for reading Step photos (none, some, all, missing file)
- [x] One story per state (no Step photos, some, all, ticked), widths via the viewport toolbar; a11y addon passes; screenshot tests for the main states at phone and wide widths
- [x] End-to-end test: a Recipe with some Step photos shows each image with its Step

## Comments

Done, except the `@add-recipe` box: that skill is ticket 11, which now lists Step photos (see below).

- How a Step image is written (for 11): a Markdown image on its own line, indented under its Step in the "Preparo" list, path relative to the recipes folder like `photos:` (so `name.jpg` or `<recipe-slug>/name.jpg`):

  ```markdown
  1. Bata a cenoura e os ovos no liquidificador.
     ![](bolo-de-cenoura/passo-1.jpg)
  ```

  The alt text in the brackets is ignored; leave it empty. Only the first image line under a Step counts (a later one replaces it). Run `pnpm strip:location` on each Step image, like Photos.
- `Recipe.steps` is now `Step[]` (`{ text, photo? }`) instead of `string[]`. Any code reading Steps (search in 10, the skills) must use `step.text`.
- The recipe rules check Step images with `photoProblems(..., "Step image")` (same folder, extension and existence rules as Photos). `pnpm check:photos` already covers them, as it scans every committed image.
- The collection schema resolves `steps[].photo` with `image()`; the page builds each one with `responsivePhoto()`. `StepList` takes `StepView[]` (`{ text, photo?: ResponsivePhoto }`).
- Alternative text is empty: the image sits inside the Step's button, and the Step text right below it describes it, so the button's name stays the Step text.
- The image sits above the text at every width (option A). A ticked Step's image is greyed and faded (`.step-photo-ticked`).
- Stories: `StepList` `Default` (no photos), `SomePhotos`, `AllPhotos`, `Ticked` (now with photos). Screenshots of the photo stories and the full Recipe page at phone and 1280 px (`-wide`).
- Test Recipe `bolo-de-cenoura` now has images on Steps 1 and 3; the header-image e2e test's `picture source` selector was scoped to the header.
