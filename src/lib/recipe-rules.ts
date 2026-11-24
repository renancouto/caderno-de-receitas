import { parse } from "yaml";
import { z } from "zod";
import { photoProblems } from "./photo-files.ts";

const units = ["g", "ml", "l", "cup"] as const;
const fileNamePattern = /^[a-z0-9]+(-[a-z0-9]+)*\.md$/;

const ingredientSchema = z.union([
  z.strictObject({
    name: z.string().trim().min(1),
    quantity: z.number().positive(),
    unit: z.enum(units).optional(),
  }),
  z.strictObject({ name: z.string().trim().min(1), toTaste: z.literal(true) }),
]);

const groupSchema = z.object({
  name: z.string().optional(),
  items: z.array(ingredientSchema).min(1),
});

const cookSchema = z.object({
  date: z.iso.date({
    error: (issue) => `Cook date "${String(issue.input)}" is not a real date in YYYY-MM-DD form.`,
  }),
  note: z.string().optional(),
});

const frontMatterSchema = z.object({
  title: z.string({ error: "The Recipe has no title." }).trim().min(1, "The Recipe has no title."),
  sources: z
    .array(
      z.url({
        protocol: /^https?$/,
        error: (issue) => `Source "${String(issue.input)}" is not a URL.`,
      }),
      { error: "sources must be a list of URLs." },
    )
    .optional(),
  servings: z
    .number({ error: "servings must be a positive number." })
    .positive("servings must be a positive number.")
    .optional(),
  totalMinutes: z
    .number({ error: "totalMinutes must be a positive number." })
    .positive("totalMinutes must be a positive number.")
    .optional(),
  tags: z.array(z.string(), { error: "tags must be a list of text values." }).optional(),
  rating: z
    .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)], {
      error: "rating must be a whole number from 1 to 5.",
    })
    .optional(),
  photos: z.array(z.string(), { error: "photos must be a list of text values." }).optional(),
  ingredients: z
    .array(groupSchema, { error: "The Recipe has no Ingredients." })
    .min(1, "The Recipe has no Ingredients."),
  log: z.array(cookSchema, { error: "log must be a list of Cooks." }).optional(),
});

export type Ingredient = z.infer<typeof ingredientSchema>;
export type IngredientGroup = z.infer<typeof groupSchema>;
export type Cook = z.infer<typeof cookSchema>;
export type Recipe = z.infer<typeof frontMatterSchema> & { steps: string[]; notes?: string };

export type RecipeCheck = { ok: true; recipe: Recipe } | { ok: false; problems: string[] };

const frontMatterPattern = /^---\r?\n([\s\S]*?)\r?\n?---\r?\n?([\s\S]*)$/;

function splitFile(contents: string): { data: unknown; body: string } {
  const match = frontMatterPattern.exec(contents);
  if (!match) return { data: {}, body: contents };
  return { data: parse(match[1] ?? ""), body: match[2] ?? "" };
}

function readSteps(body: string): string[] {
  const section = /^##\s+Preparo\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/m.exec(body);
  if (!section) return [];
  return [...(section[1] ?? "").matchAll(/^\s*\d+\.\s+(.+)$/gm)].map((m) => (m[1] ?? "").trim());
}

function readNotes(body: string): string | undefined {
  const section = /^##\s+Notas\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/m.exec(body);
  return section?.[1]?.trim() || undefined;
}

const lookup = (value: unknown, path: readonly PropertyKey[]): unknown =>
  path.reduce<unknown>(
    (current, key) =>
      typeof current === "object" && current !== null
        ? (current as Record<PropertyKey, unknown>)[key]
        : undefined,
    value,
  );

// Ingredient and Ingredient Group issues are rewritten from their path so each message names its location.
function describeIssue(issue: z.core.$ZodIssue, data: unknown): string {
  const [root, groupIndex, items, itemIndex] = issue.path;
  if (root !== "ingredients" || typeof groupIndex !== "number") return issue.message;

  const groupName = lookup(data, ["ingredients", groupIndex, "name"]);
  const group =
    typeof groupName === "string" && groupName.trim()
      ? `Ingredient Group "${groupName}"`
      : `Ingredient Group ${groupIndex + 1}`;
  if (items !== "items") return issue.message;
  if (itemIndex === undefined) return `${group} is empty.`;

  const ingredient = ["ingredients", groupIndex, "items", itemIndex];
  const name = lookup(data, [...ingredient, "name"]);
  if (typeof name !== "string" || !name.trim()) return `${group} has an Ingredient with no name.`;
  const unit = lookup(data, [...ingredient, "unit"]);
  return unit === undefined || units.some((u) => u === unit)
    ? `Ingredient "${name}" needs a positive quantity, or toTaste: true.`
    : `Ingredient "${name}" has the unit "${String(unit)}"; use g, ml, l, cup, or no unit.`;
}

// Read from the raw data so a missing Photo is reported alongside other problems; a malformed list is reported by the schema.
const listedPhotos = (data: unknown): string[] => {
  const photos = lookup(data, ["photos"]);
  return Array.isArray(photos) ? photos.filter((p): p is string => typeof p === "string") : [];
};

export type CheckOptions = {
  /** Whether a file exists, given its path relative to the recipes folder. Photos are only checked when given. */
  fileExists?: (path: string) => boolean;
};

export function checkRecipe(
  contents: string,
  fileName: string,
  { fileExists }: CheckOptions = {},
): RecipeCheck {
  const { data, body } = splitFile(contents);
  const parsed = frontMatterSchema.safeParse(data ?? {});
  const steps = readSteps(body);
  const notes = readNotes(body);

  const problems = [
    ...new Set([
      ...(fileNamePattern.test(fileName)
        ? []
        : [`The file name "${fileName}" must be lowercase kebab-case (like my-recipe.md).`]),
      ...(parsed.success ? [] : parsed.error.issues.map((issue) => describeIssue(issue, data))),
      ...(fileExists
        ? photoProblems(listedPhotos(data), fileName.replace(/\.md$/, ""), fileExists)
        : []),
      ...(steps.length > 0
        ? []
        : ['The Recipe needs Steps: a numbered list under a "Preparo" heading.']),
    ]),
  ];

  if (!parsed.success || problems.length > 0) return { ok: false, problems };
  return { ok: true, recipe: { ...parsed.data, steps, ...(notes ? { notes } : {}) } };
}
