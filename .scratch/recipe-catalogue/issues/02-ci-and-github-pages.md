# 02: CI and publishing to GitHub Pages

**What to build:** Every pull request and every push to `main` runs the full test suite on GitHub Actions, and a push to `main` publishes the site to GitHub Pages at `renancouto.github.io/caderno-de-receitas` only when every test passes.

**Blocked by:** 01 (Walking skeleton)

**Status:** ready-for-agent

- [ ] A GitHub Actions workflow installs dependencies from the lockfile without changing it, then runs the format check, lint, type checking, unit tests, component tests and end-to-end tests on pull requests and pushes to `main`
- [ ] Later tickets add their checks (screenshot tests, photo location check) to the same workflow; leave room for them
- [ ] The deploy job depends on all test jobs and publishes the built site to GitHub Pages using the official Pages actions
- [ ] The site is built with the correct base path for a project site (`/caderno-de-receitas`), and links and assets work under it
- [ ] Turning on GitHub Pages with "GitHub Actions" as the source is a step only the owner can do in the repository settings: list it clearly for the owner rather than trying to do it
- [ ] The first deploy is verified: the published index and Recipe page load
