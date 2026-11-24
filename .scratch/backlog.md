# Backlog

Ideas outside the first version (catalogue only). Each one should be ready to explore when picked up.

- **Website import**: paste a link and pull the recipe out of the page's structured recipe data, converted to Standard Units.
- **YouTube import**: build a draft recipe from a video's description or transcript.
- **Servings adjustment**: scale every quantity for a different number of servings.
- **Cooking mode**: large text, one step at a time, screen stays awake.
- **Shopping list**: combine ingredients from chosen recipes.
- **Meal planning**: plan recipes across a week.
- **Custom domain**: serve the site from a custom domain instead of `github.io`.
- **Bulk add**: give `@add-recipe` several links at once.
- **Add from phone**: open a GitHub issue with pasted recipe text, or a note about a Cook to log; a GitHub Actions job runs the AI step and opens a pull request for review. Needs an AI API key.
- **Log a Cook from phone, no AI**: a "Registrar preparo" GitHub issue form (Recipe, date, note, optional Rating) filled in from the GitHub mobile app. A GitHub Actions job edits the Recipe's Log with a plain script, runs `pnpm check:recipe`, opens a pull request and squash-merges it once the required checks pass, then closes the issue. The owner's text goes in exactly as written; a problem (unknown Recipe, bad date) is reported as a comment on the issue. Free, no API key. A simpler first step towards "Add from phone".
- **Letter index**: bring back the A–Z letter row and letter headings once there are about 30 Recipes.
