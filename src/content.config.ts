import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import type { Loader } from "astro/loaders";
import { checkRecipe } from "./lib/recipe-rules";

const recipesDir = process.env.RECIPES_DIR ?? "recipes";

function recipeLoader(): Loader {
  return {
    name: "recipe-loader",
    load: async ({ store, watcher, parseData }) => {
      watcher?.add(recipesDir);
      store.clear();
      const fileNames = (await readdir(recipesDir)).filter((name) => name.endsWith(".md"));
      const failures: string[] = [];
      for (const fileName of fileNames) {
        const filePath = join(recipesDir, fileName);
        const result = checkRecipe(await readFile(filePath, "utf8"), fileName, {
          fileExists: (photo) => existsSync(join(recipesDir, photo)),
        });
        if (!result.ok) {
          failures.push(`${filePath}:\n${result.problems.map((p) => `  - ${p}`).join("\n")}`);
          continue;
        }
        // parseData turns each Photo path into an Astro image, resolved next to the Recipe file.
        const id = fileName.replace(/\.md$/, "");
        const data = await parseData({ id, data: result.recipe, filePath: resolve(filePath) });
        store.set({ id, data, filePath });
      }
      if (failures.length > 0) {
        throw new Error(`Invalid Recipes:\n${failures.join("\n")}`);
      }
    },
  };
}

export const collections = {
  recipes: defineCollection({
    loader: recipeLoader(),
    // Only resolves Photo and Step image paths into Astro images; the Recipe rules have already validated the data.
    schema: ({ image }) =>
      z.looseObject({
        photos: z.array(image()).optional(),
        steps: z.array(z.looseObject({ text: z.string(), photo: image().optional() })),
      }),
  }),
};
