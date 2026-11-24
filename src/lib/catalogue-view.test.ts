import { describe, expect, test } from "vitest";
import { allTags, catalogueView, letterGroups, parseView, viewSearch } from "./catalogue-view";

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

type Item = {
  slug: string;
  title: string;
  tags?: string[];
  rating?: number;
  timesMade: number;
  lastMade?: string;
};
const item = (slug: string, rest: Partial<Item> = {}): Item => ({
  slug,
  title: slug,
  timesMade: 0,
  ...rest,
});
const flatTitles = (view: ReturnType<typeof catalogueView<Item>>) =>
  view.kind === "flat" ? view.recipes.map((r) => r.title) : [];

describe("catalogueView", () => {
  const recipes = [
    item("b", { rating: 3, timesMade: 1, lastMade: "2026-01-10", tags: ["doce"] }),
    item("a", { rating: 5, timesMade: 4, lastMade: "2026-05-01", tags: ["doce", "festa"] }),
    item("c"),
    item("d", { rating: 5, timesMade: 4, lastMade: "2026-03-01", tags: ["salgado"] }),
    item("e", { rating: 1, timesMade: 7, lastMade: "2025-12-01" }),
  ];

  test("alphabetical order keeps the letter groups", () => {
    const view = catalogueView(recipes, { order: "alphabetical" });
    expect(view.kind).toBe("grouped");
    if (view.kind === "grouped")
      expect(view.groups.map((g) => g.letter)).toEqual(["A", "B", "C", "D", "E"]);
  });

  test("rating puts the best first, ties by title, unrated last", () => {
    expect(flatTitles(catalogueView(recipes, { order: "rating" }))).toEqual([
      "a",
      "d",
      "b",
      "e",
      "c",
    ]);
  });

  test("times made puts the most made first, ties by title, never made last", () => {
    expect(flatTitles(catalogueView(recipes, { order: "times-made" }))).toEqual([
      "e",
      "a",
      "d",
      "b",
      "c",
    ]);
  });

  test("least recent puts the longest since last made first, never made last", () => {
    expect(flatTitles(catalogueView(recipes, { order: "least-recent" }))).toEqual([
      "e",
      "b",
      "d",
      "a",
      "c",
    ]);
  });

  test("a Tag filters the list and combines with the order", () => {
    expect(flatTitles(catalogueView(recipes, { order: "rating", tag: "doce" }))).toEqual([
      "a",
      "b",
    ]);
    const grouped = catalogueView(recipes, { order: "alphabetical", tag: "salgado" });
    expect(grouped.kind === "grouped" && grouped.groups).toEqual([
      { letter: "D", recipes: [recipes[3]] },
    ]);
  });

  test("a Tag no Recipe has shows nothing", () => {
    expect(flatTitles(catalogueView(recipes, { order: "rating", tag: "nada" }))).toEqual([]);
  });

  test("a set of slugs narrows the Recipes", () => {
    expect(
      flatTitles(catalogueView(recipes, { order: "rating", slugs: new Set(["b", "c"]) })),
    ).toEqual(["b", "c"]);
  });

  test("does not change its input", () => {
    const copy = [...recipes];
    catalogueView(recipes, { order: "times-made" });
    expect(recipes).toEqual(copy);
  });
});

describe("allTags", () => {
  test("lists each Tag once, in Portuguese order", () => {
    expect(
      allTags([{ tags: ["sobremesa", "Árabe"] }, { tags: ["festa", "sobremesa"] }, {}]),
    ).toEqual(["Árabe", "festa", "sobremesa"]);
  });
});

describe("view parameters", () => {
  test("reads order and Tag from the address", () => {
    expect(parseView("?order=rating&tag=doce")).toEqual({ order: "rating", tag: "doce" });
  });

  test("an unknown or missing order is alphabetical", () => {
    expect(parseView("")).toEqual({ order: "alphabetical" });
    expect(parseView("?order=bogus&tag=")).toEqual({ order: "alphabetical" });
  });

  test("writes only what differs from the default and keeps other parameters", () => {
    expect(viewSearch("?q=bolo", { order: "alphabetical" })).toBe("?q=bolo");
    expect(viewSearch("", { order: "times-made", tag: "café da tarde" })).toBe(
      "?order=times-made&tag=caf%C3%A9+da+tarde",
    );
    expect(viewSearch("?order=rating&tag=doce&q=x", { order: "alphabetical" })).toBe("?q=x");
    expect(viewSearch("?order=rating", { order: "rating" })).toBe("?order=rating");
    expect(viewSearch("?tag=x", { order: "alphabetical" })).toBe("");
  });
});
