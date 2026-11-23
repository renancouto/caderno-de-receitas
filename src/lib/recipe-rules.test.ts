import { describe, expect, it } from "vitest";
import { checkRecipe } from "./recipe-rules";

const valid = `---
title: Carbonara picante
ingredients:
  - items:
      - name: Espaguete
        quantity: 200
        unit: g
      - name: Ovos
        quantity: 2
      - name: Pimenta-do-reino
        toTaste: true
---

## Preparo

1. Cozinhe a massa.
2. Misture com os ovos.
`;

const problemsOf = (contents: string) => {
  const result = checkRecipe(contents);
  return result.ok ? [] : result.problems;
};

describe("checkRecipe", () => {
  it("parses a valid Recipe into title, Ingredients and Steps", () => {
    const result = checkRecipe(valid);
    expect(result).toEqual({
      ok: true,
      recipe: {
        title: "Carbonara picante",
        ingredients: [
          {
            items: [
              { name: "Espaguete", quantity: 200, unit: "g" },
              { name: "Ovos", quantity: 2 },
              { name: "Pimenta-do-reino", toTaste: true },
            ],
          },
        ],
        steps: ["Cozinhe a massa.", "Misture com os ovos."],
      },
    });
  });

  it("reports a missing title", () => {
    expect(problemsOf(valid.replace("title: Carbonara picante\n", ""))).toEqual([
      "The Recipe has no title.",
    ]);
  });

  it("reports a Recipe with no Ingredients", () => {
    const contents = valid.replace(/ingredients:[\s\S]*?---/, "ingredients: []\n---");
    expect(problemsOf(contents)).toEqual(["The Recipe has no Ingredients."]);
  });

  it("reports a Recipe with no Steps", () => {
    const contents = valid.replace(/## Preparo[\s\S]*/, "");
    expect(problemsOf(contents)).toEqual(['The Recipe has no Steps under a "Preparo" heading.']);
  });

  it("reports every problem at once", () => {
    expect(problemsOf("---\n---\n")).toHaveLength(3);
  });
});
