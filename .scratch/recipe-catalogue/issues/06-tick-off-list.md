# 06: Ticking off Ingredients and Steps

**What to build:** While cooking, the owner taps an Ingredient or Step to tick it off and taps again to untick it. Ticked items fade and are struck through. Ticks reset on reload.

**Blocked by:** 05 (Recipe page, complete)

**Status:** done

- [x] The tick-off list is the only hydrated part of the Recipe page; the rest stays JavaScript-free
- [x] Works by tap/click, with a visible focus style (keyboard ticking is not a requirement: the owner dropped it; the native `<button>` still works with the keyboard but is not tested or documented)
- [x] Exposes the ticked state to assistive technology
- [x] Ticked items fade and are struck through but stay readable
- [x] Ticks are kept in memory only and reset on reload
- [x] Without JavaScript, the lists still render as plain lists
- [x] Story play functions cover tick and untick by pointer (a `Default` and a `Ticked` story per list)
- [x] End-to-end test ticks an Ingredient and a Step on the built site

## Comments

Done. Notes for later tickets:

- `RecipePage.astro` hydrates only `IngredientList` and `StepList` (`client:load`, two islands), passed to `RecipePage` through the `ingredients` and `steps` slot props; without them `RecipePage` renders the lists itself (stories). Ticket 07 should add Photos without hydrating anything else.
- Each item is `TickItem`: a `<li class="X">` holding a `<button class="tick X-tick" aria-pressed>` (a plain `<div>` until hydrated, so no dead buttons without JavaScript). Ticked items get `X-ticked` (opacity 0.7, line-through). Ticket 13's Step image can be a second child of `.step` in grid column 2, beside the `.step-tick` button.
- Ticked state lives in `useTicks` (memory only). Ticking changed the existing Recipe page screenshot references slightly (button reset styles); all references were regenerated.

- Owner review: keyboard ticking was dropped as a requirement (no keyboard tests or stories). A ticked Step's number only gets lighter; the strikethrough applies to the Step text only (`.tick-struck`).
