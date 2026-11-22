# Page UI is written as Preact components, not Astro components

All visual UI (pages, sections and the interactive bits) is written as Preact components; Astro pages only load content and render those components. Astro is still the site generator. We chose this so every piece of UI can have a Storybook story tested in a real browser (Storybook's Vitest addon with Playwright), and Storybook has no official support for `.astro` components. Preact components render to static HTML at build time and ship no JavaScript unless explicitly hydrated, so the site stays nearly JavaScript-free.

## Considered Options

- Astro components with the community `@storybook-astro/framework`: rejected as less mature than the official Preact framework.
- Astro components for static UI, stories only for interactive Preact components: rejected because most of the UI would only be covered by end-to-end tests.
