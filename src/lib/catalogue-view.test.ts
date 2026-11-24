import { describe, expect, test } from "vitest";
import { letterGroups } from "./catalogue-view";

const recipe = (title: string) => ({ slug: title.toLowerCase(), title });

describe("letterGroups", () => {
  test("groups Recipes by first letter in alphabetical order", () => {
    const groups = letterGroups([recipe("Bolo"), recipe("Arroz"), recipe("Brigadeiro")]);
    expect(groups).toEqual([
      { letter: "A", recipes: [recipe("Arroz")] },
      { letter: "B", recipes: [recipe("Bolo"), recipe("Brigadeiro")] },
    ]);
  });

  test("accented titles group under their base letter and sort in Portuguese order", () => {
    const groups = letterGroups([
      recipe("Pudim"),
      recipe("Ébano"),
      recipe("Pão de queijo"),
      recipe("Panqueca"),
      recipe("Estrogonofe"),
    ]);
    expect(groups.map((group) => group.letter)).toEqual(["E", "P"]);
    expect(groups[0]!.recipes.map((r) => r.title)).toEqual(["Ébano", "Estrogonofe"]);
    expect(groups[1]!.recipes.map((r) => r.title)).toEqual(["Panqueca", "Pão de queijo", "Pudim"]);
  });

  test("lowercase titles group with uppercase ones", () => {
    const groups = letterGroups([recipe("arroz doce"), recipe("Abóbora")]);
    expect(groups).toEqual([{ letter: "A", recipes: [recipe("Abóbora"), recipe("arroz doce")] }]);
  });

  test("an empty Catalogue has no groups", () => {
    expect(letterGroups([])).toEqual([]);
  });
});
