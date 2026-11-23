# 02: CI and publishing to GitHub Pages

**What to build:** Every pull request and every push to `main` runs the full test suite on GitHub Actions, and a push to `main` publishes the site to GitHub Pages at `renancouto.github.io/caderno-de-receitas` only when every test passes.

**Blocked by:** 01 (Walking skeleton)

**Status:** done

- [x] A GitHub Actions workflow installs dependencies from the lockfile without changing it, then runs the format check, lint, type checking, unit tests, component tests and end-to-end tests on pull requests and pushes to `main`
- [x] Later tickets add their checks (screenshot tests, photo location check) to the same workflow; leave room for them
- [x] The deploy job depends on all test jobs and publishes the built site to GitHub Pages using the official Pages actions
- [x] The site is built with the correct base path for a project site (`/caderno-de-receitas`), and links and assets work under it
- [x] Turning on GitHub Pages with "GitHub Actions" as the source is a step only the owner can do in the repository settings: list it clearly for the owner rather than trying to do it
- [x] The first deploy is verified: the published index and Recipe page load

## Comments

Done, except the last box: the first deploy is still to be verified by the coordinator after landing on `main`.

- Workflow `.github/workflows/ci.yml`: jobs `static` (format, lint, types, unit) and `browser` (components, e2e) run on PRs and pushes to `main`; `build` and `deploy` run only on `main` and need both. Later tickets add their jobs and list them in `needs` of `build` (a comment marks the spot).
- Base path: `astro.config.ts` sets `site` and `base: "/caderno-de-receitas"`. Components build links with `url()` from `src/lib/paths.ts`; use it for every internal link and asset. The e2e test runs under the base too (`baseURL` and `goto("./")` in Playwright).
- `package.json` has `packageManager: pnpm@10.34.9`, which `pnpm/action-setup` needs.
- Owner step: Pages source set to "GitHub Actions" (already done).
- First deploy verified after landing: the index and `/recipes/carbonara-picante/` load at `renancouto.github.io/caderno-de-receitas` (CI run 45128308886).
