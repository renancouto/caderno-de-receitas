# recipe-app

## Conventions

- Pin every dependency to an exact version, and commit the lockfile. Add and upgrade dependencies only with `pnpm add <name>@<version>` (`.npmrc` saves it exact); nothing checks hand-edited versions in `package.json`. The site ships only static files, so every package goes in `devDependencies` (`pnpm add -D`).
- Format with Oxfmt, lint with Oxlint, type check with `astro check`. Run the project's `check` script before handing back any change.
- Keep CSS selectors flat: one class per rule (`.ingredient`), not descendant chains (`.recipe-page ol li`). Give the element its own class instead. Oxlint doesn't lint CSS, so nothing checks this.

## Agent skills

The engineering skills in `.agents/skills/` are not committed. Restore them from `skills-lock.json` with `npx skills install`. Project-specific skills (`add-recipe`, `log-cook`) are committed; add a `.gitignore` exception for any new one.

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Uses the five default labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), recorded as a `Status:` line in each issue file. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root, created as needed. See `docs/agents/domain.md`.
