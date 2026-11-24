# 07: Photos

**What to build:** A Recipe's first Photo appears as the full-width header image, resized for fast loading. A check fails CI if any committed Photo contains location metadata, because the repository is public.

**Blocked by:** 05 (Recipe page, complete)

**Status:** done

- [x] Photos live next to their Recipe as described in the spec; the recipe rules reject a Photo path that doesn't exist
- [x] The first Photo is used as the header image with a gradient so the title stays readable
- [x] Images are resized and served in modern formats with responsive sizes by Astro's image processing
- [x] A small reusable script removes location metadata from a Photo (used by `@add-recipe` in 11)
- [x] A test fails if any committed Photo contains GPS or other location metadata, and runs in CI
- [x] Stories and screenshot tests for the header with a Photo
- [x] End-to-end test checks the header image loads on the built site

## Comments

Done. Notes for later tickets (11, 13):

- Photo paths in `photos:` are relative to the recipes folder and must be `name.ext` or `<recipe-slug>/name.ext` (jpg, jpeg, png, webp, avif). `photoProblems(paths, slug, exists, kind = "Photo")` in `src/lib/photo-files.ts` does the existence and location-of-file rule; ticket 13 can call it for Step images with `kind = "Step image"`. `checkRecipe(contents, fileName, { fileExists })` runs it (the loader and `pnpm check:recipe` both pass a real `fileExists`; without the option Photos aren't checked).
- `src/lib/photo-location.ts`: `hasLocationMetadata(buffer)` (EXIF GPS pointer, XMP and IPTC place fields), `stripLocationMetadata(buffer)` (re-encodes without metadata, applying EXIF orientation), `findPhotosWithLocation(paths)`, `listCommittedPhotos()` (every image git tracks or would add, except `tests/fixtures/`, which holds a deliberate GPS Photo). Step images are covered by the check automatically, wherever they live.
- Scripts: `pnpm check:photos` (CI step in the existing "Format, lint, types, unit tests" job, no new job; also a unit test) and `pnpm strip:location <photo>...` (rewrites in place; for `@add-recipe` in 11).
- Photos reach Astro through the collection `image()` schema; the loader must pass data through `parseData` for that. `src/lib/responsive-photo.ts` (`responsivePhoto(ImageMetadata)`) builds avif and webp at 480/800/1200/1600 widths; ticket 13 can reuse it for Step images (get the `ImageMetadata` through the same schema, or `image()` in a `z.array`).
- The header Photo is decorative (`alt=""`, the title is text). `RecipePage` takes an optional `photo` prop (`ResponsivePhoto`), so stories pass a plain URL (`src/components/fixtures/header.jpg`). The gradient is `.has-photo::after`; header colours come from `--header-ink` and `--header-link`.
- New test Photo: `tests/e2e/recipes/bolo-de-cenoura/capa.jpg` (the Bolo header). The invalid-recipes build test also checks the missing-Photo message. New stories: `WithPhoto`, `WithoutPhoto`, `LongTitleWithPhoto`.
- `sharp` is now a pinned devDependency (it was already installed through Astro).
