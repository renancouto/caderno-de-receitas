---
Status: rejected
---

# Phone changes go through Requests and a free model, in a public repository

The owner changes the Catalogue from the phone by opening a Request (a GitHub issue in plain Portuguese); a GitHub Actions workflow turns it into a pull request with a free model (Gemini's free tier), and the change is published only when that pull request is merged. Requests start every kind of change, because a sentence like "fiz a carbonara hoje, 4 estrelas" is easy to type on a phone while editing a Recipe file's front matter is not. The repository stays public on GitHub Pages: on GitHub Free, a private repository loses branch protection, which the required checks and auto-merge depend on.

## Considered Options

- **Pull requests as the starting point.** Fine for new Recipes, but logging a Cook would mean editing YAML on a phone, and photos committed to a pull request stay public for good, location data included.
- **A private repository on Cloudflare Pages.** Hides Requests and photos, but loses branch protection on GitHub Free. GitHub Pro (about $4 a month) would keep it; not worth it while the owner check and photo stripping cover the risks.
- **GitHub Models.** Shut down on 2026-07-30, so a free model now needs an API key from another provider.

## Consequences

- Only the owner can start the workflow (checked by numeric user ID), and a Request's text is untrusted input: the model only writes a Recipe file, which must pass the recipe rules and CI.
- Photos are attached to the Request, never committed raw; the workflow commits only copies with location data removed. GitHub keeps location data in attachments (tested; see `.scratch/phone-requests/research.md`), and attachments on a public repository are public as soon as they're uploaded, so the owner must turn off location on the phone before attaching; the workflow reminds them and warns when an attachment still has it. Photos are never sent to the model, whose free tier may use what it receives.
- The workflow pushes and opens pull requests with a GitHub App token, so CI runs on them and counts as the required checks; the Action's own token and `gh workflow run` don't achieve that. The app's ID and private key are repository secrets.

## Outcome (2026-11-26)

Abandoned after the first real tries. Too many parties (Gemini's free tier, a GitHub App, three secrets, a workflow) for a personal site, and each was a way for it to break: the first Request failed on a key the model refused from GitHub Actions. The owner changes the Catalogue only from the desktop, with the `add-recipe` and `log-cook` skills. The shared rules document (`docs/recipe-rules.md`) stays, since both skills use it.
