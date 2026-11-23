# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`, never a single combined tickets file
- Triage state is recorded as a `Status:` line near the top of each issue file (see `triage-labels.md` for the role strings)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<feature-slug>/` (creating the directory if needed).

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## When a ticket is finished (closing work)

1. Set its `Status:` line to `done` and tick every checklist box the work satisfies; leave a box unticked only if the note says why. Keep the file: other tickets refer to it by number, and it records what was built.
2. Append a short note under `## Comments`: what changed compared with the ticket, and anything the next tickets should know.
3. Re-read every ticket it was blocking. If the implementation changed something they assume, update them now, and mention it in the note.

## Landing a ticket on `main`

Each ticket lands as **one squashed commit** on `main`, with history in a straight line.

1. The implementer works on its own `ticket-NN` branch and worktree, based on the latest `main`, committing as often as it likes.
2. After loop-review is finished, rebase onto the latest `main` and squash the branch into one commit: a subject of 72 characters or fewer, and `Closes NN` in the body.
3. Fast-forward `main` to it, with no merge commits, and push.
4. Delete the ticket's branch and worktree.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `.scratch/<effort>/map.md` (the Notes / Decisions-so-far / Fog body).
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `.scratch/<effort>/issues/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.
