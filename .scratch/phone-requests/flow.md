# Requests: from the phone to the live site

```mermaid
sequenceDiagram
  autonumber
  actor Owner as You (phone)
  participant Issue as GitHub issue
  participant Bot as Update workflow
  participant Model as Free model
  participant PR as Pull request
  participant CI as CI checks
  participant Site as GitHub Pages

  Owner->>Issue: Open an issue: "Nova receita: bolo de fubá…" + Source links + photos
  Issue->>Bot: issue opened
  Bot->>Bot: Only you? (author and trigger = your user ID)
  Bot->>Bot: Download photos, strip location
  Bot->>Model: Issue text + the shared rules (no photos)
  Model-->>Bot: Recipe file (Portuguese, Standard Units)
  Bot->>Bot: Recipe rules check
  alt Rules fail or model unavailable
    Bot->>Issue: Comment: what went wrong
    Owner->>Issue: Edit the text, or comment "refazer"
    Issue->>Bot: run again
  else Rules pass
    Bot->>PR: Branch + commit (Recipe + clean photos), PR linked to the issue
    Bot->>PR: Comment: guessed conversions
    PR->>CI: Pull request opened by the GitHub App starts the checks
    CI-->>PR: Format, types, tests, screenshots
    Bot->>Issue: Comment: link to the PR
  end
  Owner->>PR: Review on the phone (fix in the PR if needed)
  Owner->>PR: Merge
  PR->>Issue: Issue closes automatically
  PR->>CI: Checks on main
  CI->>Site: Build and deploy
  Site-->>Owner: Recipe live at renancouto.github.io/minhas-receitas
```

- Logging a Cook or changing a Rating follows the same path, starting from a sentence like "fiz a carbonara hoje, 4 estrelas".
- Nothing is published before you merge the PR.
