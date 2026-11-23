import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { defineCollection } from "astro:content";
import type { Loader } from "astro/loaders";
import { checkRecipe } from "./lib/recipe-rules";

const recipesDir = process.env.RECIPES_DIR ?? "recipes";

function recipeLoader(): Loader {
  return {
    name: "recipe-loader",
    load: async ({ store, watcher }) => {
      watcher?.add(recipesDir);
      store.clear();
      const fileNames = (await readdir(recipesDir)).filter((name) => name.endsWith(".md"));
      const failures: string[] = [];
      for (const fileName of fileNames) {
        const filePath = join(recipesDir, fileName);
        const result = checkRecipe(await readFile(filePath, "utf8"));
        if (!result.ok) {
          failures.push(`${filePath}:\n${result.problems.map((p) => `  - ${p}`).join("\n")}`);
          continue;
        }
        store.set({ id: fileName.replace(/\.md$/, ""), data: result.recipe });
      }
      if (failures.length > 0) {
        throw new Error(`Invalid Recipes:\n${failures.join("\n")}`);
      }
    },
  };
}

export const collections = {
  recipes: defineCollection({ loader: recipeLoader() }),
};
