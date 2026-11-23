# 01: Walking skeleton: one Recipe, two pages, every test layer

**What to build:** An Astro + Preact site (ADR 0002) where a single Recipe file shows up as an entry on the index and on its own Recipe page, with its title, Ingredients and Steps. A first version of the recipe rules requires a title, at least one Ingredient and at least one Step, and the build fails without them. Each of the three test seams from the spec has its first passing test, so every later ticket only adds tests to working tooling.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Astro project with the Preact integration, TypeScript and plain CSS; all visual UI is Preact components and Astro pages only load content and render them
- [ ] Recipes are Markdown files in one recipes folder, loaded through an Astro content collection that validates them with the recipe rules module
- [ ] Recipe rules module: a pure function taking raw file contents and returning either the parsed Recipe or a list of problems; for now it checks title, Ingredients and Steps only
- [ ] The index lists the Recipe and links to `/recipes/<file-name>`; the Recipe page shows title, Ingredients and Steps; interface text is in Brazilian Portuguese
- [ ] The site name "Caderno de receitas" appears in the page titles
- [ ] Vitest unit tests for the recipe rules (valid file, and each missing field)
- [ ] Storybook with the official Preact framework and the Vitest addon, running stories as tests in Vitest browser mode with Playwright's Chromium; at least one story for a Recipe page component, with the a11y addon enabled and failing on violations
- [ ] Playwright end-to-end test that builds the site from a test Recipes folder and checks the index entry and Recipe page
- [ ] One `package.json` script runs each test layer, and one runs all of them
- [ ] Dependencies are pinned to exact versions (no `^` or `~` ranges), the package manager is configured to save exact versions by default, and the lockfile is committed
- [ ] Formatting with Oxfmt, including `.astro` files (its Astro support needs `@astrojs/compiler-rs` installed and the `astro` option turned on)
- [ ] Linting with Oxlint
- [ ] Type checking with `astro check`, which covers `.astro` and TypeScript files (Oxc has no type checker)
- [ ] Scripts for formatting, checking formatting, linting and type checking, and a single `check` script that runs all of them plus the tests
- [ ] The UI prototype on the `prototype/ui` branch is not merged; this ticket starts from `main`
