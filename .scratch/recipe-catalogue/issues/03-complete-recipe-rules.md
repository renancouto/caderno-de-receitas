# 03: Complete recipe rules

**What to build:** Every rule from the spec is enforced. A Recipe that breaks any rule fails the build with a message naming the file and listing every problem, so a mistake is never published.

**Blocked by:** 01 (Walking skeleton)

**Status:** ready-for-agent

The Recipe file shape (from the spec, refined from the UI prototype's type):

```ts
type Unit = "g" | "ml" | "l" | "cup"; // cup = 250 ml

type Ingredient =
  | { name: string; quantity: number; unit?: Unit } // no unit = plain count
  | { name: string; toTaste: true };                // "a gosto"

type IngredientGroup = { name?: string; items: Ingredient[] };

type Cook = { date: string /* YYYY-MM-DD */; note?: string };

type RecipeData = {
  title: string;
  sources?: string[];   // URLs; none for an original Recipe
  servings?: number;
  totalMinutes?: number;
  tags?: string[];
  rating?: 1 | 2 | 3 | 4 | 5;
  photos?: string[];
  ingredients: IngredientGroup[];
  log?: Cook[];
};
```

Steps are a numbered list under a "Preparo" heading in the body; Notes are free text under "Notas".

- [ ] Only Standard Units, plain counts or "a gosto" are accepted; anything else (tbsp, tsp, pinch, oz, US cup) is a problem naming the Ingredient
- [ ] Quantities, servings and total time must be positive numbers
- [ ] Rating must be a whole number from 1 to 5
- [ ] Every Cook date must be a real date in `YYYY-MM-DD` form
- [ ] Every Source must be a URL; a Recipe with no Sources is valid
- [ ] At least one Ingredient overall; no empty Ingredient Group
- [ ] Steps must be a non-empty numbered list under "Preparo"
- [ ] The file name must be lowercase kebab-case
- [ ] All problems in a file are reported together, not just the first
- [ ] The build fails with the file name and every problem
- [ ] Unit tests: one case per rule, plus edge cases (Rating 0 and 6, "tbsp", empty group, 2026-02-30, accented Tags)
- [ ] End-to-end test: building with an invalid Recipe fails, and the output names the file and the problem
