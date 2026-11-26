# Phone changes go through Requests and a free model, in a public repository

The owner changes the Catalogue from the phone by opening a Request (a GitHub issue in plain Portuguese); a GitHub Actions workflow turns it into a pull request with a free model (Gemini's free tier), and the change is published only when that pull request is merged. Requests start every kind of change, because a sentence like "fiz a carbonara hoje, 4 estrelas" is easy to type on a phone while editing a Recipe file's front matter is not. The repository stays public on GitHub Pages: on GitHub Free, a private repository loses branch protection, which the required checks and auto-merge depend on.

## Considered Options

- **Pull requests as the starting point.** Fine for new Recipes, but logging a Cook would mean editing YAML on a phone, and photos committed to a pull request stay public for good, location data included.
- **A private repository on Cloudflare Pages.** Hides Requests and photos, but loses branch protection on GitHub Free. GitHub Pro (about $4 a month) would keep it; not worth it while the owner check and photo stripping cover the risks.
- **GitHub Models.** Shut down on 2026-07-30, so a free model now needs an API key from another provider.

## Consequences

- Only the owner can start the workflow (checked by numeric user ID), and a Request's text is untrusted input: the model only writes a Recipe file, which must pass the recipe rules and CI.
- Photos are attached to the Request, never committed raw; the workflow commits only copies with location data removed.
