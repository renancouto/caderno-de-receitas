import { parse } from "yaml";

export type Unit = "g" | "ml" | "l" | "cup";

export type Ingredient =
  | { name: string; quantity: number; unit?: Unit }
  | { name: string; toTaste: true };

export type IngredientGroup = { name?: string; items: Ingredient[] };

export type Recipe = {
  title: string;
  ingredients: IngredientGroup[];
  steps: string[];
};

export type RecipeCheck = { ok: true; recipe: Recipe } | { ok: false; problems: string[] };

const frontMatterPattern = /^---\r?\n([\s\S]*?)\r?\n?---\r?\n?([\s\S]*)$/;

function splitFile(contents: string): { data: Record<string, unknown>; body: string } {
  const match = frontMatterPattern.exec(contents);
  if (!match) return { data: {}, body: contents };
  const data: unknown = parse(match[1] ?? "");
  return {
    data: typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {},
    body: match[2] ?? "",
  };
}

function readSteps(body: string): string[] {
  const section = /^##\s+Preparo\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/m.exec(body);
  if (!section) return [];
  return [...(section[1] ?? "").matchAll(/^\s*\d+\.\s+(.+)$/gm)].map((m) => (m[1] ?? "").trim());
}

function readIngredients(value: unknown): IngredientGroup[] {
  if (!Array.isArray(value)) return [];
  return value as IngredientGroup[];
}

export function checkRecipe(contents: string): RecipeCheck {
  const { data, body } = splitFile(contents);
  const problems: string[] = [];

  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) problems.push("The Recipe has no title.");

  const ingredients = readIngredients(data.ingredients);
  if (!ingredients.some((group) => Array.isArray(group?.items) && group.items.length > 0)) {
    problems.push("The Recipe has no Ingredients.");
  }

  const steps = readSteps(body);
  if (steps.length === 0) problems.push('The Recipe has no Steps under a "Preparo" heading.');

  if (problems.length > 0) return { ok: false, problems };
  return { ok: true, recipe: { title, ingredients, steps } };
}
