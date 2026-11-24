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

const validFileName = "carbonara-picante.md";

const check = (contents: string, fileName = validFileName) => checkRecipe(contents, fileName);

const problemsOf = (contents: string, fileName?: string) => {
  const result = check(contents, fileName);
  return result.ok ? [] : result.problems;
};

describe("checkRecipe", () => {
  it("parses a valid Recipe into title, Ingredients and Steps", () => {
    const result = check(valid);
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
        steps: [{ text: "Cozinhe a massa." }, { text: "Misture com os ovos." }],
      },
    });
  });

  it("returns every optional field, steps and Notes", () => {
    const contents = `---
title: Bolo
sources: ["https://example.com/a"]
servings: 4
totalMinutes: 30
tags: [massa, açaí]
rating: 5
photos: [a.jpg]
ingredients:
  - name: Base
    items:
      - name: Farinha
        quantity: 1
        unit: cup
log:
  - date: 2026-02-28
    note: boa
---

## Preparo

1. Asse.

## Notas

Fica melhor no dia seguinte.
`;
    expect(checkRecipe(contents, "bolo.md")).toEqual({
      ok: true,
      recipe: {
        title: "Bolo",
        sources: ["https://example.com/a"],
        servings: 4,
        totalMinutes: 30,
        tags: ["massa", "açaí"],
        rating: 5,
        photos: ["a.jpg"],
        ingredients: [{ name: "Base", items: [{ name: "Farinha", quantity: 1, unit: "cup" }] }],
        log: [{ date: "2026-02-28", note: "boa" }],
        steps: [{ text: "Asse." }],
        notes: "Fica melhor no dia seguinte.",
      },
    });
  });

  it("omits optional fields that are absent", () => {
    const result = check(valid);
    expect(result.ok && Object.keys(result.recipe).sort()).toEqual([
      "ingredients",
      "steps",
      "title",
    ]);
  });

  it("rejects Tags that are not text", () => {
    expect(problemsOf(valid.replace("ingredients:", "tags: [1]\ningredients:"))).toHaveLength(1);
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
    expect(problemsOf(contents)).toEqual([
      'The Recipe needs Steps: a numbered list under a "Preparo" heading.',
    ]);
  });

  it("reports every problem at once", () => {
    expect(problemsOf("---\n---\n")).toHaveLength(3);
  });

  describe("rules", () => {
    const withFront = (extra: string) => valid.replace("ingredients:", `${extra}\ningredients:`);
    const withIngredient = (lines: string) =>
      valid.replace("      - name: Ovos\n        quantity: 2\n", lines);
    const expectOne = (problems: string[], text: string) => {
      expect(problems).toHaveLength(1);
      expect(problems[0]).toContain(text);
    };

    it("accepts optional fields when valid", () => {
      const contents = withFront(
        'sources: ["https://example.com/a"]\nservings: 4\ntotalMinutes: 30\ntags: [massa, Pão-de-ló, açaí]\nrating: 5\nphotos: [a.jpg]\nlog:\n  - date: 2026-02-28\n    note: boa',
      );
      expect(problemsOf(contents)).toEqual([]);
    });

    it.each(["tbsp", "tsp", "pinch", "oz", "US cup"])(
      "rejects unit %s naming the Ingredient",
      (unit) => {
        const problems = problemsOf(
          withIngredient(`      - name: Ovos\n        quantity: 2\n        unit: ${unit}\n`),
        );
        expectOne(problems, "Ovos");
      },
    );

    it.each(["g", "ml", "l", "cup"])("accepts Standard Unit %s", (unit) => {
      expect(
        problemsOf(
          withIngredient(`      - name: Ovos\n        quantity: 2\n        unit: ${unit}\n`),
        ),
      ).toEqual([]);
    });

    it.each(["0", "-1", "abc"])("rejects quantity %s", (q) => {
      expectOne(problemsOf(withIngredient(`      - name: Ovos\n        quantity: ${q}\n`)), "Ovos");
    });

    it("rejects an Ingredient that is neither a quantity nor a gosto", () => {
      expectOne(problemsOf(withIngredient("      - name: Ovos\n")), "Ovos");
    });

    it.each(["servings: 0", "servings: -2", "totalMinutes: 0", "totalMinutes: x"])(
      "rejects %s",
      (line) => {
        expectOne(problemsOf(withFront(line)), line.split(":")[0]!);
      },
    );

    it.each(["0", "6", "3.5", "x"])("rejects rating %s", (r) => {
      expectOne(problemsOf(withFront(`rating: ${r}`)), "rating");
    });

    it.each(["2026-02-30", "2026-2-1", "28/02/2026", "not a date"])("rejects Cook date %s", (d) => {
      expectOne(problemsOf(withFront(`log:\n  - date: "${d}"`)), "Cook date");
    });

    it("rejects a non-URL Source", () => {
      expectOne(problemsOf(withFront("sources: [not a url]")), "not a url");
    });

    it("accepts a Recipe with no Sources", () => {
      expect(problemsOf(valid)).toEqual([]);
    });

    it("rejects an empty Ingredient Group", () => {
      const contents = valid.replace(
        "ingredients:\n",
        "ingredients:\n  - name: Molho\n    items: []\n",
      );
      expectOne(problemsOf(contents), "Molho");
    });

    it("rejects Steps that are not a numbered list", () => {
      const contents = valid.replace(/1\. [\s\S]*/, "Cozinhe tudo.\n");
      expectOne(problemsOf(contents), "Preparo");
    });

    it.each(["Carbonara.md", "carbonara_picante.md", "carbonara picante.md", "-a.md", "a--b.md"])(
      "rejects file name %s",
      (name) => {
        expectOne(problemsOf(valid, name), name);
      },
    );

    it.each(["carbonara-picante.md", "bolo-2.md"])("accepts file name %s", (name) => {
      expect(problemsOf(valid, name)).toEqual([]);
    });

    it("reports problems from several rules together", () => {
      const contents = withFront("rating: 0\nservings: -1");
      expect(problemsOf(contents, "Bad_Name.md")).toHaveLength(3);
    });
  });

  describe("Photos", () => {
    const withPhotos = valid.replace(
      "ingredients:",
      "photos: [carbonara-picante/capa.jpg, prato.png]\ningredients:",
    );
    const present = (...paths: string[]) => ({
      fileExists: (path: string) => paths.includes(path),
    });

    it("keeps the Photos in order when they exist", () => {
      const result = checkRecipe(
        withPhotos,
        validFileName,
        present("carbonara-picante/capa.jpg", "prato.png"),
      );
      expect(result.ok && result.recipe.photos).toEqual([
        "carbonara-picante/capa.jpg",
        "prato.png",
      ]);
    });

    it("names a Photo that doesn't exist", () => {
      const result = checkRecipe(withPhotos, validFileName, present("prato.png"));
      expect(result).toEqual({
        ok: false,
        problems: ['Photo "carbonara-picante/capa.jpg" does not exist.'],
      });
    });
  });

  describe("Step images", () => {
    const withImages = (...images: (string | undefined)[]) =>
      valid.replace(
        /1\. [\s\S]*/,
        ["Cozinhe a massa.", "Misture com os ovos."]
          .map((text, i) => `${i + 1}. ${text}\n${images[i] ? `   ![](${images[i]})\n` : ""}`)
          .join(""),
      );
    const all = () => true;
    const stepsOf = (contents: string, fileExists: (path: string) => boolean = all) => {
      const result = checkRecipe(contents, validFileName, { fileExists });
      return result.ok ? result.recipe.steps : result.problems;
    };

    it("reads Steps without images as text only", () => {
      expect(stepsOf(withImages())).toEqual([
        { text: "Cozinhe a massa." },
        { text: "Misture com os ovos." },
      ]);
    });

    it("attaches an image to its Step when some Steps have one", () => {
      expect(stepsOf(withImages(undefined, "carbonara-picante/passo-2.jpg"))).toEqual([
        { text: "Cozinhe a massa." },
        { text: "Misture com os ovos.", photo: "carbonara-picante/passo-2.jpg" },
      ]);
    });

    it("reads an image for every Step", () => {
      expect(stepsOf(withImages("passo-1.jpg", "passo-2.png"))).toEqual([
        { text: "Cozinhe a massa.", photo: "passo-1.jpg" },
        { text: "Misture com os ovos.", photo: "passo-2.png" },
      ]);
    });

    it("names a Step image that doesn't exist", () => {
      expect(stepsOf(withImages("passo-1.jpg"), () => false)).toEqual([
        'Step image "passo-1.jpg" does not exist.',
      ]);
    });

    it("rejects a Step image outside the Recipe's folder", () => {
      expect(stepsOf(withImages("outra/passo-1.jpg"))).toEqual([
        'Step image "outra/passo-1.jpg" must be next to the Recipe: in the recipes folder or in the folder "carbonara-picante".',
      ]);
    });
  });
});
