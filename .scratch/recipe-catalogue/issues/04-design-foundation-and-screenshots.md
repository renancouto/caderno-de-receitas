# 04: Design foundation and screenshot tests

**What to build:** The site looks like the chosen design: self-hosted fonts, colours, type scale and base page layout. Screenshot tests catch unintended visual changes, with reference screenshots always generated in Linux so they match CI.

**Blocked by:** 01 (Walking skeleton)

**Status:** done

Design reference: `.scratch/recipe-catalogue/design-verdict.md` and the `prototype/ui` branch (local only).

- [x] Fraunces (light) for headings, Newsreader for reading text, Libre Caslon Text for labels, quantities and dates, all self-hosted (no Google Fonts requests)
- [x] Colours: ivory background `#f9f4ea`, lines `#e6dccb`, ink `#1d1c1a`, muted `#6f6a62`, accent `#8a5a3b`; light theme only
- [x] Colours, fonts and spacing defined once as CSS custom properties and used everywhere
- [x] Base page layout is phone-first with generous spacing and a readable body size
- [x] Storybook uses the same fonts and base styles as the site
- [x] Playwright screenshot comparisons for key stories and both pages at phone width
- [x] Reference screenshots are generated in a Docker container using the official Playwright image, never on macOS; one `package.json` script updates them
- [x] The CI workflow runs the screenshot tests in the same image
- [x] A test or check confirms all text colour pairs meet WCAG AA contrast (axe, through the Storybook a11y addon and `@axe-core/playwright` on both built pages)

## Comments

Done. Rebased onto 02 and 03; the references did not change.

- Fonts come from `@fontsource/*` 5.3.0 (latin subsets only): Fraunces 300, Newsreader 400 + italic, Libre Caslon Text 400. Other weights or italics must be imported in `src/styles/tokens.css`. An e2e test checks the three families load and that every request stays on the site's origin.
- Tokens (`--color-*`, `--font-*`, `--text-*`, `--space-1..6`, `--measure`) live in `src/styles/tokens.css`; `src/styles/base.css` adds body styles and shared flat classes (`.page`, `.page-title`, `.section-title`, `.label`, `.link`, `.plain-list`). The site imports it in `Page.astro`, Storybook in `.storybook/preview.ts` (with `layout: "fullscreen"` so stories match the pages).
- Contrast: checked by axe (the industry-standard engine behind Lighthouse and Chrome DevTools audits): the Storybook a11y addon on every story, and `tests/e2e/accessibility.spec.ts` with `@axe-core/playwright` on both built pages, after fonts load.
- Screenshots: `tests/screenshots/screenshots.spec.ts` covers both pages and both stories on a Pixel 7 viewport, exact match (`maxDiffPixels: 0`). References are in `tests/screenshots/references/`. The screenshots project only exists when `SCREENSHOTS=1`, so `pnpm test:e2e` and `check` never compare screenshots on macOS. `check` does not run screenshots (it would need Docker); run `pnpm test:screenshots` after visual changes (noted in AGENTS.md).
- `pnpm test:screenshots` / `pnpm test:screenshots:update` run `scripts/screenshots.sh`: `mcr.microsoft.com/playwright:v<@playwright/test version>-noble` with `--platform linux/amd64`, Linux `node_modules` and pnpm store in named Docker volumes, then `pnpm screenshots:run`. On Apple silicon, the Docker host needs Rosetta: amd64 Chromium crashes under QEMU (e.g. use `colima start -p cilinux-fast`). The script doesn't depend on a Colima profile.
- CI: a `screenshots` job in `.github/workflows/ci.yml` runs in `mcr.microsoft.com/playwright:v1.65.1-noble` (`--ipc=host`): `pnpm install --frozen-lockfile`, then `pnpm screenshots:run`; diffs are uploaded from `test-results/` on failure. `build` needs it. Keep the image tag equal to `@playwright/test`.
- Base path: page screenshots use paths relative to the base URL (`./`, `recipes/carbonara-picante`), like the e2e tests.
- Tickets 05 and 08: no changes needed. Build on the tokens and shared classes, give new elements their own flat classes, and add screenshot cases to `tests/screenshots/screenshots.spec.ts` (story IDs are `components-<name>--<story>`).
