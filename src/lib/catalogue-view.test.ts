import { describe, expect, test } from "vitest";
import {
  allTags,
  catalogueView,
  parseQuery,
  parseView,
  queryParam,
  viewSearch,
  slugFromUrl,
} from "./catalogue-view";

type Item = {
  slug: string;
  title: string;
  tags?: string[];
  rating?: number;
  totalMinutes?: number;
  timesMade: number;
  lastMade?: string;
};
const item = (slug: string, rest: Partial<Item> = {}): Item => ({
  slug,
  title: slug,
  timesMade: 0,
  ...rest,
});
const flatTitles = (view: Item[]) => view.map((r) => r.title);

describe("catalogueView", () => {
  const recipes = [
    item("b", { rating: 3, timesMade: 1, lastMade: "2026-01-10", tags: ["doce"] }),
    item("a", { rating: 5, timesMade: 4, lastMade: "2026-05-01", tags: ["doce", "festa"] }),
    item("c"),
    item("d", { rating: 5, timesMade: 4, lastMade: "2026-03-01", tags: ["salgado"] }),
    item("e", { rating: 1, timesMade: 7, lastMade: "2025-12-01" }),
  ];

  test("alphabetical order is one list by title in Portuguese order", () => {
    const accented = [item("Pudim"), item("Ébano"), item("Pão de queijo"), item("arroz doce")];
    expect(flatTitles(catalogueView(accented, { order: "alphabetical" }))).toEqual([
      "arroz doce",
      "Ébano",
      "Pão de queijo",
      "Pudim",
    ]);
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

  test("quickest puts the shortest total time first, ties by title, no time last", () => {
    const timed = [
      item("a", { totalMinutes: 60 }),
      item("b", { totalMinutes: 15 }),
      item("c"),
      item("d", { totalMinutes: 15 }),
      item("e", { totalMinutes: 0 }),
    ];
    expect(flatTitles(catalogueView(timed, { order: "quickest" }))).toEqual([
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
    expect(flatTitles(catalogueView(recipes, { order: "alphabetical", tag: "salgado" }))).toEqual([
      "d",
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

describe("search parameters", () => {
  test("reads the search text from the address", () => {
    expect(parseQuery("?q=bolo+de+cenoura&order=rating")).toBe("bolo de cenoura");
    expect(parseQuery("")).toBe("");
  });

  test("writes the search text and keeps order and Tag", () => {
    expect(queryParam("?order=rating&tag=doce", "pão")).toBe("?order=rating&tag=doce&q=p%C3%A3o");
    expect(queryParam("?q=bolo&order=rating", "")).toBe("?order=rating");
  });

  test("view changes keep the search text", () => {
    expect(viewSearch("?q=bolo", { order: "rating" })).toBe("?q=bolo&order=rating");
  });

  test("a result address gives the Recipe slug", () => {
    expect(slugFromUrl("/recipes/pao-de-queijo/")).toBe("pao-de-queijo");
    expect(slugFromUrl("/caderno-de-receitas/recipes/pudim.html")).toBe("pudim");
  });
});
