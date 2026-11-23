# 04: Design foundation and screenshot tests

**What to build:** The site looks like the chosen design: self-hosted fonts, colours, type scale and base page layout. Screenshot tests catch unintended visual changes, with reference screenshots always generated in Linux so they match CI.

**Blocked by:** 01 (Walking skeleton)

**Status:** ready-for-agent

Design reference: `.scratch/recipe-catalogue/design-verdict.md` and the `prototype/ui` branch (local only).

- [ ] Fraunces (light) for headings, Newsreader for reading text, Libre Caslon Text for labels, quantities and dates, all self-hosted (no Google Fonts requests)
- [ ] Colours: ivory background `#f9f4ea`, lines `#e6dccb`, ink `#1d1c1a`, muted `#6f6a62`, accent `#8a5a3b`; light theme only
- [ ] Colours, fonts and spacing defined once as CSS custom properties and used everywhere
- [ ] Base page layout is phone-first with generous spacing and a readable body size
- [ ] Storybook uses the same fonts and base styles as the site
- [ ] Playwright screenshot comparisons for key stories and both pages at phone width
- [ ] Reference screenshots are generated in a Docker container using the official Playwright image, never on macOS; one `package.json` script updates them
- [ ] The CI workflow runs the screenshot tests in the same image
- [ ] A test or check confirms all text colour pairs meet WCAG AA contrast
