# 07: Photos

**What to build:** A Recipe's first Photo appears as the full-width header image, resized for fast loading. A check fails CI if any committed Photo contains location metadata, because the repository is public.

**Blocked by:** 05 (Recipe page, complete)

**Status:** ready-for-agent

- [ ] Photos live next to their Recipe as described in the spec; the recipe rules reject a Photo path that doesn't exist
- [ ] The first Photo is used as the header image with a gradient so the title stays readable
- [ ] Images are resized and served in modern formats with responsive sizes by Astro's image processing
- [ ] A small reusable script removes location metadata from a Photo (used by `@add-recipe` in 11)
- [ ] A test fails if any committed Photo contains GPS or other location metadata, and runs in CI
- [ ] Stories and screenshot tests for the header with a Photo
- [ ] End-to-end test checks the header image loads on the built site
