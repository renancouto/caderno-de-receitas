import { z } from "zod";
import { checkRecipe } from "../recipe-rules.ts";

export type NewRecipe = {
  fileName: string;
  contents: string;
  title: string;
  conversions: string[];
};

export type ReplyCheck = { ok: true; recipe: NewRecipe } | { ok: false; problems: string[] };

const replyShape = z.object({
  fileName: z.string(),
  contents: z.string(),
  conversions: z.array(z.string()),
});

/** Turn the model's JSON reply into a new Recipe file, checked against the recipe rules. */
export function readReply(outputText: string, existingFiles: string[]): ReplyCheck {
  let json: unknown;
  try {
    json = JSON.parse(outputText);
  } catch {
    return { ok: false, problems: ["The model's reply is not JSON."] };
  }
  const reply = replyShape.safeParse(json);
  if (!reply.success) return { ok: false, problems: ["The model's reply is missing fields."] };

  const { fileName, conversions } = reply.data;
  const contents = reply.data.contents.replace(/\r\n/g, "\n").trimEnd() + "\n";
  // No Photos exist for a new Recipe yet, so any listed Photo is reported as missing.
  const check = checkRecipe(contents, fileName, { fileExists: () => false });
  const problems = [
    ...(existingFiles.includes(fileName) ? [`The file "${fileName}" already exists.`] : []),
    ...(check.ok ? [] : check.problems),
    ...(check.ok && check.recipe.rating !== undefined ? ["A new Recipe has no rating."] : []),
    ...(check.ok && check.recipe.log !== undefined ? ["A new Recipe has no log."] : []),
  ];
  if (!check.ok || problems.length > 0) return { ok: false, problems };
  return {
    ok: true,
    recipe: {
      fileName,
      contents,
      title: check.recipe.title,
      conversions: conversions.map((c) => c.trim()).filter(Boolean),
    },
  };
}
