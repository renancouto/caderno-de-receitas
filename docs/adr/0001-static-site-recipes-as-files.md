# Static site with Recipes stored as files in git

The Catalogue is a static website rebuilt by CI whenever the repository changes, with each Recipe stored as a file in git rather than in a database. Only the owner edits it, so editing means committing a change; there is no editing interface, login, or server. This keeps the whole thing free to host and keeps the full history of every Recipe in git.

## Consequences

- Units are enforced when the site builds: a Recipe with a quantity that isn't in a Standard Unit fails the build instead of being published.
- Adding a Recipe from a phone needs a workflow outside the site, such as a GitHub issue that triggers CI.
