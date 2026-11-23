# 01: Walking skeleton: one Recipe, two pages, every test layer

**What to build:** An Astro + Preact site (ADR 0002) where a single Recipe file shows up as an entry on the index and on its own Recipe page, with its title, Ingredients and Steps. A first version of the recipe rules requires a title, at least one Ingredient and at least one Step, and the build fails without them. Each of the three test seams from the spec has its first passing test, so every later ticket only adds tests to working tooling.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Astro project with the Preact integration, TypeScript and plain CSS; all visual UI is Preact components and Astro pages only load content and render them
- [x] Recipes are Markdown files in one recipes folder, loaded through an Astro content collection that validates them with the recipe rules module
- [x] Recipe rules module: a pure function taking raw file contents and returning either the parsed Recipe or a list of problems; for now it checks title, Ingredients and Steps only
- [x] The index lists the Recipe and links to `/recipes/<file-name>`; the Recipe page shows title, Ingredients and Steps; interface text is in Brazilian Portuguese
- [x] The site name "Caderno de receitas" appears in the page titles
- [x] Vitest unit tests for the recipe rules (valid file, and each missing field)
- [x] Storybook with the official Preact framework and the Vitest addon, running stories as tests in Vitest browser mode with Playwright's Chromium; at least one story for a Recipe page component, with the a11y addon enabled and failing on violations
- [x] Playwright end-to-end test that builds the site from a test Recipes folder and checks the index entry and Recipe page
- [x] One `package.json` script runs each test layer, and one runs all of them
- [x] Dependencies are pinned to exact versions (no `^` or `~` ranges), the package manager is configured to save exact versions by default, and the lockfile is committed
- [x] An `.npmrc` with `save-exact=true`; the owner dropped the planned range-check script, and `AGENTS.md` tells agents to change dependencies only through `pnpm add`
- [x] Formatting with Oxfmt, including `.astro` files (its Astro support needs `@astrojs/compiler-rs` installed and the `astro` option turned on); a comment in the Oxfmt config explains this
- [x] Linting with Oxlint
- [x] Type checking with `astro check`, which covers `.astro` and TypeScript files (Oxc has no type checker)
- [x] Scripts for formatting, checking formatting, linting and type checking, and a single `check` script that runs all of them plus the tests
- [x] The UI prototype on the `prototype/ui` branch is not merged; this ticket starts from `main`

## Comments

Done. Differences from the ticket and notes for later tickets:

- Versions: Astro 7.4.13, Preact 11.2.0, Storybook 10.6.8, Vitest 5.1.1, Playwright 1.65.1, oxfmt 0.79.0, oxlint 1.94.0. TypeScript is 6.0.3, not the latest 7.x: `@astrojs/check` only accepts TypeScript 5 or 6.
- Recipe rules live in `src/lib/recipe-rules.ts` as `checkRecipe(contents)`, returning `{ ok: true, recipe }` or `{ ok: false, problems }`. Front matter is parsed with `yaml`; Steps are the numbered list under `## Preparo`. The file name rule is not checked yet (ticket 03).
- The content collection (`src/content.config.ts`) uses a custom loader that runs the rules and throws one error naming every failing file and its problems. The Recipes folder is `recipes/`, overridable with `RECIPES_DIR`; the output folder is overridable with `OUT_DIR`.
- `test:e2e` builds the site from `tests/e2e/recipes` into `dist-e2e/`, then Playwright serves it with `astro preview --ignore-lock`. Without `--ignore-lock`, Astro 7 detects a coding agent and starts the preview in the background, which breaks Playwright and leaves a server running.
- Storybook's a11y addon is set to `test: "error"` in `.storybook/preview.ts`; no Vitest setup file is needed (addon-vitest 10.3+ applies the annotations itself).
- Ticket 02 (CI): run `pnpm install --frozen-lockfile`, then `pnpm exec playwright install --with-deps chromium`, then `pnpm check` or the separate scripts. Ticket 02's base path will need `base` in `astro.config.ts`; the components currently link to `/` and `/recipes/<slug>` directly.
