# 06: Ticking off Ingredients and Steps

**What to build:** While cooking, the owner taps an Ingredient or Step to tick it off and taps again to untick it. Ticked items fade and are struck through. Ticks reset on reload.

**Blocked by:** 05 (Recipe page, complete)

**Status:** ready-for-agent

- [ ] The tick-off list is the only hydrated part of the Recipe page; the rest stays JavaScript-free
- [ ] Works by tap/click and by keyboard (Space and Enter), with a visible focus style
- [ ] Exposes the ticked state to assistive technology
- [ ] Ticked items fade and are struck through but stay readable
- [ ] Ticks are kept in memory only and reset on reload
- [ ] Without JavaScript, the lists still render as plain lists
- [ ] Story play functions cover tick and untick by pointer and by keyboard
- [ ] End-to-end test ticks an Ingredient and a Step on the built site
