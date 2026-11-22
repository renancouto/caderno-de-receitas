# UI prototype verdict

Question: what should the catalogue and recipe pages look like?

Prototype: branch `prototype/ui` (`pnpm dev`, then `/prototype/catalogue`).

- Layout: variant C on both pages. Catalogue is an A–Z cookbook index with dot leaders; recipe page is editorial (hero, facts strip, ingredient table with right-aligned quantities, large step numerals, notes as a pull quote, log as a timeline).
- Typography: Fraunces (light) for headings, Newsreader for reading text, Libre Caslon Text for labels, quantities, dates and meta.
- Light theme only.
- Colours: ivory background `#f9f4ea`, lines `#e6dccb`, ink `#1d1c1a`, muted `#6f6a62`, accent `#8a5a3b` (all small text passes WCAG AA).
- Notes on the recipe page are understated: small "Notas" label, muted italic body text, thin top rule. Not a pull quote.
- Catalogue index gets an underlined search field, text-link sort options (A–Z keeps letter groups; other orders show a flat list with the matching value on the right), and tags as small text links.
- Ticked ingredients and steps fade and get struck through.
