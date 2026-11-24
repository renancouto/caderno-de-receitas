import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { checkRecipe } from "./recipe-rules.ts";

export function checkRecipeFile(path: string): { ok: boolean; message: string } {
  const result = checkRecipe(readFileSync(path, "utf8"), basename(path), {
    fileExists: (photo) => existsSync(join(dirname(path), photo)),
  });
  if (result.ok) return { ok: true, message: `${path}: ok` };
  return { ok: false, message: [`${path}:`, ...result.problems.map((p) => `- ${p}`)].join("\n") };
}
